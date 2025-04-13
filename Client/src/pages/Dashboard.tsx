import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/root";
import UploadModal from "../components/UploadModal";
import Button from "../components/Button";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  selectGoals,
  selectUserHealthInfo,
  selectUserId,
} from "../redux/selectors";
import Profile from "../components/Profile";
import HealthGraphs from "../components/HealthGraphs";
import GoalLists from "../components/GoalLists";
import { fetchGoals, fetchHealthInfo } from "../redux/thunks";
import MedicineList from "../components/MedicineList";
import { encryptData } from "../services/EncryptionService";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { updateHealthInfo } from "../redux/slices";
import { HealthInfo } from "../redux/slices";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const goals = useSelector(selectGoals);

  const userId = useSelector(selectUserId);
  const token = useSelector((state: RootState) => state.auth.token);
  const healthInfo = useSelector(selectUserHealthInfo) || [];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Set up SignalR connection
  useEffect(() => {
    if (userId && token) {
      const newConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:5128/healthHub", {
          accessTokenFactory: () => token || "",
        })
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);

      newConnection
        .start()
        .then(() => {
          console.log("SignalR Connected in Dashboard");

          newConnection.on("ReceiveHealthUpdate", (data: HealthInfo[]) => {
            console.log("Received health update via SignalR:", data);
            dispatch(updateHealthInfo(data));
          });
        })
        .catch((err: Error) => console.error("SignalR Connection Error:", err));

      return () => {
        newConnection.stop();
      };
    }
  }, [userId, token, dispatch]);

  useEffect(() => {
    if (userId) {
      console.log("Dispatching fetchGoals");
      dispatch(fetchGoals(userId))
        .unwrap()
        .then((data) => console.log("Goals fetched successfully:", data))
        .catch((error) => console.error("Error fetching goals:", error));

      // Also fetch health info on page load
      dispatch(fetchHealthInfo(userId))
        .unwrap()
        .then((data) => console.log("Health info fetched successfully:", data))
        .catch((error) => console.error("Error fetching health info:", error));
    }
  }, [dispatch, userId]);

  const handleFileUpload = async (file: File) => {
    if (!userId) {
      setUploadStatus("User ID is missing. Please log in again.");
      return;
    }

    try {
      // Read the file content
      const fileContent = await file.text();

      // Encrypt the content
      const encryptedContent = encryptData(fileContent);

      // Create a new file with encrypted content
      const encryptedFile = new Blob([encryptedContent], { type: "text/csv" });

      const s3Client = new S3Client({
        region: import.meta.env.VITE_AWS_REGION as string,
        credentials: {
          accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID as string,
          secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string,
        },
      });

      const params = {
        Bucket: import.meta.env.VITE_AWS_BUCKET as string,
        Key: `${userId}_${file.name}`,
        Body: encryptedFile,
        Metadata: {
          "user-id": userId,
          encrypted: "true",
        },
      };

      await s3Client.send(new PutObjectCommand(params));
      setUploadStatus("File uploaded successfully. Processing data...");

      // Poll for data changes every second for up to 10 seconds
      let attempts = 0;
      const maxAttempts = 10;

      const checkForData = setInterval(async () => {
        attempts++;
        try {
          // Fetch latest health info
          await dispatch(fetchHealthInfo(userId)).unwrap();
          clearInterval(checkForData);
          setUploadStatus("Data processed successfully!");
        } catch (error) {
          console.log(
            `Waiting for data to be processed... (${attempts}/${maxAttempts})`
          );
          if (attempts >= maxAttempts) {
            clearInterval(checkForData);
            setUploadStatus(
              "Data may still be processing. Try refreshing the page in a moment."
            );
          }
        }
      }, 1000);
    } catch (err: any) {
      console.error("Error", err);
      setUploadStatus("Error uploading file. Please try again.");
    }
  };

  return (
    <div className="w-full h-full">
      {healthInfo?.length > 0 ? (
        <div className="flex flex-col space-y-6">
          <Profile />
          <HealthGraphs />
          <GoalLists />
          <MedicineList />
        </div>
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
          <p className="w-[600px] mt-20 text-center">
            To get Fake Generated Data go to the Github Repo and run the
            data/generate_data.py script or use generated examples from the
            results folder{" "}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
