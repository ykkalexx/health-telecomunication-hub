import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGoals } from "../redux/selectors";
import { Goal } from "../types/goals";
import AddGoalModal from "./AddGoalModal";
import { GoalDetailModal } from "./GoalDetailsModal";
import { BiPlus } from "react-icons/bi";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { setGoals } from "../redux/slices";

const GoalLists: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const goals = useSelector(selectGoals);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5128/goalHub", {
        accessTokenFactory: () => token || "",
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR Connected");
        connection.on("ReceiveGoalUpdate", (data) => {
          dispatch(setGoals(data));
        });
      })
      .catch(console.error);

    return () => {
      connection.stop();
    };
  }, []);

  console.log(goals);

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
    <div className="h-full mt-6">
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="text-xl font-semibold">Health Goals</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="p-2 text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
        >
          <BiPlus size={20} />
        </button>
      </div>

      <div className="grid w-[900px] px-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto max-h-[calc(100vh-200px)]">
        {goals.map((goal) => (
          <div
            key={goal.id}
            onClick={() => setSelectedGoal(goal)}
            className="p-3 transition-shadow bg-white rounded-lg shadow cursor-pointer hover:shadow-md"
          >
            <div className="flex items-center mb-2">
              <span className="mr-2 text-2xl">{getGoalIcon(goal.type)}</span>
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
