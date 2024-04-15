// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Navbar from "../components/Navbar";

// const EditDepartmentModal = ({
//   editDepartment,
//   handleEditDepartment,
//   handleCancelEditDepartment,
//   departments,
//   setEditDepartment,
// }) => {
//   return (
//     <div className="fixed z-10 inset-0 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//         <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//           <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//         </div>

//         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
//           &#8203;
//         </span>

//         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="sm:flex sm:items-start">
//               <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Department</h3>
//                 <div className="mt-2">
//                   <div className="flex flex-col md:flex-row md:items-center mb-4">
//                     <input
//                       type="text"
//                       placeholder="Department Name"
//                       value={editDepartment.department_name}
//                       onChange={(e) =>
//                         setEditDepartment({
//                           ...editDepartment,
//                           department_name: e.target.value,
//                         })
//                       }
//                       className="mb-2 md:mb-0 md:mr-4 px-4 py-2 border border-gray-300 rounded w-full md:w-auto"
//                     />
//                     <label className="inline-flex items-center mr-4">
//                       <input
//                         type="checkbox"
//                         checked={editDepartment.is_main}
//                         onChange={(e) =>
//                           setEditDepartment({
//                             ...editDepartment,
//                             is_main: e.target.checked,
//                           })
//                         }
//                         className="form-checkbox text-blue-500"
//                       />
//                       <span className="ml-2 text-gray-700">Main Department</span>
//                     </label>
//                   </div>
//                   {!editDepartment.is_main && (
//                     <div className="flex flex-col md:flex-row md:items-center mb-4">
//                       <select
//                         value={editDepartment.parent_department ? editDepartment.parent_department : ""}
//                         onChange={(e) =>
//                           setEditDepartment({
//                             ...editDepartment,
//                             parent_department: e.target.value,
//                           })
//                         }
//                         className="px-4 py-2 border border-gray-300 rounded w-full md:w-auto"
//                       >
//                         <option value="">Select Parent Department</option>
//                         {departments
//                           .filter((dept) => dept.is_main)
//                           .map((dept) => (
//                             <option key={dept.id} value={dept.id}>
//                               {dept.department_name}
//                             </option>
//                           ))}
//                       </select>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//             <button
//               type="button"
//               className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//               onClick={handleEditDepartment}
//             >
//               Save Changes
//             </button>
//             <button
//               type="button"
//               className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//               onClick={handleCancelEditDepartment}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DepartmentsPage = () => {
//   const [departments, setDepartments] = useState([]);
//   const [newDepartment, setNewDepartment] = useState({
//     department_name: "",
//     is_main: false,
//     parent_department: null,
//   });
//   const [editDepartment, setEditDepartment] = useState(null);

//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   const fetchDepartments = async () => {
//     try {
//       const response = await axios.get("/api/departments");
//       setDepartments(response.data);
//     } catch (error) {
//       console.error("Error fetching departments:", error);
//     }
//   };

//   const handleAddDepartment = async () => {
//     try {
//       if (newDepartment.department_name === "") {
//         toast.error("Name cant be empty");
//         return;
//       }
//       if (newDepartment.is_main === false && !newDepartment.parent_department) {
//         toast.error("Parent department for non-main department cant be empty!");
//         return;
//       }
//       //   console.log(newDepartment);
//       //   return;
//       const response = await axios.post(
//         "/api/add_department/",
//         newDepartment
//       );
//       if (response.status >= 200 && response.status < 300) {
//         toast.success("Department added successfully");
//         fetchDepartments();
//       } else {
//         toast.error("error adding department");
//       }
//     } catch (error) {
//       console.error("Error adding department:", error);
//       toast.error("error adding department");
//     }
//   };

//   const handleEditDepartment = async () => {
//     try {
//       if (editDepartment.department_name === "") {
//         toast.error("Name cant be empty");
//         return;
//       }
//       if (
//         editDepartment.is_main === false &&
//         !editDepartment.parent_department
//       ) {
//         toast.error("Parent department for non-main department cant be empty!");
//         return;
//       }
//       console.log(JSON.stringify(editDepartment));
//       const response = await axios.post(
//         "/api/edit_department/",
//         JSON.stringify(editDepartment),
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.status >= 200 && response.status < 300) {
//         toast.success("Department edited successfully");
//         fetchDepartments();
//       } else {
//         toast.error("error updating department");
//       }

//       //   const updatedDepartments = departments.map((dept) =>
//       //     dept.id === response.data.data.id ? response.data.data : dept
//       //   );
//       //   setDepartments(updatedDepartments);
//       setEditDepartment(null);
//     } catch (error) {
//       console.error("Error editing department:", error);
//     }
//   };
//   const handleCancelEditDepartment = async () => {
//     setEditDepartment(null);
//   };

//   return (
//     <div>
//       <Navbar className="w-full" />
//       <div className="py-4">
//       <h1 className="text-3xl font-bold mb-6 px-10 ">Departments</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-12 ">
//         {departments.map((department) => (
//           <div key={department.id} className="bg-white rounded-lg shadow-md p-6">
//             <h3 className="text-xl font-semibold mb-2">{department.department_name}</h3>
//             <p className="text-gray-600 mb-2">Main Department: {department.is_main ? "Yes" : "No"}</p>
//             {department.parent_department && (
//               <p className="text-gray-600 mb-4">Parent Department: {department.parent_department_name}</p>
//             )}
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//               onClick={() => setEditDepartment(department)}
//             >
//               Edit
//             </button>
//           </div>
//         ))}
//       </div>
//       <div className="mt-8">
//         <h2 className="text-2xl font-bold mb-4 px-10">Add Department</h2>
//         <div className="flex flex-col md:flex-row md:items-center mb-4 px-12">
//           <input
//             type="text"
//             placeholder="Department Name"
//             value={newDepartment.department_name}
//             onChange={(e) => setNewDepartment({ ...newDepartment, department_name: e.target.value })}
//             className="mb-2 md:mb-0 md:mr-4 px-4 py-2 border border-gray-300 rounded w-full md:w-auto"
//           />
//           <label className="inline-flex items-center mr-4">
//             <input
//               type="checkbox"
//               checked={newDepartment.is_main}
//               onChange={(e) =>
//                 setNewDepartment({
//                   ...newDepartment,
//                   is_main: e.target.checked,
//                 })
//               }
//               className="form-checkbox text-blue-500"
//             />
//             <span className="ml-2 text-gray-700">Main Department</span>
//           </label>
//           {!newDepartment.is_main && (
//             <select
//               value={newDepartment.parent_department || ""}
//               onChange={(e) =>
//                 setNewDepartment({
//                   ...newDepartment,
//                   parent_department: e.target.value || null,
//                 })
//               }
//               className="px-4 py-2 border border-gray-300 rounded w-full md:w-auto"
//             >
//               <option value="">Select Parent Department</option>
//               {departments
//                 .filter((dept) => dept.is_main)
//                 .map((dept) => (
//                   <option key={dept.id} value={dept.id}>
//                     {dept.department_name}
//                   </option>
//                 ))}
//             </select>
//           )}
//         </div>
//         <button
//           onClick={handleAddDepartment}
//           className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded "
//         >
//           Add Department
//         </button>
//       </div>
     
//       {editDepartment && (
//         <EditDepartmentModal
//           editDepartment={editDepartment}
//           handleEditDepartment={handleEditDepartment}
//           handleCancelEditDepartment={handleCancelEditDepartment}
//           departments={departments}
//           setEditDepartment={setEditDepartment}
//         />
//       )}
//     </div>
//     </div>
//   );
// };


// export default DepartmentsPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const EditDepartmentModal = ({
  editDepartment,
  handleEditDepartment,
  handleCancelEditDepartment,
  departments,
  setEditDepartment,
}) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-90">
        <h2 className="text-2xl font-bold mb-4">Edit Department</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditDepartment();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="department_name" className="block font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="department_name"
              name="department_name"
              value={editDepartment.department_name}
              onChange={(e) =>
                setEditDepartment({
                  ...editDepartment,
                  department_name: e.target.value,
                })
              }
              className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={editDepartment.is_main}
                onChange={(e) =>
                  setEditDepartment({
                    ...editDepartment,
                    is_main: e.target.checked,
                  })
                }
                className="form-checkbox text-blue-500"
              />
              <span className="ml-2 text-gray-700">Main Department</span>
            </label>
          </div>
          {!editDepartment.is_main && (
            <div>
              <label htmlFor="parent_department" className="block font-bold mb-2">
                Parent Department
              </label>
              <select
                id="parent_department"
                name="parent_department"
                value={editDepartment.parent_department || ""}
                onChange={(e) =>
                  setEditDepartment({
                    ...editDepartment,
                    parent_department: e.target.value,
                  })
                }
                className="w-full border border-gray-400 p-2 rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Parent Department</option>
                {departments
                  .filter((dept) => dept.is_main)
                  .map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:ring focus:ring-gray-400"
              onClick={handleCancelEditDepartment}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-400"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddDepartmentModal = ({
  handleAddDepartment,
  handleCancelAddDepartment,
  departments,
  setNewDepartment,
  newDepartment,
}) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-90">
        <h2 className="text-2xl font-bold mb-4">Add Department</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddDepartment();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="department_name" className="block font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="department_name"
              name="department_name"
              value={newDepartment.department_name}
              onChange={(e) =>
                setNewDepartment({
                  ...newDepartment,
                  department_name: e.target.value,
                })
              }
              className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="is_main"
                checked={newDepartment.is_main}
                onChange={(e) =>
                  setNewDepartment({
                    ...newDepartment,
                    is_main: e.target.checked,
                  })
                }
                className="form-checkbox text-blue-500"
              />
              <span className="ml-2 text-gray-700">Main Department</span>
            </label>
          </div>
          {!newDepartment.is_main && (
            <div>
              <label htmlFor="parent_department" className="block font-bold mb-2">
                Parent Department
              </label>
              <select
                id="parent_department"
                name="parent_department"
                value={newDepartment.parent_department || ""}
                onChange={(e) =>
                  setNewDepartment({
                    ...newDepartment,
                    parent_department: e.target.value || null,
                  })
                }
                className="w-full border border-gray-400 p-2 rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Parent Department</option>
                {departments
                  .filter((dept) => dept.is_main)
                  .map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:ring focus:ring-gray-400"
              onClick={handleCancelAddDepartment}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-green-400"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    department_name: "",
    is_main: false,
    parent_department: null,
  });
  const [editDepartment, setEditDepartment] = useState(null);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    document.title = "Departments- AILMS";
    window.scrollTo(0, 0);
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleAddDepartment = async () => {
    try {
      if (newDepartment.department_name === "") {
        toast.error("Name can't be empty");
        return;
      }
      if (newDepartment.is_main === false && !newDepartment.parent_department) {
        toast.error("Parent department for non-main department can't be empty!");
        return;
      }
      const response = await axios.post("/api/add_department/", newDepartment);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Department added successfully");
        fetchDepartments();
        setShowAddDepartmentModal(false);
        setNewDepartment({
          department_name: "",
          is_main: false,
          parent_department: null,
        });
      } else {
        toast.error("Error adding department");
      }
    } catch (error) {
      console.error("Error adding department:", error);
      toast.error("Error adding department");
    }
  };

  const handleEditDepartment = async () => {
    try {
      if (editDepartment.department_name === "") {
        toast.error("Name can't be empty");
        return;
      }
      if (editDepartment.is_main === false && !editDepartment.parent_department) {
        toast.error("Parent department for non-main department can't be empty!");
        return;
      }
      const response = await axios.post(
        "/api/edit_department/",
        JSON.stringify(editDepartment),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        toast.success("Department edited successfully");
        fetchDepartments();
      } else {
        toast.error("Error updating department");
      }
      setEditDepartment(null);
    } catch (error) {
      console.error("Error editing department:", error);
    }
  };

  const handleCancelEditDepartment = () => {
    setEditDepartment(null);
  };

  const handleCancelAddDepartment = () => {
    setShowAddDepartmentModal(false);
    setNewDepartment({
      department_name: "",
      is_main: false,
      parent_department: null,
    });
  };

  return (
    <div>
      <Navbar className="w-full" />
      <div className="py-4">
        <div className="mt-4">
          <h2 className="text-2xl font-bold  px-12">Add Department</h2>
          <div className="flex justify-end px-12 mb-4">
            <button
              onClick={() => setShowAddDepartmentModal(true)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-green-400"
            >
              Add Department
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-12">
          {departments.map((department) => (
            <div
              key={department.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{department.department_name}</h3>
                <p className="text-gray-600 mb-2">Main Department: {department.is_main ? "Yes" : "No"}</p>
                {department.parent_department && (
                  <p className="text-gray-600 mb-4">Parent Department: {department.parent_department_name}</p>
                )}
              </div>
              <div className="mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setEditDepartment(department)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 px-10">Add Department</h2>
          <div className="flex justify-start px-12">
            <button
              onClick={() => setShowAddDepartmentModal(true)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-green-400"
            >
              Add Department
            </button>
          </div>
        </div> */}

        {editDepartment && (
          <EditDepartmentModal
            editDepartment={editDepartment}
            handleEditDepartment={handleEditDepartment}
            handleCancelEditDepartment={handleCancelEditDepartment}
            departments={departments}
            setEditDepartment={setEditDepartment}
          />
        )}

        {showAddDepartmentModal && (
          <AddDepartmentModal
            handleAddDepartment={handleAddDepartment}
            handleCancelAddDepartment={handleCancelAddDepartment}
            departments={departments}
            setNewDepartment={setNewDepartment}
            newDepartment={newDepartment}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;