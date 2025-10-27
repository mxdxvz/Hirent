import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import OwnerInformation from "./pages/owners/Owner_Information";
import OwnerSubmission from "./pages/owners/Owner_Submission";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Regular routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/owner-information" element={<OwnerInformation />} />
        <Route path="/owner-submission" element={<OwnerSubmission />} />
      </Routes>
    </Router>
  );
}

export default App;