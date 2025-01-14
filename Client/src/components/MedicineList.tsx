import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "../redux/selectors";
import { Medicine } from "../redux/slices";
import { fetchMedicines } from "../redux/thunks";
import { AppDispatch, RootState } from "../redux/root";
import AddMedicineModal from "./AddMedicineModal";
import { BiPlus } from "react-icons/bi";
import MedicineDetailModal from "./MedicineDetailsModal";

const MedicineLists: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(selectUserId);
  const medicines = useSelector((state: RootState) => state.medicine.medicines);

  useEffect(() => {
    if (userId) {
      dispatch(fetchMedicines(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className="mt-6 h-full">
      <div className="flex justify-between items-center mb-2 px-4">
        <h2 className="text-xl font-semibold">Medications</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          <BiPlus size={20} />
        </button>
      </div>

      <div className="grid px-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {medicines.map((medicine) => (
          <div
            key={medicine.medicineName}
            onClick={() => setSelectedMedicine(medicine)}
            className="p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">💊</span>
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
