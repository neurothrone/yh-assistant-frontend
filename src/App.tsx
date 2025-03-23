import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./HomePage";
import LinkedInCallback from "./LinkedInCallback";

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
