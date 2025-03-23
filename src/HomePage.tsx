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
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-darker">
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
    <div className="flex flex-col items-center justify-center h-screen bg-darker">
      <div className="bg-dark p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl mb-6 text-light font-bold">
          Connect to LinkedIn
        </h1>
        <p className="text-gray-light mb-6">
          Connect your LinkedIn profile to access YH Assistant.
        </p>
        <a
          href={linkedInAuthUrl}
          className="bg-[#0077B5] hover:bg-[#0066a1] text-white px-6 py-3 rounded-md inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
          Connect with LinkedIn
        </a>
      </div>
    </div>
  );
}
