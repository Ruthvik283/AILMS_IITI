import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const MaterialPieChartSanction = ({ data }) => {
  // Group data by material and calculate total quantity
  const materialData = data.reduce((acc, item) => {
    if (!acc[item.material_name]) {
      acc[item.material_name] = 0;
    }
    acc[item.material_name] += item.quantity_sanctioned;
    return acc;
  }, {});

  // Calculate total quantity
  const totalQuantity = Object.values(materialData).reduce((total, qty) => total + qty, 0);

  console.log("Total Quantity:", totalQuantity);

  // Prepare data for pie chart
  const pieChartData = Object.entries(materialData).map(([materialName, quantity]) => ({
    name: materialName,
    value: (quantity / totalQuantity) * 100,
  }));

  // const COLORS = ['#8481DD','#519DE9','#73C5C5','#A30000','#F4C145','#A2D9D9','#8A8D90','#009596','#4CB140','#06C','#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF' ]; // Add more colors if needed

  // const COLORS=[ '#2b6777', // Shade of '#8481DD'
  // '#52ab98', // Shade of '#519DE9'
  // '#c8d8e4'  ]
  const COLORS = [
    '#2b6777', // Shade of '#8481DD'
    '#52ab98', // Shade of '#519DE9'
    '#c8d8e4', // Shade of '#73C5C5'
  
    // Additional shades
    '#3b5062', // Shades of '#2b6777'
  
    '#6eafae', 
    '#a8b7bf'
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Number of Approvals</h3>
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
            formatter={(value) => `${value.toFixed(3)}%`}
            />
          

          <Legend/>
        </PieChart>
      </div>
    </div>
  );
};

export default MaterialPieChartSanction;


