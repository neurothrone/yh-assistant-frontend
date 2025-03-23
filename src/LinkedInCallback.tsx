import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import axios from "axios";
import { getBackendUrl } from "./utils/env";
import { ErrorMessage } from "./components/ErrorMessage";

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
}

export default function LinkedInCallback() {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<boolean>(false);
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
    const backendUrl = getBackendUrl();

    setDebugInfo({
      code: code ? `${code.substring(0, 10)}...` : null,
      error: errorParam,
      errorDescription,
      backendUrl: backendUrl || "Not set",
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

    if (!backendUrl) {
      setConfigError(true);
      setLoading(false);
      return;
    }

    axios
      .post(`${backendUrl}/api/linkedin/exchange`, { code })
      .then((res) => {
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

  if (configError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-darker">
        <ErrorMessage
          title="Configuration Error"
          message="Backend URL is not configured. Please set the VITE_BACKEND_URL environment variable."
        />
        <a
          href="/"
          className="bg-[#0077B5] hover:bg-[#0066a1] text-white px-4 py-2 rounded-md"
        >
          Back to Home
        </a>
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-darker">
        <div className="w-16 h-16 border-t-4 border-[#0077B5] border-solid rounded-full animate-spin mb-6"></div>
        <p className="text-xl text-light">Loading profile information...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-darker">
        <div className="bg-dark p-6 rounded-lg shadow-lg max-w-lg w-full">
          <h2 className="text-xl font-semibold mb-4 text-red-400">
            Error: {error}
          </h2>

          <div className="debug-area p-4 rounded-md max-w-full overflow-auto mb-6">
            <p className="font-semibold mb-2">Debug Information:</p>
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          <div className="text-center">
            <a
              href="/"
              className="bg-[#0077B5] hover:bg-[#0066a1] text-white px-4 py-2 rounded-md inline-block"
            >
              Try Again
            </a>
          </div>
        </div>
      </div>
    );

  if (!userData) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-darker">
      <div className="bg-dark p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl mb-6 text-light font-bold text-center">
          Welcome, {userData.name}
        </h1>

        <div className="flex flex-col items-center mb-6">
          {userData.profilePictureUrl ? (
            <div className="mb-4">
              <img
                src={userData.profilePictureUrl}
                alt="Profile"
                className="rounded-full w-24 h-24 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  (
                    e.currentTarget.nextElementSibling as HTMLElement
                  ).style.display = "flex";
                }}
              />
              <div
                className="profile-avatar w-24 h-24 rounded-full items-center justify-center"
                style={{ display: "none" }}
              >
                <span className="text-3xl">{userData.name.charAt(0)}</span>
              </div>
            </div>
          ) : (
            <div className="profile-avatar w-24 h-24 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">{userData.name.charAt(0)}</span>
            </div>
          )}

          {userData.email && (
            <p className="text-gray-light">{userData.email}</p>
          )}
        </div>

        <div className="text-center">
          <a
            href="/"
            className="bg-[#0077B5] hover:bg-[#0066a1] text-white px-6 py-2 rounded-md inline-block"
          >
            Go Back
          </a>
        </div>
      </div>
    </div>
  );
}
