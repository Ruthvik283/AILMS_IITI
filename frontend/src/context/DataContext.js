import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthContext from "./AuthContext";

const DataContext = createContext();

export default DataContext;

export const DataProvider = ({ children }) => {
  const contextData = useContext(AuthContext);
  // a call back func |()=>| is used so that ternary condition is run only once at a reload
  const [materialsData, setMaterialsData] = useState([]);
  let [loading, setLoading] = useState(true);
  const fetchData1 = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/materials", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMaterialsData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const [departmentData, setDepartmentData] = useState([]);

  const fetchData2 = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/departments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDepartmentData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const [sanctionData, setSanctionData] = useState([]);
  let [materialWisePrice, setmaterialWisePrice] = useState([]);

  const fetchData3 = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/sanctions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(contextData.userData),
      });
      console.log("rrr", contextData.userData);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSanctionData(data);
      console.log("DataContext1", data);
      setmaterialWisePrice(
        data.reduce((acc, purchase) => {
          acc["Total Price"] = acc["Total Price"] || 0;
          acc["Total Price"] += purchase.price * purchase.quantity_sanctioned;

          acc[purchase.material_name] = acc[purchase.material_name] || 0;
          acc[purchase.material_name] +=
            purchase.price * purchase.quantity_sanctioned;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData1();
    fetchData2();
    fetchData3();
    if (loading) {
      setLoading(false);
    }
  }, [contextData.userData]);

  let contextData1 = {
    materialsData: materialsData,
    sanctionData: sanctionData,
    departmentData: departmentData,
    materialWisePrice: materialWisePrice,
    //fetchData:fetchData,
  };

  return (
    <DataContext.Provider value={contextData1}>
      {loading ? null : children}
    </DataContext.Provider>
  );
};
