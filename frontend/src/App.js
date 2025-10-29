import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import OwnerInformation from "./pages/owners/Owner_Information";
import OwnerSubmission from "./pages/owners/Owner_Submission";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/owner-information" element={<OwnerInformation />} />
        <Route path="/owner-submission" element={<OwnerSubmission />} />
      </Routes>
    </Router>
  );
}

export default App;
