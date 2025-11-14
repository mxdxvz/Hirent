import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage/session
    localStorage.removeItem("token"); // or whatever key you use
    localStorage.removeItem("user");  // optional user info

    // Redirect to login page
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-1 bg-[#A936E3] text-white text-[13px] font-medium rounded hover:bg-[#8f1cc8] transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
