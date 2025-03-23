import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import axios from "axios";

interface UserData {
  name: string;
  email?: string;
  profilePictureUrl: string | null;
}

interface DebugInfo {
  code: string | null;
  error: string | null;
  errorDescription: string | null;
  backendUrl: string;
  currentUrl: string;
  responseError?: string;
  responseStatus?: number;
  responseData?: unknown;
  imageValidation?: string;
  [key: string]: unknown;
}

export default function LinkedInCallback() {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    code: null,
    error: null,
    errorDescription: null,
    backendUrl: "",
    currentUrl: "",
  });

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    setDebugInfo({
      code: code ? `${code.substring(0, 10)}...` : null,
      error: errorParam,
      errorDescription,
      backendUrl: import.meta.env.VITE_BACKEND_URL || "Not set",
      currentUrl: window.location.href,
    });

    if (errorParam) {
      setError(`LinkedIn Error: ${errorParam} - ${errorDescription}`);
      setLoading(false);
      return;
    }

    if (!code) {
      setError("No authorization code found in URL");
      setLoading(false);
      return;
    }

    const backendUrl =
      import.meta.env.VITE_BACKEND_URL ||
      "https://yh-assistant-backend.azurewebsites.net";
    console.log("Sending code to backend:", backendUrl);

    axios
      .post(`${backendUrl}/api/linkedin/exchange`, { code })
      .then((res) => {
        console.log("Backend response:", res.data);
        setUserData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("OAuth Error:", err);
        const errorMessage =
          err.response?.data ||
          err.message ||
          "Failed to exchange LinkedIn code";
        setError(
          typeof errorMessage === "string"
            ? errorMessage
            : JSON.stringify(errorMessage)
        );
        setDebugInfo((prev: DebugInfo) => ({
          ...prev,
          responseError: err.message,
          responseStatus: err.response?.status,
          responseData: err.response?.data,
        }));
        setLoading(false);
      });
  }, [searchParams]);

  useEffect(() => {
    if (userData?.profilePictureUrl) {
      console.log("Profile picture URL:", userData.profilePictureUrl);

      // Check if the URL is valid by making a HEAD request
      fetch(userData.profilePictureUrl, { method: "HEAD" })
        .then((response) => {
          console.log(
            "Image validation response:",
            response.status,
            response.ok
          );
          if (!response.ok) {
            setDebugInfo((prev) => ({
              ...prev,
              imageValidation: `Failed with status ${response.status}`,
            }));
          } else {
            setDebugInfo((prev) => ({
              ...prev,
              imageValidation: "Image URL is accessible",
            }));
          }
        })
        .catch((err) => {
          console.error("Image validation error:", err);
          setDebugInfo((prev) => ({
            ...prev,
            imageValidation: `Error: ${err.message}`,
          }));
        });
    }
  }, [userData]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl">Loading profile information...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-red-600">Error: {error}</p>
        <div className="mt-4 p-4 bg-gray-100 rounded max-w-lg overflow-auto">
          <p className="font-bold">Debug Information:</p>
          <pre className="text-xs mt-2">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
        <a href="/" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          Try Again
        </a>
      </div>
    );

  if (!userData) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-2">Welcome, {userData.name}</h1>
      {userData.email && <p className="text-gray-600 mb-4">{userData.email}</p>}

      {userData.profilePictureUrl ? (
        <div className="mb-4">
          <img
            src={userData.profilePictureUrl}
            alt="Profile"
            className="rounded-full w-24 h-24"
            onError={(e) => {
              console.error(
                "Image failed to load:",
                userData.profilePictureUrl
              );
              e.currentTarget.style.display = "none";
              (
                e.currentTarget.nextElementSibling as HTMLElement
              ).style.display = "flex";
            }}
          />
          <div
            className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center hidden"
            style={{ display: "none" }}
          >
            <span className="text-gray-500 text-xl">
              {userData.name.charAt(0)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center break-all">
            {userData.profilePictureUrl}
          </p>
        </div>
      ) : (
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <span className="text-gray-500 text-xl">
            {userData.name.charAt(0)}
          </span>
        </div>
      )}

      <a href="/" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Go Back
      </a>
    </div>
  );
}
