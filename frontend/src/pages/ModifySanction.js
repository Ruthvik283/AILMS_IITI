import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";

function isNumeric(str) {
  return !isNaN(str) && !isNaN(parseInt(str));
}

const ModifySanctionForm = () => {
  const contextData = useContext(AuthContext);
  const Navigate = useNavigate();
  const [sanctionData, setsanctionData] = useState({});
  const [materialData, setmaterialData] = useState({});
  const [quantity, setquantity] = useState("");
  const [type, settype] = useState("");
  const [totype, settotype] = useState("");
  const [messages, setmessages] = useState([]);
  const [X, setX] = useState(true);

  const sancData = (id) => {
    try {
      if (!id || id == 0) {
        setsanctionData({});
        setmaterialData({});
      } else {
        const fetchData = async () => {
          try {
            const response1 = await fetch(
              `/api/sanctions/${id}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response1.ok) {
              throw new Error(`HTTP error! Status: ${response1.status}`);
            }

            const data1 = await response1.json();
            setsanctionData(data1);
            if (contextData.userData.role != "Manager") {
              if (data1.engineer_id != contextData.userData.id) {
                toast.error("You are not allowed to modify that sanction");
                Navigate("/sanction");
              }
            }

            //console.log("sanc_req", data1);

            const response2 = await fetch(
              `/api/materials/${data1.material}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response2.ok) {
              throw new Error(`HTTP error! Status: ${response2.status}`);
            }

            const data2 = await response2.json();
            setmaterialData(data2);
          } catch (error) {
            setsanctionData({});
            setmaterialData({});
          }
        };
        fetchData();
      }
    } catch (error) {
      //console.log(error);
    }
  };

  const { sanct_id } = useParams();
  useEffect(() => {
    //console.log("called again");
    if (sanct_id !== undefined) {
      sancData(sanct_id);
      //console.log("sanc_id  ", sanct_id);
    }
  }, [sanct_id, X]);

  function modify_sanction() {
    const err = [];
    if (type === "close") {
      if (sanctionData.closed) {
        err.push("Approval is closed and cannot be edited");
      }
    } else if (Object.keys(sanctionData).length === 0) {
      err.push("Invalid Sanction ID");
    } else if (sanctionData.closed) {
      err.push("Sanction is closed and cannot be edited");
    } else if (type === "head" || type === "") {
      err.push("Please select a type");
    } else if (!isNumeric(quantity)) {
      err.push("Invalid quantity");
    } else if (Number(quantity) <= 0) {
      err.push("Quantity must be greater than 0");
    } else if (type === "add" && ((sanctionData.sanct_type === "A" && materialData.quantity_A < quantity) || (sanctionData.sanct_type === "B" && materialData.quantity_B < quantity))) {
      err.push(
        `Amount of material left is Insufficient. Only ${materialData.quantity_A} units of category-${sanctionData.sanct_type} left`
      );
    } else if (
      type === "return" &&
      Number(quantity) > sanctionData.quantity_sanctioned
    ) {
      err.push(
        `Amount of sanctioned material is Insufficient. Only ${sanctionData.quantity_sanctioned} units sanctioned`
      );
    }

    setmessages(err);

    if (err.length === 0) {
      const submitData = async () => {
        try {
          const response1 = await fetch(
            `/api/modifysanction/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                quantity: Number(quantity),
                type: type,
                sanct_id: sanctionData.sanction_id,
                to_type: totype,
              }),
            }
          );

          if (!response1.ok) {
            throw new Error(`HTTP error! Status: ${response1.status}`);
          } else {
            setX(!X);
            Navigate(`/modifysanction/${sanctionData.sanction_id}`);
            toast.success(`Approval updated successfully!`);
          }
        } catch (error) {
          console.error("Error data:", error);
        }
      };
      submitData();

      //   setX(!X);
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Modify Approval</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label
                htmlFor="sanct_id"
                className="block text-gray-700 font-bold mb-2"
              >
                Approval ID
              </label>
              <input
                type="text"
                name="sanct_id"
                id="sanct_id"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(event) => sancData(event.target.value)}
                defaultValue={sanct_id}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="type"
                className="block text-gray-700 font-bold mb-2"
              >
                Type
              </label>
              <select
                name="type"
                id="type"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(event) => settype(event.target.value)}
              >
                <option value="head">-Choose option-</option>
                <option value="add">Add</option>
                <option value="return">Return</option>
                <option value="close">Close</option>
              </select>
            </div>
            <div className="mb-4">
              {sanctionData.sanct_type == "A" && type == "return" && (
                <>
                  <label
                    htmlFor="type"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Return as
                  </label>
                  <select
                    name="type"
                    id="type"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(event) => settotype(event.target.value)}
                  >
                    <option value="head">-Choose option-</option>
                    <option value="A">Category-A</option>
                    <option value="B">Category-B</option>
                  </select>
                </>
              )}
            </div>
            <div className="mb-4">
              {type != "close" && (
                <>
                  <label
                    htmlFor="quantity"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Quantity
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    id="quantity"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(event) => setquantity(event.target.value)}
                  />
                </>
              )}
            </div>
            <button
              onClick={modify_sanction}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Modify
            </button>
            {messages.length > 0 && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4"
                role="alert"
              >
                <ul>
                  {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <div className="mb-4">
              <div>
                <h3 className="text-lg font-bold mb-2">Approval Log</h3>
                <ul className="divide-y divide-gray-200">
                  {/* Initial sanction entry */}
                  <li className="py-3 text-gray-700">
                    Approval opened at{" "}
                    {new Date(sanctionData.date_time).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </li>
                  <li className="py-3 text-gray-700 font-bold">
                    Net quantity approved: {sanctionData.quantity_sanctioned}
                  </li>
                  <li className="py-3 text-gray-700 font-bold">
                    Material Approved: {sanctionData.material_name}
                  </li>
                  <li className="py-3 text-gray-700 font-bold">
                    Category : {sanctionData.sanct_type}
                  </li>
                  <li className="py-3 text-gray-700">
                    Quantity left: Category A:-{materialData.quantity_A} B:-{materialData.quantity_B}
                  </li>
                </ul>
                {sanctionData.log && sanctionData.log.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {sanctionData.log.map((entry, index) => {
                      if (Array.isArray(entry)) {
                        return (
                          <li
                            key={index}
                            className="py-3 flex items-center justify-between"
                          >
                            <div className="text-gray-700">
                              {new Date(entry[0]).toLocaleString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </div>
                            <div
                              className={`${Number(entry[1]) > 0
                                ? "text-green-600"
                                : "text-red-600"
                                } font-semibold`}
                            >
                              {Number(entry[1]) > 0
                                ? `${entry[1]} Added(+)`
                                : `${entry[1]} Returned(-) -> ${entry[2]}`}
                            </div>
                          </li>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500">No log data available.</p>
                )}

                <div className="mt-4">
                  <span className="text-lg font-bold">Approval Status: </span>
                  {sanctionData.closed ? (
                    <span className="text-red-600 font-semibold">Closed</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Open</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModifySanctionForm;
