import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectGoals } from "../redux/selectors";
import { Goal } from "../types/goals";
import AddGoalModal from "./AddGoalModal";
import { GoalDetailModal } from "./GoalDetailsModal";
import { BiPlus } from "react-icons/bi";

const GoalLists: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const goals = useSelector(selectGoals);

  const getGoalIcon = (type: string) => {
    switch (type) {
      case "Weight":
        return "⚖️";
      case "HeartRate":
        return "❤️";
      case "BloodPressureSystolic":
      case "BloodPressureDiastolic":
        return "🩺";
      default:
        return "🎯";
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4 p-6">
        <h2 className="text-xl font-semibold">Health Goals</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          <BiPlus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            onClick={() => setSelectedGoal(goal)}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{getGoalIcon(goal.type)}</span>
              <h3 className="font-medium">{goal.type}</h3>
            </div>
            <div className="text-sm text-gray-600">
              <p>Target: {goal.targetValue}</p>
              <p>Current: {goal.currentValue}</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(100, goal.progressPercentage)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <GoalDetailModal
        goal={selectedGoal}
        onClose={() => setSelectedGoal(null)}
      />
    </div>
  );
};

export default GoalLists;
