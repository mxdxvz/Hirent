import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage/session
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-1 text-white text-[13px] border border-white rounded hover:bg-[#8f1cc8] transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
