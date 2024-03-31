import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const MaterialGraph = ({ data }) => {
  // Group data by material and date, and sum up the quantities and sanctions for each day
  const aggregatedData = Object.values(
    data.reduce((acc, item) => {
      const materialName = item.material_name;
      const date = new Date(item.date_time).toLocaleDateString();
      const key = `${materialName}-${date}`;
      if (!acc[key]) {
        acc[key] = {
          materialName,
          date,
          totalQuantity: 0,
          totalSanctionCount: 0,
        };
      }
      acc[key].totalQuantity += item.quantity_sanctioned;
      acc[key].totalSanctionCount += 1; // Increment the count for each sanction
      return acc;
    }, {})
  );

  // Sort aggregated data by material name and date
  aggregatedData.sort((a, b) => {
    if (a.materialName !== b.materialName) {
      return a.materialName.localeCompare(b.materialName);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  // Prepare data for the charts
  const chartDataQuantity = {};
  const chartDataSanctionCount = {};

  aggregatedData.forEach(
    ({ materialName, date, totalQuantity, totalSanctionCount }) => {
      if (!chartDataQuantity[materialName]) {
        chartDataQuantity[materialName] = [];
        chartDataSanctionCount[materialName] = [];
      }
      chartDataQuantity[materialName].push({ date, totalQuantity });
      chartDataSanctionCount[materialName].push({ date, totalSanctionCount });
    }
  );

  return (
    <div>
      {Object.entries(chartDataQuantity).map(([materialName, data], index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">{materialName}</h3>
          <div className="flex">
            <div style={{ width: "50%", marginRight: "10px" }}>
              <div style={{ width: "100%", height: "300px" }}>
                <LineChart width={400} height={300} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalQuantity"
                    name="Total Quantity"
                    stroke="#8884d8"
                  />
                </LineChart>
              </div>
            </div>
            <div style={{ width: "50%" }}>
              <div style={{ width: "100%", height: "300px" }}>
                <LineChart
                  width={400}
                  height={300}
                  data={chartDataSanctionCount[materialName]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalSanctionCount"
                    name="Total Sanction Count"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaterialGraph;
