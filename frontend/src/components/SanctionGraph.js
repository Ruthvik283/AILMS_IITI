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

const SanctionGraph = ({ data }) => {

  const dateData = data.reduce((acc, item) => {
    const dateStr = new Date(item.date_time).toLocaleDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = {
        date: new Date(item.date_time).getTime(),
        totalQuantity: 0,
      };
    }
    acc[dateStr].totalQuantity += item.quantity_sanctioned;
    return acc;
  }, {});

  // Convert dateData object to an array of objects
  const chartData = Object.values(dateData);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Sanctions Over Time</h3>
        <div style={{ width: "100%", height: "300px" }}>
          <LineChart width={800} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              type="number"
              domain={["auto", "auto"]}
              tickFormatter={(timeStr) =>
                new Date(timeStr).toLocaleDateString()
              }
            />
            <YAxis />
            <Tooltip
              labelFormatter={(timeStr) =>
                new Date(timeStr).toLocaleDateString()
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalQuantity"
              name="Quantity Sanctioned"
              stroke="#8884d8" // Color for the line
              strokeWidth={2}
              dot={{ stroke: "#8884d8", strokeWidth: 3, fill: "#fff" }} // Custom dot style
              activeDot={{ r: 6 }} // Custom active dot style
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default SanctionGraph;
