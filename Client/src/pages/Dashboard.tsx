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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [dataProcessed, setDataProcessed] = useState(false);

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

            // If we're loading, mark data as processed when we receive an update
            if (isLoading && data.length > 0) {
              setDataProcessed(true);
              setIsLoading(false);
              setLoadingProgress(100);
              setUploadStatus("Data processed successfully!");
            }
          });
        })
        .catch((err: Error) => console.error("SignalR Connection Error:", err));

      return () => {
        newConnection.stop();
      };
    }
  }, [userId, token, dispatch, isLoading]);

  // Effect to handle automatic refresh when data is processed
  useEffect(() => {
    if (
      dataProcessed &&
      Array.isArray(healthInfo) &&
      healthInfo.length === 0 &&
      userId
    ) {
      // Refresh data since the SignalR update was received but view hasn't updated
      dispatch(fetchHealthInfo(userId))
        .unwrap()
        .then(() => {
          if (userId) {
            dispatch(fetchGoals(userId)); // Also refresh goals
          }
          setDataProcessed(false); // Reset processed flag after refresh
        })
        .catch((error) => console.error("Error refreshing data:", error));
    }
  }, [dataProcessed, healthInfo, dispatch, userId]);

  useEffect(() => {
    if (userId) {
      console.log("Dispatching fetchGoals");
      dispatch(fetchGoals(userId))
        .unwrap()
        .then((data) => console.log("Goals fetched successfully:", data))
        .catch((error) => console.error("Error fetching goals:", error));

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
      // Start loading
      setIsLoading(true);
      setLoadingProgress(10);
      setUploadStatus("Reading and encrypting your health data...");

      const fileContent = await file.text();
      setLoadingProgress(20);

      const encryptedContent = encryptData(fileContent);
      setLoadingProgress(30);
      setUploadStatus("Data encrypted. Preparing to upload...");

      const encryptedFile = new Blob([encryptedContent], { type: "text/csv" });

      // Get environment variables with fallback empty strings to avoid undefined
      const region = (import.meta.env.VITE_AWS_REGION as string) || "";
      const accessKeyId =
        (import.meta.env.VITE_AWS_ACCESS_KEY_ID as string) || "";
      const secretAccessKey =
        (import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string) || "";
      const bucket = (import.meta.env.VITE_AWS_BUCKET as string) || "";

      const s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const params = {
        Bucket: bucket,
        Key: `${userId}_${file.name}`,
        Body: encryptedFile,
        Metadata: {
          "user-id": userId,
          encrypted: "true",
        },
      };

      setUploadStatus("Uploading to secure storage...");
      setLoadingProgress(40);
      await s3Client.send(new PutObjectCommand(params));

      setUploadStatus(
        "File uploaded successfully. Processing your health data..."
      );
      setLoadingProgress(50);

      // Poll for data changes every second for up to 20 seconds (increased from 10)
      let attempts = 0;
      const maxAttempts = 20;

      const checkForData = setInterval(async () => {
        attempts++;
        try {
          setLoadingProgress(50 + Math.min(attempts * 2.5, 45)); // Progress from 50% to 95%

          await dispatch(fetchHealthInfo(userId)).unwrap();

          // Check if we actually have data now
          const currentHealthInfo = await dispatch(
            fetchHealthInfo(userId)
          ).unwrap();

          if (
            currentHealthInfo &&
            Array.isArray(currentHealthInfo) &&
            currentHealthInfo.length > 0
          ) {
            clearInterval(checkForData);
            setLoadingProgress(100);
            setUploadStatus("Data processed successfully!");
            setDataProcessed(true);
            setIsLoading(false);
          } else {
            setUploadStatus(`Processing your health data... Please wait.`);
          }
        } catch (error) {
          console.log(
            `Waiting for data to be processed... (${attempts}/${maxAttempts})`
          );

          if (attempts >= maxAttempts) {
            clearInterval(checkForData);
            setUploadStatus(
              "Your data is taking longer than expected to process. Please wait a moment while our system works on it."
            );
            setLoadingProgress(95); // Keep at 95% to show it's still working
          }
        }
      }, 1000);
    } catch (err: any) {
      console.error("Error", err);
      setUploadStatus("Error uploading file. Please try again.");
      setIsLoading(false);
    }
  };

  // Function to render the loading progress bar
  const renderProgressBar = () => {
    return (
      <div className="w-full mt-4">
        <div className="w-full h-4 bg-gray-200 rounded-full">
          <div
            className="h-4 transition-all duration-500 ease-in-out bg-green-600 rounded-full"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <div className="mt-1 text-sm text-gray-600">
          {loadingProgress < 100 ? "Processing..." : "Complete!"}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      {Array.isArray(healthInfo) && healthInfo?.length > 0 ? (
        <div className="flex flex-col space-y-6">
          <Profile />
          <HealthGraphs />
          <GoalLists />
          <MedicineList />
        </div>
      ) : (
        <div className="px-6 py-6 border-[1px] rounded-xl space-y-4">
          <h2 className="text-xl font-bold">
            Upload Your Health Data To Get Started
          </h2>
          <p className="text-gray-600">
            Our system will securely process your health information and provide
            personalized insights.
          </p>

          <Button onClick={openModal}>Upload CSV</Button>

          <UploadModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            onFileUpload={handleFileUpload}
          />

          {isLoading && renderProgressBar()}

          {uploadStatus && (
            <div className="mt-4">
              <p className={`${isLoading ? "text-blue-600 font-medium" : ""}`}>
                {uploadStatus}
              </p>
              {isLoading && loadingProgress >= 95 && (
                <p className="mt-2 text-sm text-gray-600">
                  Please be patient as our system analyzes your health data.
                  This may take a few moments.
                </p>
              )}
            </div>
          )}

          <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50">
            <h3 className="font-medium text-blue-800">Need Test Data?</h3>
            <p className="mt-1 text-sm text-blue-700">
              To get sample data, go to the Github Repository and run the
              data/generate_data.py script or use generated examples from the
              results folder.
            </p>
            <p>
              You can also use this account for testing: test12345678@test.com /
              password: test123{" "}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
