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
  // Group data by material
  const materialData = data.reduce((acc, item) => {
    if (!acc[item.material_name]) {
      acc[item.material_name] = [];
    }
    acc[item.material_name].push({
      date: new Date(item.date_time).getTime(),
      quantity: item.quantity_sanctioned,
    });
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(materialData).map(([materialName, materialEntries]) => (
        <div
          key={materialName}
          className="bg-white rounded-lg shadow-md p-4 mb-4"
        >
          <h3 className="text-lg font-semibold mb-2">{materialName}</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <LineChart width={400} height={250} data={materialEntries}>
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
                dataKey="quantity"
                name="Quantity"
                key={materialName}
                stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color for each line
              />
            </LineChart>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaterialGraph;
