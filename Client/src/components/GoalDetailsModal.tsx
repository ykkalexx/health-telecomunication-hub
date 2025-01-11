import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Goal } from "../types/goals";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/root";
import { updateGoal } from "../redux/thunks";
import { selectUserId } from "../redux/selectors";
import { current } from "@reduxjs/toolkit";

interface GoalDetailModalProps {
  goal: Goal | null;
  onClose: () => void;
}

export const GoalDetailModal: React.FC<GoalDetailModalProps> = ({
  goal,
  onClose,
}) => {
  if (!goal) return null;
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(selectUserId);
  const [newCurrentValue, setNewCurrentValue] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const handleUpdateGoal = async () => {
    if (!newCurrentValue || !userId) return;

    if (Number(newCurrentValue) >= goal.targetValue) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }

    try {
      // Log request data for debugging
      console.log("Update request:", {
        goalId: goal.id,
        userId: userId,
        currentValue: Number(newCurrentValue),
        isCompleted: isCompleted,
      });

      await dispatch(
        updateGoal({
          userId,
          goalId: goal.id,
          currentValue: Number(newCurrentValue),
          isCompleted: isCompleted,
        })
      );
      onClose();
    } catch (error) {
      console.error("Failed to update goal:", error);
    }
  };

  return (
    <Dialog open={!!goal} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">
            {goal.type} Goal Details
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Progress</h3>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">
                Current Value
              </h3>
              <p className="text-lg">{goal.currentValue}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">
                Target Value
              </h3>
              <p className="text-lg">{goal.targetValue}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Update Current Value
              </label>
              <input
                type="number"
                step="0.01"
                value={newCurrentValue}
                onChange={(e) => setNewCurrentValue(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Enter new current value"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleUpdateGoal}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Update Progress
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Target Date</h3>
              <p className="text-lg">
                {new Date(goal.targetDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">AI Advice</h3>
              <p className="text-sm text-gray-600 mt-1">
                {goal.aiGeneratedAdvice}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
