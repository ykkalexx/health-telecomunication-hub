import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { createMedicine } from "../redux/thunks";
import { AppDispatch } from "../redux/root";

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    medicineName: "",
    quantityPerDay: 0,
    timesPerDay: new Date(),
    startDate: new Date(),
    endDate: new Date(),
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createMedicine(formData));
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-sm p-6 mx-auto bg-white rounded">
          <Dialog.Title className="mb-4 text-lg font-medium">
            Add New Medicine
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Medicine Name
              </label>
              <input
                type="text"
                required
                value={formData.medicineName}
                onChange={(e) =>
                  setFormData({ ...formData, medicineName: e.target.value })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                placeholder="Enter medicine name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity Per Day
              </label>
              <input
                type="number"
                required
                value={formData.quantityPerDay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantityPerDay: Number(e.target.value),
                  })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Times Per Day
              </label>
              <input
                type="time"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timesPerDay: new Date(`1970-01-01T${e.target.value}`),
                  })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: new Date(e.target.value),
                  })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endDate: new Date(e.target.value),
                  })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Save Medicine
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddMedicineModal;
