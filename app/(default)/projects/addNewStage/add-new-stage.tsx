"use client";

import { createStage, updateStatusProject } from "@/app/actions";
import { useState, useEffect, useRef, useCallback } from "react";
import type { addStage } from "@/app/actions";
import { fetchClientQAs } from "@/app/actions";
import { useNotification } from "@/app/notifications-context";
import { Project } from "@/app/types";
import Script from 'next/script';

// Declare global variables
declare global {
  interface Window {
    gapi: any;
    google: any;
    tokenClient: any;
    isGapiLoaded: boolean;
    isGisLoaded: boolean;
  }
}


export default function AddStageForm({
    setAddStageModalOpen,
    projectId,
    setUrl,
    stages,
    thisProject
}: {
    setAddStageModalOpen: (addStage: boolean) => void;
    projectId: string;
    setUrl: (url: string) => void;
    stages: Array<{ id: string; docType: string; docUrl: string; name: string }>;
    thisProject: Project;
}) {
    const { addNotification } = useNotification();
    const ref = useRef<HTMLFormElement>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("Feature Stories");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [docType, setDocType] = useState<string>("Article");
    const [selectedArticleUrl, setSelectedArticleUrl] = useState<string | null>(null);
    const [pickerInited, setPickerInited] = useState(false);
    const [gisInited, setGisInited] = useState(false);
    const [isGoogleApisReady, setIsGoogleApisReady] = useState(false);
    const [selectedFile, setSelectedFile] = useState<{ id: string, name: string } | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<{ id: string, name: string } | null>(null);
    const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
    const [qaList, setQaList] = useState<Array<{ id: number, fileName: string }>>([]);
    const [selectedQa, setSelectedQa] = useState<string>("default");
    const [isBusinessName, setIsBusinessName] = useState(false);
    const TOKEN_EXPIRY_BUFFER = 300; // 5 minutes in seconds
    const DEFAULT_TOKEN_LIFETIME = 3600; // 1 hour in seconds

    interface TokenInfo {
      accessToken: string;
      expiryTime?: number;
    }

    // Fetch QAs on component mount
    useEffect(() => {
        async function loadQAs() {
            const qas = await fetchClientQAs(projectId);
            const formattedQAs = qas.map(qa => ({
                id: qa.id,
                fileName: qa.fileName || ''
            }));
            setQaList(formattedQAs);
        }
        loadQAs();
    }, [projectId]);

    const checkGoogleApisReady = useCallback(() => {
        if (window.isGapiLoaded && window.isGisLoaded) {
            setIsGoogleApisReady(true);
        }
    }, []);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('googleDriveAccessToken');
        const storedExpiry = sessionStorage.getItem('googleDriveTokenExpiry');
        if (storedToken) {
            setTokenInfo({
                accessToken: storedToken,
                expiryTime: storedExpiry ? parseInt(storedExpiry, 10) : undefined
            });
        }
    }, []);

    const isTokenValid = useCallback((tokenInfo: TokenInfo | null): boolean => {
        if (!tokenInfo || !tokenInfo.accessToken) return false;
        
        const currentTime = Math.floor(Date.now() / 1000);
        if (tokenInfo.expiryTime) {
            return currentTime < tokenInfo.expiryTime - TOKEN_EXPIRY_BUFFER;
        } else {
            // If we don't have an expiry time, assume the token is valid for the default lifetime
            const storedTime = sessionStorage.getItem('googleDriveTokenStoredTime');
            if (!storedTime) return false;
            
            const elapsedTime = currentTime - parseInt(storedTime, 10);
            return elapsedTime < DEFAULT_TOKEN_LIFETIME - TOKEN_EXPIRY_BUFFER;
        }
    }, []);

    const refreshAccessToken = useCallback(async () => {
        return new Promise<TokenInfo>((resolve, reject) => {
            if (window.google && window.google.accounts && window.google.accounts.oauth2) {
                window.tokenClient.requestAccessToken({
                    prompt: 'consent',
                    callback: (response: any) => {
                        if (response.error !== undefined) {
                            console.error("Error refreshing access token:", response.error);
                            reject(response.error);
                        } else {
                            console.log("Access token refreshed");
                            const newTokenInfo: TokenInfo = {
                                accessToken: response.access_token,
                                expiryTime: response.expires_in ? Math.floor(Date.now() / 1000) + response.expires_in : undefined
                            };
                            setTokenInfo(newTokenInfo);
                            sessionStorage.setItem('googleDriveAccessToken', newTokenInfo.accessToken);
                            if (newTokenInfo.expiryTime) {
                                sessionStorage.setItem('googleDriveTokenExpiry', newTokenInfo.expiryTime.toString());
                            }
                            sessionStorage.setItem('googleDriveTokenStoredTime', Math.floor(Date.now() / 1000).toString());
                            resolve(newTokenInfo);
                        }
                    },
                });
            } else {
                reject(new Error("Google Identity Services not loaded"));
            }
        });
    }, []);

    const initializeTokenClient = useCallback(() => {
        if (window.google && window.google.accounts && window.google.accounts.oauth2) {
            window.tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: process.env.NEXT_PUBLIC_REP_RHINO_GOOGLE_CLIENT_ID!,
                scope: 'https://www.googleapis.com/auth/drive.file',
                callback: (response: any) => {
                    if (response.error !== undefined) {
                        console.error("Error getting access token:", response.error);
                    } else {
                        console.log("Access token received");
                        const newTokenInfo: TokenInfo = {
                            accessToken: response.access_token,
                            expiryTime: response.expires_in ? Math.floor(Date.now() / 1000) + response.expires_in : undefined
                        };
                        setTokenInfo(newTokenInfo);
                        sessionStorage.setItem('googleDriveAccessToken', newTokenInfo.accessToken);
                        if (newTokenInfo.expiryTime) {
                            sessionStorage.setItem('googleDriveTokenExpiry', newTokenInfo.expiryTime.toString());
                        }
                        sessionStorage.setItem('googleDriveTokenStoredTime', Math.floor(Date.now() / 1000).toString());
                    }
                },
            });
        } else {
            console.error("Google Identity Services not loaded");
        }
    }, []);

    useEffect(() => {
        // Check if APIs are already loaded
        if (window.isGapiLoaded && window.isGisLoaded) {
            setIsGoogleApisReady(true);
            setPickerInited(true);
            setGisInited(true);
            if (window.google && window.google.accounts && window.google.accounts.oauth2) {
                initializeTokenClient();
            }
        }
    }, [initializeTokenClient]);

    const handleGapiLoaded = useCallback(() => {
        console.log("Google API loaded");
        window.isGapiLoaded = true;
        window.gapi.load('picker', () => {
            console.log("Picker API loaded");
            setPickerInited(true);
            checkGoogleApisReady();
        });
    }, [checkGoogleApisReady]);

    const handleGisLoaded = useCallback(() => {
        console.log("Google Identity Services loaded");
        window.isGisLoaded = true;
        setGisInited(true);
        initializeTokenClient();
        checkGoogleApisReady();
    }, [checkGoogleApisReady, initializeTokenClient]);

    const createPickerWithRetry = useCallback(async (retryCount = 0) => {
        if (retryCount > 2) {
            console.error("Max retry attempts reached");
            addNotification("Failed to create picker after multiple attempts", "error");
            return;
        }

        try {
            let currentTokenInfo = tokenInfo;
            if (!isTokenValid(currentTokenInfo)) {
                currentTokenInfo = await refreshAccessToken();
            }

            const view = new window.google.picker.DocsView()
                .setParent(process.env.NEXT_PUBLIC_GOOGLE_DRIVE_ACTIVE_CLIENTS_FOLDER_ID!)
                .setIncludeFolders(true)
                .setSelectFolderEnabled(true)
                .setMode(window.google.picker.DocsViewMode.LIST)
                // .setEnableDrives(true);

            const picker = new window.google.picker.PickerBuilder()
                .addView(view)
                .setOAuthToken(currentTokenInfo?.accessToken)
                .setDeveloperKey(process.env.NEXT_PUBLIC_REP_RHINO_GOOGLE_API_KEY!)
                .setCallback(pickerCallback)
                .setTitle('Select an article')
                .build();

            picker.setVisible(true);
        } catch (error) {
            console.error("Error creating picker:", error);
            if (error instanceof Error && (error.message.includes('invalid_grant') || error.message.includes('403'))) {
                await refreshAccessToken();
                createPickerWithRetry(retryCount + 1);
            } else {
                addNotification("Error creating file picker", "error");
            }
        }
    }, [tokenInfo, isTokenValid, refreshAccessToken, addNotification]);

    const handleSelectFile = useCallback(async () => {
        if (!isGoogleApisReady) {
            console.error("Google APIs not fully initialized");
            return;
        }

        try {
            await createPickerWithRetry();
        } catch (error) {
            console.error("Failed to create picker:", error);
            addNotification("Failed to open file picker", "error");
        }
    }, [isGoogleApisReady, createPickerWithRetry, addNotification]);

    function pickerCallback(data: any) {
        if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
            const doc = data[window.google.picker.Response.DOCUMENTS][0];
            setSelectedFile({ id: doc[window.google.picker.Document.ID], name: doc[window.google.picker.Document.NAME] });
            console.log("Selected file:", doc);
        }
    }

    const createFolderPicker = useCallback(() => {
        console.log("Creating folder picker with access token:", tokenInfo?.accessToken);
        if (!tokenInfo?.accessToken) {
            console.error('No access token available');
            return;
        }

        try {
            const view = new window.google.picker.DocsView()
                .setParent(process.env.NEXT_PUBLIC_GOOGLE_DRIVE_ACTIVE_CLIENTS_FOLDER_ID!)
                .setIncludeFolders(true)
                .setSelectFolderEnabled(true)
                .setMode(window.google.picker.DocsViewMode.LIST)
                .setEnableDrives(true);

            const picker = new window.google.picker.PickerBuilder()
                .addView(view)
                .setOAuthToken(tokenInfo.accessToken)
                .setDeveloperKey(process.env.NEXT_PUBLIC_REP_RHINO_GOOGLE_API_KEY!)
                .setCallback(folderPickerCallback)
                .setTitle('Select a destination folder')
                .build();

            picker.setVisible(true);
        } catch (error) {
            console.error("Error creating folder picker:", error);
        }
    }, [tokenInfo]);

    function folderPickerCallback(data: any) {
        if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
            const folder = data[window.google.picker.Response.DOCUMENTS][0];
            setSelectedFolder({ id: folder[window.google.picker.Document.ID], name: folder[window.google.picker.Document.NAME] });
            console.log("Selected folder:", folder);
        }
    }

    const handleSelectFolder = useCallback(async () => {
        if (!isGoogleApisReady) {
            console.error("Google APIs not fully initialized");
            return;
        }

        if (!isTokenValid(tokenInfo)) {
            console.log("Token invalid or expired, refreshing...");
            try {
                await refreshAccessToken();
            } catch (error) {
                console.error("Failed to refresh access token:", error);
                addNotification("Failed to refresh access token", "error");
                return;
            }
        }
        
        createFolderPicker();   
    }, [isGoogleApisReady, tokenInfo, isTokenValid, refreshAccessToken, createFolderPicker, addNotification]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            console.log("Submitting form with data:", {
                DocType: docType,
                SelectedCategory: selectedCategory,
                SelectedArticleUrl: selectedArticleUrl,
                SelectedFile: selectedFile,
                SelectedFolder: selectedFolder,
                SelectedQa: selectedQa,
                IsBusinessName: isBusinessName
            });

            const stageId = await createNewStage(ref.current!);
            await updateStatusProject(stageId, 'Generating');
            setAddStageModalOpen(false);

            const apiEndpoint = docType === "Video" ? '/api/generate-video' : '/api/generate-doc';

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 500000);
    

            const generateResponse = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    stageId, 
                    clientId: projectId,
                    category: selectedCategory,
                    articleUrl: selectedArticleUrl,
                    fileId: selectedFile?.id,
                    folderId: selectedFolder?.id,
                    qaId: selectedQa === "default" ? null : selectedQa,
                    isBusinessName: isBusinessName
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            console.log("API Response Status:", generateResponse.status);

            if (generateResponse.ok) {
                const responseData = await generateResponse.json();
                console.log("API Response Data:", responseData);
                setUrl(responseData.docUrl);

                if (responseData.success) {
                    if (docType === 'Article'){
                    await updateStatusProject(stageId, 'Ready');
                    addNotification(`${docType} created and generated successfully`, "success");}
                    else{
                        addNotification(`Started ${docType} generation`, "success");
                    }
                } else {
                    await updateStatusProject(stageId, 'Failed');
                    addNotification(`${docType} failed to generate: ${responseData.error}`, "error");
                }
            } else {
                // console.error("API request failed");
                // await updateStatusProject(stageId, 'Failed');
                // addNotification(`${docType} failed to generate`, "error");
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            if (ref.current) {
                const stageId = ref.current.id;
                await updateStatusProject(stageId, 'Failed');
            }
            addNotification("Error creating document/video", "error");
        } finally {
            setIsSubmitting(false);
            ref.current?.reset();
        }
    }
    
    async function createNewStage(formElement: HTMLFormElement): Promise<string> {
        const formData = new FormData(formElement);
        const docUrl = docType === "Video" 
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/videos/${encodeURIComponent(formData.get("name") as string)}`
        : undefined;
        const data: addStage = {
            name: formData.get("name") as string,
            docType: formData.get("docType") as string,
            clientDataId: projectId,
            docUrl,
            article: formData.get("articleId") as string,
            projectId,
            category: selectedCategory
        };
    
        try {
            const response = await createStage(data, selectedUsers);
            if (response && response.stageId) {
                return response.stageId;
            } else {
                throw new Error("Failed to create stage: Invalid response");
            }
        } catch (error) {
            throw new Error("Failed to create stage");
        }
    }

    function handleCancel() {
        if (!isSubmitting) {
            ref.current?.reset();
            setAddStageModalOpen(false);
        }
    }

    return (
        <>
            {!window.isGapiLoaded && (
                <Script
                    src="https://apis.google.com/js/api.js"
                    onLoad={handleGapiLoaded}
                />
            )}
            {!window.isGisLoaded && (
                <Script
                    src="https://accounts.google.com/gsi/client"
                    onLoad={handleGisLoaded}
                />
            )}
            <div className="px-5 py-4">
                <form ref={ref} onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Project Name
                            </label>
                            <input type="text" name="name" required className="form-input w-full px-2 py-1 bg-gray-300 dark:bg-gray-800" style={{ marginTop: '0.36rem' }} />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Project Type
                            </label>
                            <select name="docType" required defaultValue={"Article"} value={docType}
                                onChange={(e) => setDocType(e.target.value)}
                                    className="form-input mt-1 block w-full px-2 py-1 bg-gray-300 dark:bg-gray-800 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white">
                                <option value="Article">Article</option>
                                <option value="Video">Video</option>
                            </select>
                        </div>
                        {docType === "Article" && (
                            <>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Select Q&A Document
                                </label>
                                <select
                                    name="articleId"
                                    required
                                    value={selectedQa}
                                    className="form-input mt-1 block w-full px-2 py-1 bg-gray-300 dark:bg-gray-800 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
                                    onChange={(e) => setSelectedQa(e.target.value)}
                                >
                                    <option value="default">
                                        {`Complete Q&A History - ${thisProject.clientName}`}
                                    </option>
                                    {qaList.map((qa) => (
                                        <option key={qa.id} value={qa.id}>
                                            {qa.fileName || `Q&A Document ${qa.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Select Category
                                </label>
                                <select
                                    name="category"
                                    required
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="form-input mt-1 block w-full px-2 py-1 bg-gray-300 dark:bg-gray-800 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
                                >
                                    <option value="Feature Stories">Feature Stories</option>
                                    <option value="Interview Articles">Interview Articles</option>
                                    <option value="Press Releases">Press Releases</option>
                                </select>
                            </div>
                            <div className="mb-2 col-span-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isBusinessName"
                                        checked={isBusinessName}
                                        onChange={(e) => setIsBusinessName(e.target.checked)}
                                        className="form-checkbox"
                                    />
                                    <label htmlFor="isBusinessName" className="ml-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        This is a business name (will keep full name throughout the article)
                                    </label>
                                </div>
                            </div>
                            </>
                        )}
                    </div>
                    
                    {docType === "Video" && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Select an Article
                            </label>
                            <button
                                type="button"
                                onClick={handleSelectFile}
                                disabled={!isGoogleApisReady}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {selectedFile ? 'Change File' : 'Select File from Google Drive'}
                            </button>
                            {!isGoogleApisReady && (
                                <p className="mt-2 text-sm text-red-600">Google APIs are initializing. Please wait...</p>
                            )}
                            {selectedFile && (
                                <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center">
                                    <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                        {selectedFile.name}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    {docType === "Article" && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Select Folder for Articles
                                </label>
                                <button
                                    type="button"
                                    onClick={handleSelectFolder}
                                    disabled={!isGoogleApisReady}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {selectedFolder ? 'Change Folder' : 'Select Folder in Google Drive'}
                                </button>
                                {!isGoogleApisReady && (
                                    <p className="mt-2 text-sm text-red-600">Google APIs are initializing. Please wait...</p>
                                )}
                                {selectedFolder && (
                                    <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center">
                                        <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                        <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                            {selectedFolder.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex flex-wrap justify-end space-x-2">
                            {!isSubmitting && (
                                <button
                                    className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                                    onClick={handleCancel} type="button">
                                    Cancel
                                </button>
                            )}
                            <button type="submit" className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Generate project"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

