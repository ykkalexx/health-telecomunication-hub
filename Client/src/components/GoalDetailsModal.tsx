import React from "react";
import { Dialog } from "@headlessui/react";
import { Goal } from "../types/goals";

interface GoalDetailModalProps {
  goal: Goal | null;
  onClose: () => void;
}

export const GoalDetailModal: React.FC<GoalDetailModalProps> = ({
  goal,
  onClose,
}) => {
  if (!goal) return null;

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
