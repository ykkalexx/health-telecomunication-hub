import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotificationSettings,
  updateNotificationSettings,
} from "../redux/thunks";
import { selectUserId } from "../redux/selectors";
import { NotificationSettings as Settings } from "../redux/slices";
import { AppDispatch } from "../redux/root";

export const NotificationSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(selectUserId);
  const [settings, setSettings] = useState<Settings>({
    emailNotificationsEnabled: false,
    medicineReminderTimes: [],
    goalReminderTimes: [],
  });

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotificationSettings(userId));
    }
  }, [dispatch, userId]);

  const handleAddTime = (type: "medicine" | "goal") => {
    const time = prompt("Enter time (HH:MM format):");
    if (time) {
      setSettings((prev) => ({
        ...prev,
        [type === "medicine" ? "medicineReminderTimes" : "goalReminderTimes"]: [
          ...prev[
            type === "medicine" ? "medicineReminderTimes" : "goalReminderTimes"
          ],
          time,
        ],
      }));
    }
  };

  const handleSave = async () => {
    if (userId) {
      await dispatch(updateNotificationSettings({ userId, settings }));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="mb-4 text-xl font-semibold">Notification Settings</h2>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.emailNotificationsEnabled}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                emailNotificationsEnabled: e.target.checked,
              }))
            }
            className="mr-2"
          />
          <label>Enable Email Notifications</label>
        </div>

        <div>
          <h3 className="mb-2 font-medium">Medicine Reminder Times</h3>
          <div className="flex flex-wrap gap-2">
            {settings.medicineReminderTimes.map((time, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 rounded">
                {time}
              </span>
            ))}
            <button
              onClick={() => handleAddTime("medicine")}
              className="px-2 py-1 text-blue-600 rounded hover:bg-blue-50"
            >
              + Add Time
            </button>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-medium">Goal Reminder Times</h3>
          <div className="flex flex-wrap gap-2">
            {settings.goalReminderTimes.map((time, index) => (
              <span key={index} className="px-2 py-1 bg-green-100 rounded">
                {time}
              </span>
            ))}
            <button
              onClick={() => handleAddTime("goal")}
              className="px-2 py-1 text-green-600 rounded hover:bg-green-50"
            >
              + Add Time
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};
