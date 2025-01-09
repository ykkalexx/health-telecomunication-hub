import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { createGoal } from "../redux/thunks";
import { AppDispatch } from "../redux/root";
import { GoalType } from "../types/goals";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    type: GoalType.Weight,
    currentValue: "",
    targetValue: "",
    targetDate: "",
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const goalData = {
      type: Number(formData.type), // Ensure type is a number
      currentValue: parseFloat(formData.currentValue),
      targetValue: parseFloat(formData.targetValue),
      targetDate: new Date(formData.targetDate).toISOString(),
    };
    //@ts-ignore
    await dispatch(createGoal(goalData));
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">
            Add New Goal
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: Number(e.target.value) as GoalType,
                  })
                }
              >
                <option value={GoalType.Weight}>Weight</option>
                <option value={GoalType.HeartRate}>Heart Rate</option>
                <option value={GoalType.BloodPressureSystolic}>
                  Blood Pressure (Systolic)
                </option>
                <option value={GoalType.BloodPressureDiastolic}>
                  Blood Pressure (Diastolic)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Value
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.currentValue}
                onChange={(e) =>
                  setFormData({ ...formData, currentValue: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter current value"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Value
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.targetValue}
                onChange={(e) =>
                  setFormData({ ...formData, targetValue: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter target value"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Date
              </label>
              <input
                type="date"
                required
                value={formData.targetDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData({ ...formData, targetDate: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="mt-4 flex justify-end space-x-2">
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
                Save Goal
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddGoalModal;
