import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const SanctionGraph = ({ data }) => {
  // Calculate total quantity and number of sanctions for each date
  const dateData = data.reduce((acc, item) => {
    const dateStr = new Date(item.date_time).toLocaleDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = {
        date: new Date(item.date_time).getTime(),
        totalQuantity: 0,
        sanctionCount: 0,
      };
    }
    acc[dateStr].totalQuantity += item.quantity_sanctioned;
    acc[dateStr].sanctionCount++;
    return acc;
  }, {});

  // Convert dateData object to an array of objects
  let chartData = Object.values(dateData);

  // Sort chartData by date in ascending order
  chartData.sort((a, b) => a.date - b.date);

  // Calculate the total quantity sanctioned for each material
  const materialData = data.reduce((acc, item) => {
    if (!acc[item.material_name]) {
      acc[item.material_name] = 0;
    }
    acc[item.material_name] += item.quantity_sanctioned;
    return acc;
  }, {});

  // Convert materialData object to an array of objects
  const paretoData = Object.entries(materialData).map(([material, quantity]) => ({
    material,
    quantity,
  }));

  // Sort paretoData by quantity in descending order
  paretoData.sort((a, b) => b.quantity - a.quantity);

  // Calculate the cumulative quantity over time
  let cumulativeQuantity = 0;
  const cumulativeChartData = chartData.map(({ date, totalQuantity }) => {
    cumulativeQuantity += totalQuantity;
    return {
      date,
      cumulativeQuantity,
    };
  });

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2 text-center">
          Sanctions Over Time
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <LineChart width={400} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                type="number"
                domain={["auto", "auto"]}
                tickFormatter={(timeStr) => new Date(timeStr).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(timeStr) => new Date(timeStr).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalQuantity"
                name="Total Material Quantity Sanctioned"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ stroke: "#8884d8", strokeWidth: 3, fill: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </div>
          <div>
            <LineChart width={400} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                type="number"
                domain={["auto", "auto"]}
                tickFormatter={(timeStr) => new Date(timeStr).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(timeStr) => new Date(timeStr).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sanctionCount"
                name="Total Number of Sanctions"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ stroke: "#82ca9d", strokeWidth: 3, fill: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </div>
          <div>
            <LineChart width={400} height={300} data={cumulativeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                type="number"
                domain={["auto", "auto"]}
                tickFormatter={(timeStr) => new Date(timeStr).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(timeStr) => new Date(timeStr).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cumulativeQuantity"
                name="Cumulative Quantity Sanctioned"
                stroke="#FF5733"
                strokeWidth={2}
                dot={{ stroke: "#FF5733", strokeWidth: 3, fill: "#fff" }}
              />
            </LineChart>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 flex justify-center">
        <div style={{ width: "80%" }}>
          <h3 className="text-lg font-semibold mb-2 text-center">
            Pareto Chart for Materials
          </h3>
          <BarChart
            width={800}
            height={400}
            data={paretoData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="material" />
            <YAxis yAxisId="left" />
            <YAxis
              yAxisId="right"
              orientation="right"
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="quantity" fill="#8884d8">
              {paretoData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.cumulativePercentage > 80 ? "#82ca9d" : "#8884d8"}
                />
              ))}
            </Bar>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulativePercentage"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={false}
            />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default SanctionGraph;