import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "../redux/selectors";
import { Medicine, setMedicines } from "../redux/slices";
import { fetchMedicines } from "../redux/thunks";
import { AppDispatch, RootState } from "../redux/root";
import AddMedicineModal from "./AddMedicineModal";
import { BiPlus } from "react-icons/bi";
import MedicineDetailModal from "./MedicineDetailsModal";
import { HubConnectionBuilder } from "@microsoft/signalr";

const MedicineLists: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(selectUserId);
  const medicines = useSelector((state: RootState) => state.medicine.medicines);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5128/medicineHub", {
        accessTokenFactory: () => token || "",
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR Connected");
        connection.on("ReceiveMedicineUpdate", (data) => {
          dispatch(setMedicines(data));
        });
      })
      .catch(console.error);

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchMedicines(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className="h-full mt-6">
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="text-xl font-semibold">Medications</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="p-2 text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
        >
          <BiPlus size={20} />
        </button>
      </div>

      <div className="flex flex-row items-center gap-5 overflow-y-scroll">
        {medicines.map((medicine) => (
          <div
            key={medicine.medicineName}
            onClick={() => setSelectedMedicine(medicine)}
            className="p-3 transition-shadow bg-white rounded-lg shadow cursor-pointer hover:shadow-md"
          >
            <div className="flex items-center mb-2">
              <span className="mr-2 text-2xl">💊</span>
              <h3 className="font-medium">{medicine.medicineName}</h3>
            </div>
            <div className="text-sm text-gray-600">
              <p>Quantity: {medicine.quantityPerDay} per day</p>
              <p>Time: {new Date(medicine.timesPerDay).toLocaleTimeString()}</p>
              <p>Start: {new Date(medicine.startDate).toLocaleDateString()}</p>
              <p>End: {new Date(medicine.endDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      <AddMedicineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <MedicineDetailModal
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
      />
    </div>
  );
};

export default MedicineLists;
