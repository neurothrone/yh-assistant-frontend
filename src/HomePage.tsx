import { useState, useEffect } from "react";
import { getLinkedInClientId } from "./utils/env";
import { ErrorMessage } from "./components/ErrorMessage";

export default function HomePage() {
  const [linkedInClientId, setLinkedInClientId] = useState<
    string | undefined
  >();
  const [isConfigValid, setIsConfigValid] = useState(false);

  useEffect(() => {
    const clientId = getLinkedInClientId();
    setLinkedInClientId(clientId);
    setIsConfigValid(!!clientId);
  }, []);

  if (!isConfigValid) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <ErrorMessage
          title="Configuration Error"
          message="LinkedIn Client ID is not configured. Please set the VITE_LINKEDIN_CLIENT_ID environment variable."
        />
      </div>
    );
  }

  const redirectUri = encodeURIComponent(
    `${window.location.origin}/linkedin/callback`
  );

  const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedInClientId}&redirect_uri=${redirectUri}&scope=openid%20profile%20email`;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Connect to LinkedIn</h1>
      <a
        href={linkedInAuthUrl}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Connect with LinkedIn
      </a>
    </div>
  );
}
