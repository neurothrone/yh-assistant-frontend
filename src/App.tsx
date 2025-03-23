import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./HomePage.tsx";
import LinkedInCallback from "./LinkedInCallback.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/linkedin/callback" element={<LinkedInCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
