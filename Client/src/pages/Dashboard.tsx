import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/root";
import UploadModal from "../components/UploadModal";
import Button from "../components/Button";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { selectUserHealthInfo, selectUserId } from "../redux/selectors";
import Profile from "../components/Profile";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const userId = useSelector(selectUserId);
  const healthInfo = useSelector(selectUserHealthInfo);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFileUpload = async (file: File) => {
    if (!userId) {
      setUploadStatus("User ID is missing. Please log in again.");
      return;
    }

    const s3Client = new S3Client({
      region: import.meta.env.VITE_AWS_REGION as string,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY as string,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string,
      },
    });

    const params = {
      Bucket: import.meta.env.VITE_AWS_BUCKET as string,
      Key: `${userId}_${file.name}`,
      Body: file,
      Metadata: {
        "user-id": userId,
      },
    };

    try {
      await s3Client.send(new PutObjectCommand(params));
      console.log("File uploaded successfully");
      setUploadStatus("File uploaded successfully. Processing data...");
    } catch (err: any) {
      console.error("Error", err);
      setUploadStatus("Error uploading file. Please try again.");
    }
  };

  return (
    <div className="w-full h-full">
      {healthInfo?.length > 0 ? (
        <Profile />
      ) : (
        <div className="px-6 py-2 border-[1px] rounded-xl space-y-4">
          <h2>Upload File To Get Started</h2>
          <Button onClick={openModal}>Upload CSV</Button>
          <UploadModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            onFileUpload={handleFileUpload}
          />
          {uploadStatus && (
            <div className="mt-4">
              <p>{uploadStatus}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
