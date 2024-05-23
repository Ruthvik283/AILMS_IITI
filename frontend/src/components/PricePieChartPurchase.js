import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const PricePieChartPurchase = ({ data }) => {
    // console.log(data);
  // Group data by material and calculate total quantity
  const materialData = data.reduce(    (acc, purchase) => {
      acc["Total Price"] = acc["Total Price"] || 0;
      acc["Total Price"] += purchase.price * purchase.quantity_purchased;

      acc[purchase.material_name] = acc[purchase.material_name] || 0;
      acc[purchase.material_name] +=
        purchase.price * purchase.quantity_purchased;
      return acc;
    },
    {}
  );

  // Calculate total quantity
  const totalQuantity = Object.values(materialData).reduce(
    (total, qty) => total + qty,
    0
  );

  // Prepare data for pie chart
  const pieChartData = Object.entries(materialData)
    .filter(([materialName, quantity]) => materialName !== "Total Price" && quantity !== 0)
    .map(([materialName, quantity]) => ({
      name: materialName,
      value: 2 * (quantity / totalQuantity) * 100,
      cost: quantity,
    }));

  const COLORS = [
    '#2b6777', // Shade of '#8481DD'
    '#52ab98', // Shade of '#519DE9'
    '#c8d8e4', // Shade of '#73C5C5'
    '#3b5062', // Shades of '#2b6777'
    '#6eafae', 
    '#a8b7bf'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Purchases Cost</h3>
      <div style={{ width: "100%", height: "100%" }}>
        <PieChart width={300} height={250}>

          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => {
              if (name === "value") {
                // Format percentage value
                return `${value.toFixed(2)}%`;
              } else {
                // Format cost value
                const cost = props.payload.cost.toFixed(2); // Assuming cost is a number
                return [`Cost: ₹${cost}`, `Percentage: ${value.toFixed(2)}%`];
              }
            }}
          />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default PricePieChartPurchase;
