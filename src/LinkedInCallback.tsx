import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import axios from "axios";

interface UserData {
  name: string;
  profilePictureUrl: string | null;
}

export default function LinkedInCallback() {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("No authorization code found in URL");
      setLoading(false);
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/linkedin/exchange`, {
        code,
      })
      .then((res) => {
        setUserData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("OAuth Error:", err);
        const errorMessage =
          err.response?.data || "Failed to exchange LinkedIn code";
        setError(
          typeof errorMessage === "string"
            ? errorMessage
            : JSON.stringify(errorMessage)
        );
        setLoading(false);
      });
  }, [searchParams]);

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
        <a href="/" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          Try Again
        </a>
      </div>
    );

  if (!userData) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-2">Welcome, {userData.name}</h1>
      {userData.profilePictureUrl ? (
        <img
          src={userData.profilePictureUrl}
          alt="Profile"
          className="rounded-full w-24 h-24 mb-4"
        />
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
