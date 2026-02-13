import { Routes, Route } from "react-router-dom";
import Ask from "./pages/Ask.jsx";
import YesPage from "./pages/YesPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Ask />} />
      <Route path="/yes" element={<YesPage />} />
    </Routes>
  );
}
