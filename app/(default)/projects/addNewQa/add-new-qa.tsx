"use client";

import { createStage, updateStatusProject } from "@/app/actions";
import { useState, useEffect, useRef, useCallback } from "react";
import type { addStage } from "@/app/actions";
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


export default function AddQAForm({
    setAddQAModalOpen,
    projectId,
    setUrl,
    stages,
    thisProject
}: {
    setAddQAModalOpen: (addStage: boolean) => void;
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

    const TOKEN_EXPIRY_BUFFER = 300; // 5 minutes in seconds
    const DEFAULT_TOKEN_LIFETIME = 3600; // 1 hour in seconds

    interface TokenInfo {
      accessToken: string;
      expiryTime?: number;
    }

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
                .setEnableDrives(true);

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
                .setTitle('Select a Q&A file')
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
                SelectedFolder: selectedFolder
            });

            setAddQAModalOpen(false);

            const formData = new FormData();
            formData.append('id', projectId);
            if (selectedFolder?.id) formData.append('qaFileId', selectedFolder.id);
            if (selectedFolder?.name) formData.append('qaFileName', selectedFolder.name);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 500000);

            const generateResponse = await fetch('/api/update-clientdata', {
                method: 'PATCH',
                body: formData, // Use FormData
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            console.log("API Response Status:", generateResponse.status);

            if (generateResponse.ok) {
                const responseData = await generateResponse.json();
                console.log("API Response Data:", responseData);

                if (responseData) {
                    addNotification(`Q&A added successfully`, "success");
                } else {
                    addNotification(`Q&A failed to add: ${responseData.error}`, "error");
                }
            } 
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            addNotification("Error adding Q&A", "error");
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
            setAddQAModalOpen(false);
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

  

                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Select Q&A File 
                                </label>
                                <button
                                    type="button"
                                    onClick={handleSelectFolder}
                                    disabled={!isGoogleApisReady}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {selectedFolder ? 'Change File' : 'Select File in Google Drive'}
                                </button>
                                {!isGoogleApisReady && (
                                    <p className="mt-2 text-sm text-red-600">Google APIs are initializing. Please wait...</p>
                                )}
                                {selectedFolder && (
                                    <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center">
                                       <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                       </svg>
                                        <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                            {selectedFolder.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </>

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
                                {isSubmitting ? "Saving..." : "Add Q&A"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

