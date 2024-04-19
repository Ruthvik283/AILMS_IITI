import React, { useState } from "react";
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
  const [selectedMaterial, setSelectedMaterial] = useState("");

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
  const chartDataCumulative = {};

  aggregatedData.forEach(
    ({ materialName, date, totalQuantity, totalSanctionCount }) => {
      if (!chartDataQuantity[materialName]) {
        chartDataQuantity[materialName] = [];
        chartDataSanctionCount[materialName] = [];
        chartDataCumulative[materialName] = [];
      }
      chartDataQuantity[materialName].push({ date, totalQuantity });
      chartDataSanctionCount[materialName].push({ date, totalSanctionCount });

      // Calculate cumulative quantity
      const cumulativeData = chartDataQuantity[materialName];
      const cumulativeQuantity = cumulativeData.reduce(
        (acc, { totalQuantity }) => acc + totalQuantity,
        0
      );
      chartDataCumulative[materialName].push({
        date,
        cumulativeQuantity,
      });
    }
  );

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Material Graphs</h3>
          <div>
            <label htmlFor="material-select" className="mr-2">
              Select Material:
            </label>
            <select
              id="material-select"
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="bg-gray-200 rounded-md px-2 py-1"
            >
              <option value="">All Materials</option>
              {[...new Set(data.map((item) => item.material_name))].map(
                (material, index) => (
                  <option key={index} value={material}>
                    {material}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {selectedMaterial
        ? Object.entries(chartDataQuantity).find(
            ([material]) => material === selectedMaterial
          ) && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">{selectedMaterial}</h3>
              <div className="flex flex-col lg:flex-row overflow-x-auto">
                <div className="lg:w-1/3 lg:mr-6 mb-6 lg:mb-0">
                  <div style={{ width: "100%", maxWidth: "400px", height: "300px" }}>
                    <LineChart
                      width={400}
                      height={300}
                      data={chartDataQuantity[selectedMaterial]}
                    >
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
                <div className="lg:w-1/3 lg:mr-6 mb-6 lg:mb-0">
                  <div style={{ width: "100%", maxWidth: "400px", height: "300px" }}>
                    <LineChart
                      width={400}
                      height={300}
                      data={chartDataSanctionCount[selectedMaterial]}
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
                <div className="lg:w-1/3">
                  <div style={{ width: "100%", maxWidth: "400px", height: "300px" }}>
                    <LineChart
                      width={400}
                      height={300}
                      data={chartDataCumulative[selectedMaterial]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="cumulativeQuantity"
                        name="Cumulative Quantity"
                        stroke="#FF5733"
                      />
                    </LineChart>
                  </div>
                </div>
              </div>
            </div>
          )
        : Object.entries(chartDataQuantity).map(([materialName, data], index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">{materialName}</h3>
              <div className="flex flex-col lg:flex-row overflow-x-auto">
                <div className="lg:w-1/3 lg:mr-6 mb-6 lg:mb-0">
                  <div style={{ width: "100%", maxWidth: "400px", height: "300px" }}>
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
                <div className="lg:w-1/3 lg:mr-6 mb-6 lg:mb-0">
                  <div style={{ width: "100%", maxWidth: "400px", height: "300px" }}>
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
                <div className="lg:w-1/3">
                  <div style={{ width: "100%", maxWidth: "400px", height: "300px" }}>
                    <LineChart
                      width={400}
                      height={300}
                      data={chartDataCumulative[materialName]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="cumulativeQuantity"
                        name="Cumulative Quantity"
                        stroke="#FF5733"
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