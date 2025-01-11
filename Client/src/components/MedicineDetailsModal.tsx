import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Medicine } from "../redux/slices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/root";
import { updateMedicine } from "../redux/thunks";
import { selectUserId } from "../redux/selectors";

interface MedicineDetailModalProps {
  medicine: Medicine | null;
  onClose: () => void;
}

export const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  medicine,
  onClose,
}) => {
  if (!medicine) return null;
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(selectUserId);
  const [formData, setFormData] = useState({
    medicineName: medicine.medicineName,
    quantityPerDay: medicine.quantityPerDay,
    timesPerDay: medicine.timesPerDay,
    endDate: medicine.endDate,
    isCompleted: medicine.isCompleted,
  });

  const handleUpdateMedicine = async () => {
    if (!userId) return;

    try {
      await dispatch(
        updateMedicine({
          medicineId: medicine.medicineName,
          userId,
          ...formData,
        })
      );
      onClose();
    } catch (error) {
      console.error("Failed to update medicine:", error);
    }
  };

  return (
    <Dialog open={!!medicine} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">
            {medicine.medicineName} Details
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Quantity Per Day
              </label>
              <input
                type="number"
                value={formData.quantityPerDay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantityPerDay: Number(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Times Per Day
              </label>
              <input
                type="time"
                value={new Date(formData.timesPerDay).toLocaleTimeString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timesPerDay: new Date(`1970-01-01T${e.target.value}`),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={new Date(formData.endDate).toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endDate: new Date(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isCompleted}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isCompleted: e.target.checked,
                  })
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Completed</label>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleUpdateMedicine}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Update Medicine
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default MedicineDetailModal;
