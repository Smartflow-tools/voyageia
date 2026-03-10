import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import App from "./App";

export default function AppRouter() {
return (
<Routes>
<Route path="/" element={<LandingPage />} />
<Route path="/app" element={<App />} />
</Routes>
);
}
