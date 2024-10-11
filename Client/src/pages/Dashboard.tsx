import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/root";
import { logout } from "../redux/slices";
import UploadModal from "../components/UploadModal";
import Button from "../components/Button";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleFileUpload = (file: File) => {
    // TODO: Implement file upload logic
    console.log("File to upload:", file);
  };

  return (
    <div>
      <h2>Upload File To Get Started</h2>
      <Button onClick={openModal}>Upload CSV</Button>
      <UploadModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default Dashboard;
