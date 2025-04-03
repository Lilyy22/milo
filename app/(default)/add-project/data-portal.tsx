"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { fetchClientQAs } from '@/app/actions';
import ModalBlank from "@/components/modal-blank";
import DeleteWarning from "./deleteWarning/delete-warning";
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

const SearchParamsWrapper = dynamic(() => import('./SearchParamsWrapper'), { ssr: false });
type FormData = {
  clientName: string;
  gender: string;
  bio: string;
  qa: string;
};

type FormErrors = Partial<FormData> & {
  bioFile?: string;
  qaFile?: string;
};

export default function DataPortal() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchParamsWrapper>
        {(id: string | null) => <DataPortalContent id={id || undefined} />}
      </SearchParamsWrapper>
    </Suspense>
  );
}


function DataPortalContent({ id: propId }: { id: string | undefined }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') || propId;
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"warning" | "error" | "success" | "">("");
  const { data: session, status } = useSession();
  const [dangerModalOpen, setDangerModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    gender: "male", // Remove the default value
    bio: "",
    qa: ""
  });
  const [selectedBioFile, setSelectedBioFile] = useState<{ id: string, name: string } | null>(null);
  const [selectedQaFile, setSelectedQaFile] = useState<{ id: string, name: string } | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state

  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [folders, setFolders] = useState<Array<{ id: string, name: string, type: string, icon: string }>>([]);
  const [folderPath, setFolderPath] = useState<Array<{ id: string, name: string }>>([]);

  const [pickerInited, setPickerInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [isGoogleApisReady, setIsGoogleApisReady] = useState(false);

  const TOKEN_EXPIRY_BUFFER = 300; // 5 minutes in seconds
  const DEFAULT_TOKEN_LIFETIME = 3600; // 1 hour in seconds

  interface TokenInfo {
    accessToken: string;
    expiryTime?: number;
  }

  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

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

  const refreshAccessToken = useCallback(async (forceReauth = false) => {
    return new Promise<TokenInfo>((resolve, reject) => {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        window.tokenClient.requestAccessToken({
          prompt: forceReauth ? 'consent' : '',
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

  const createPickerWithRetry = useCallback(async (fileType: 'bio' | 'qa', retryCount = 0) => {
    if (retryCount > 2) {
      console.error("Max retry attempts reached");
      setToastMessage("Failed to create picker after multiple attempts");
      setToastType("error");
      setToastOpen(true);
      return;
    }

    try {
      let currentTokenInfo = tokenInfo;
      if (!isTokenValid(currentTokenInfo)) {
        currentTokenInfo = await refreshAccessToken();
      }

      // const view = new window.google.picker.DocsView()
      //   .setParent(process.env.NEXT_PUBLIC_GOOGLE_DRIVE_ACTIVE_CLIENTS_FOLDER_ID!)
      //   .setIncludeFolders(true)
      //   .setSelectFolderEnabled(true)
      //   .setMode(window.google.picker.DocsViewMode.LIST)
      //   .setEnableDrives(true);

      const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
        .setParent(process.env.NEXT_PUBLIC_GOOGLE_DRIVE_ACTIVE_CLIENTS_FOLDER_ID!)
        .setIncludeFolders(true)
        .setSelectFolderEnabled(true)
        .setMode(window.google.picker.DocsViewMode.LIST);


      const picker = new window.google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(currentTokenInfo?.accessToken)
        .setDeveloperKey(process.env.NEXT_PUBLIC_REP_RHINO_GOOGLE_API_KEY!)
        .setCallback((data: any) => pickerCallback(data, fileType))
        .setTitle(`Select a ${fileType.toUpperCase()} file`)
        .build();

      picker.setVisible(true);
    } catch (error) {
      console.error("Error creating picker:", error);
      if (error instanceof Error &&
        (error.message.includes('invalid_grant') ||
          error.message.includes('403') ||
          error.message.includes('Invalid Credentials') ||
          error.message.includes('AccountChooser') ||
          error.message.includes('popup_closed_by_user'))) {
        console.log("Authentication issue detected. Attempting to re-authenticate...");
        try {
          await refreshAccessToken(true); // Force re-authentication
          await createPickerWithRetry(fileType, retryCount + 1);
        } catch (refreshError) {
          console.error("Failed to re-authenticate:", refreshError);
          setToastMessage("Failed to authenticate. Please try again later.");
          setToastType("error");
          setToastOpen(true);
        }
      } else {
        setToastMessage("Error creating file picker");
        setToastType("error");
        setToastOpen(true);
      }
    }
  }, [tokenInfo, isTokenValid, refreshAccessToken]);

  const handleSelectFile = useCallback(async (fileType: 'bio' | 'qa') => {
    if (!isGoogleApisReady) {
      console.error("Google APIs not fully initialized");
      return;
    }

    try {
      await createPickerWithRetry(fileType);
    } catch (error) {
      console.error("Failed to create picker:", error);
      setToastMessage("Failed to open file picker");
      setToastType("error");
      setToastOpen(true);
    }
  }, [isGoogleApisReady, createPickerWithRetry]);

  const checkGoogleApisReady = useCallback(() => {
    if (window.isGapiLoaded && window.isGisLoaded) {
      setIsGoogleApisReady(true);
    }
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
    const storedToken = sessionStorage.getItem('googleDriveAccessToken');
    const storedExpiry = sessionStorage.getItem('googleDriveTokenExpiry');
    const storedTime = sessionStorage.getItem('googleDriveTokenStoredTime');
    if (storedToken) {
      setTokenInfo({
        accessToken: storedToken,
        expiryTime: storedExpiry ? parseInt(storedExpiry, 10) : undefined
      });
    }

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

  function pickerCallback(data: any, fileType: 'bio' | 'qa') {
    if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
      const doc = data[window.google.picker.Response.DOCUMENTS][0];
      const file = { id: doc[window.google.picker.Document.ID], name: doc[window.google.picker.Document.NAME] };
      if (fileType === 'bio') {
        setSelectedBioFile(file);
      } else {
        setSelectedQaFile(file);
      }
      console.log(`Selected ${fileType} file:`, doc);
    }
  }

  useEffect(() => {
    if (!id) {
      // Load form data from localStorage only if there's no ID
      const storedData = localStorage.getItem('formData');
      if (storedData) {
        setFormData(JSON.parse(storedData));
      }
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      // Save form data to localStorage only if there's no ID
      localStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [formData, id]);

  useEffect(() => {
    if (id) {
      // Fetch the project data if id is present
      const fetchProjectData = async (id: string) => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/clientdata?id=${id}`);
          const data = await response.json();
          setFormData(data);
          console.log(data)
          // Set the selected file information
          if (data.bioFileId && data.bioName) {
            setSelectedBioFile({ id: data.bioFileId, name: data.bioName });
          }
          if (data.qaFileId && data.qaName) {
            setSelectedQaFile({ id: data.qaFileId, name: data.qaName });
          }
        } catch (error) {
          console.error("Failed to fetch project data", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProjectData(id);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // console.log(`Field ${name} changed to:`, value);
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Clear the error for this field when it's changed
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: undefined
    }));
  };

  const handleFileClick = async (fileId: string, fileName: string) => {
    try {
      console.log('File clicked:', fileId, fileName);
      const response = await fetch(`/api/fetch-google-doc?fileId=${fileId}`);
      if (!response.ok) throw new Error('Failed to fetch file');
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: blob.type });

      if (fileName.toLowerCase().includes('bio')) {
        setSelectedBioFile({ id: fileId, name: fileName });
      } else if (fileName.toLowerCase().includes('qa') || fileName.toLowerCase().includes('q&a')) {
        setSelectedQaFile({ id: fileId, name: fileName });
      } else {
        console.log('File type not recognized');
      }
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Current formData:', formData); // Log entire formData for debugging
    const newErrors: FormErrors = {};

    // Check only for the fields that are in your form
    if (!formData.clientName.trim()) {
      newErrors.clientName = "This field is required";
    }

    if (!formData.gender) {
      newErrors.gender = "This field is required";
    }

    if (!selectedBioFile) {
      newErrors.bioFile = "Bio file is required";
    }
    if (!selectedQaFile) {
      newErrors.qaFile = "Q&A file is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log('Form has errors', newErrors);
    } else {
      console.log('Form is valid, proceeding with submission');
      setErrors({});
      setIsSubmitting(true);

      try {
        const projectData = new FormData();
        projectData.append('clientName', formData.clientName);
        projectData.append('gender', formData.gender);
        projectData.append('id', id || '');
        if (selectedBioFile) {
          projectData.append('bioFileId', selectedBioFile.id);
          projectData.append('bioFileName', selectedBioFile.name);
        }
        if (selectedQaFile) {
          projectData.append('qaFileId', selectedQaFile.id);
          projectData.append('qaFileName', selectedQaFile.name);
        }

        const response = await fetch(`/api/clientdata${id ? `?id=${id}` : ''}`, {
          method: id ? "PATCH" : "POST",
          body: projectData,
        });

        if (response.ok) {
          setToastMessage(`Project ${id ? 'updated' : 'saved'} successfully!`);
          setToastType("success");
          setToastOpen(true);
          setFormData({
            clientName: "",
            gender: "",
            bio: "",
            qa: ""
          });
          setSelectedBioFile(null);
          setSelectedQaFile(null);
          console.log('Project saved successfully');

          router.push('/projects');
          router.refresh()
        } else {
          setToastMessage(`Failed to ${id ? 'update' : 'save'} the project.`);
          setToastType("error");
          setToastOpen(true);
          console.log('Failed to save project', response.statusText);
        }
      } catch (error) {
        setToastMessage(`Failed to ${id ? 'update' : 'save'} the project.`);
        setToastType("error");
        setToastOpen(true);
        console.error('Error occurred while saving project', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const [qas, setQas] = useState<any[]>([]);

  useEffect(() => {
    const loadQAs = async () => {
      if (id) {
        try {
          const fetchedQAs = await fetchClientQAs(id);
          setQas(fetchedQAs);
        } catch (error) {
          console.error("Failed to fetch QAs:", error);
        }
      }
    };

    loadQAs();
  }, [id]);

  const [qaToDelete, setQaToDelete] = useState<{ id: string, fileName: string } | null>(null);

  const handleDeleteQA = async () => {
    if (!qaToDelete) return;

    try {
      const response = await fetch(`/api/qa?id=${qaToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQas(qas.filter(qa => qa.id !== qaToDelete.id));
        setToastMessage('Q&A deleted successfully');
        setToastType('success');
      } else {
        setToastMessage('Failed to delete Q&A');
        setToastType('error');
      }
    } catch (error) {
      setToastMessage('Error deleting Q&A');
      setToastType('error');
    } finally {
      setToastOpen(true);
      setDangerModalOpen(false);
      setQaToDelete(null);
    }
  };

  const refreshQAs = useCallback(async () => {
    if (id) {
      try {
        const fetchedQAs = await fetchClientQAs(id);
        setQas(fetchedQAs);
      } catch (error) {
        console.error("Failed to fetch QAs:", error);
      }
    }
  }, [id]);

  if (status === "loading" || isLoading) {
    return <p>Loading...</p>;
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
      <form onSubmit={handleSubmit} className="grow" encType="multipart/form-data">
        <div className="p-6 space-y-6 flex flex-col">
          <div className='border-b border-slate-200 dark:border-slate-700'>
            <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
              Client Registration ✨
            </h2>
          </div>

          <section className="flex flex-col space-y-6">
            <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
              Establishing Professional Identity and Values
            </h2>
            <div className="text-sm">
              Please tell us more about yourself so we can create an article based on the provided information
            </div>
            <div>
              <label htmlFor="clientName" className="block text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-2">Full Name</label>
              <input
                type="text"
                name="clientName"
                id="clientName"
                className="form-input w-full focus:border-slate-300"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Please enter client full name"
              />
              {errors.clientName && <p className="text-red-500">{errors.clientName}</p>}
            </div>

            <div>
              <label htmlFor="gender" className="block text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-2">Gender</label>
              <select
                name="gender"
                id="gender"
                className="form-input w-full focus:border-slate-300"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <p className="text-red-500">{errors.gender}</p>}
            </div>
          </section>

          <section className="flex flex-col space-y-6">
            <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
              Select Client Files
            </h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Bio File
              </label>
              <button
                type="button"
                onClick={() => handleSelectFile('bio')}
                disabled={!isGoogleApisReady}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ width: '150px' }}
              >
                {selectedBioFile ? 'Change Bio File' : 'Select Bio File'}
              </button>
              {selectedBioFile && (
                <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center">
                  <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {selectedBioFile.name}
                  </span>
                </div>
              )}
              {errors.bioFile && <p className="text-red-500">{errors.bioFile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Q&A File
              </label>
              <button
                type="button"
                onClick={() => handleSelectFile('qa')}
                disabled={!isGoogleApisReady}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ width: '150px' }}
              >
                {selectedQaFile ? 'Change Q&A File' : 'Select Q&A File'}
              </button>
              {selectedQaFile && (
                <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center">
                  <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {selectedQaFile.name}
                  </span>
                </div>
              )}
              {errors.qaFile && <p className="text-red-500">{errors.qaFile}</p>}
            </div>
          </section>
        </div>
        {id && (
          <section className="flex flex-col space-y-6 px-6 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                Q&A History
              </h2>
            </div>
            {qas.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">No Q&As found</p>
            ) : (
              <div className="space-y-4">
                {qas.map((qa) => (
                  <div key={qa.id} className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {qa.fileName}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setQaToDelete({ id: qa.id, fileName: qa.fileName });
                        setDangerModalOpen(true);
                      }}
                      className="flex items-center px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        <footer>
          <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
            <div className="flex self-end">
              <button
                type="submit"
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Client"}
              </button>
            </div>
          </div>
        </footer>
      </form>
      {/* Delete Warning Modal */}
      <ModalBlank isOpen={dangerModalOpen} setIsOpen={setDangerModalOpen}>
        <DeleteWarning
          setDangerModalOpen={setDangerModalOpen}
          entityId={qaToDelete?.id || ''}
          onSuccess={refreshQAs}
        />
      </ModalBlank>
    </>
  );
}