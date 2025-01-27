import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { selectUserHealthInfo, selectUserId } from "../redux/selectors";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { updateHealthInfo } from "../redux/slices";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HealthGraphs = () => {
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const healthInfo = useSelector(selectUserHealthInfo) || [];
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5128/healthHub", {
        accessTokenFactory: () => token || "",
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [token]);

  useEffect(() => {
    if (connection && userId) {
      connection
        .start()
        .then(() => {
          console.log("SignalR Connected");

          connection.on("ReceiveHealthUpdate", (data) => {
            // Update Redux store with new data
            dispatch(updateHealthInfo(data));
          });
        })
        .catch(console.error);

      return () => {
        connection.stop();
      };
    }
  }, [connection, userId]);

  // Memoize the data processing to optimize for large datasets
  const { dates, weights, heartRates, bloodPressureData } = useMemo(() => {
    // Filter out any entries with invalid dates before sorting
    const validData = healthInfo.filter(
      (data) => data?.date && !isNaN(new Date(data.date).getTime())
    );

    // sort data by date
    const sortedData = [...validData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Process dates and measurements
    const dates = sortedData.map((data) =>
      format(parseISO(data.date), "MMM d")
    );
    const weights = sortedData.map((data) => Number(data.weight) || 0);
    const heartRates = sortedData.map((data) => Number(data.heartRate) || 0);

    // Process blood pressure values
    const bloodPressureValues = sortedData.map((data) => {
      try {
        if (!data?.bloodPressure) return { systolic: 0, diastolic: 0 };
        const [systolic, diastolic] = data.bloodPressure.split("/").map(Number);
        return {
          systolic: !isNaN(systolic) ? systolic : 0,
          diastolic: !isNaN(diastolic) ? diastolic : 0,
        };
      } catch {
        return { systolic: 0, diastolic: 0 };
      }
    });

    return {
      dates,
      weights,
      heartRates,
      bloodPressureData: {
        systolic: bloodPressureValues.map((bp) => bp.systolic),
        diastolic: bloodPressureValues.map((bp) => bp.diastolic),
      },
    };
  }, [healthInfo]);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        intersect: false,
        mode: "index" as const,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  const weightData = {
    labels: dates,
    datasets: [
      {
        label: "Weight (kg)",
        data: weights,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const heartRateData = {
    labels: dates,
    datasets: [
      {
        label: "Heart Rate (bpm)",
        data: heartRates,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  const bloodPressureChartData = {
    labels: dates,
    datasets: [
      {
        label: "Systolic",
        data: bloodPressureData.systolic,
        borderColor: "rgb(53, 162, 235)",
        tension: 0.1,
      },
      {
        label: "Diastolic",
        data: bloodPressureData.diastolic,
        borderColor: "rgb(255, 159, 64)",
        tension: 0.1,
      },
    ],
  };

  if (!healthInfo.length) {
    return <div className="p-4 text-center">No health data available</div>;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 p-4 md:grid-cols-2">
      <div className="h-[300px] p-4 border rounded-lg shadow-sm">
        <h3 className="mb-2 text-lg font-semibold">Weight Over Time</h3>
        <Line options={commonOptions} data={weightData} />
      </div>
      <div className="h-[300px] p-4 border rounded-lg shadow-sm">
        <h3 className="mb-2 text-lg font-semibold">Heart Rate Over Time</h3>
        <Line options={commonOptions} data={heartRateData} />
      </div>
      <div className="h-[300px] p-4 border rounded-lg shadow-sm md:col-span-2">
        <h3 className="mb-2 text-lg font-semibold">Blood Pressure Over Time</h3>
        <Line options={commonOptions} data={bloodPressureChartData} />
      </div>
    </div>
  );
};

export default HealthGraphs;
