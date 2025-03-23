const redirectUri = encodeURIComponent(
  `${window.location.origin}/linkedin/callback`
);
const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${
  import.meta.env.VITE_LINKEDIN_CLIENT_ID
}&redirect_uri=${redirectUri}&scope=openid%20profile%20email`;

export default function HomePage() {
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
