// src/pages/owner/AddItem.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layouts/OwnerSidebar";
import AddNewItemForm from "../../components/forms/AddNewItemForm";

export default function AddItem() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/owner/dashboard");
  };

  const handleSuccess = () => {
    navigate("/owner/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pl-60 ">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <AddNewItemForm onCancel={handleCancel} onSuccess={handleSuccess} />
    </div>
  );
}
