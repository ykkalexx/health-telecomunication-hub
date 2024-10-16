import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/root";
import UploadModal from "../components/UploadModal";
import Button from "../components/Button";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { selectUserId } from "../redux/selectors";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const userId = useSelector(selectUserId);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFileUpload = async (file: File) => {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION as string,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });

    const params = {
      Bucket: process.env.AWS_BUCKET as string,
      Key: `${userId}/${file.name}`,
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
    <div>
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
    </div>
  );
};

export default Dashboard;
