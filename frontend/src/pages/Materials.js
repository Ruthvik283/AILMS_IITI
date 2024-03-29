import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer2 from "../components/Footer";
import toast from "react-hot-toast";

export default function Materials() {
  const [relatedData, setRelatedData] = useState({
    related_categories: [],
    related_materials: [],
  });
  const [path, setPath] = useState([{ id: 1, category_name: "All Materials" }]);
  const [x, setx] = useState(0);
  const [categoryId, setCategoryId] = useState(1);
  const [MaterialFormData, setMaterialFormData] = useState({
    material_name: "",
    price: "",
    quantity: "",
    critical_quantity: "",
    rack_number: "",
    row_number: "",
  });
  const [CategoryFormData, setCategoryFormData] = useState({
    category_name: "",
  });
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [showAddMaterialsForm, setShowAddMaterialsForm] = useState(false);

  useEffect(() => {
    if (categoryId) {
      axios
        .get(`/api/categories/${categoryId}/related/`)
        .then((response) => {
          setRelatedData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching related data:", error);
        });
    }
  }, [categoryId, x]);

  const handleCategoryClick = (x, name) => {
    const index = path.findIndex((item) => item.id === x);

    if (index !== -1) {
      setPath((prevPath) => prevPath.slice(0, index + 1));
    } else {
      setPath((prevPath) => [...prevPath, { id: x, category_name: name }]);
    }
    setCategoryId(x);
  };

  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    setMaterialFormData({
      ...MaterialFormData,
      [name]: value,
    });
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData({
      ...CategoryFormData,
      [name]: value,
    });
  };

  const handleMaterialSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/create-material/", {
        ...MaterialFormData,
        category: categoryId,
      })
      .then((response) => {
        console.log("Material created successfully:", response.data);
        toast.success("Material created successfully");
        setx(!x);
        setShowAddMaterialsForm(!showAddMaterialsForm);
        setMaterialFormData({
          material_name: "",
          price: "",
          quantity: "",
          critical_quantity: "",
          rack_number: "",
          row_number: "",
        });
      })
      .catch((error) => {
        console.error("Error creating material:", error);
        toast.error("Error creating material")
      });
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/create-category/", {
        ...CategoryFormData,
        parent_category: categoryId,
      })
      .then((response) => {
        console.log("Category created successfully:", response.data);
        toast.success("Category created successfully");
        setx(!x);
        setShowAddCategoryForm(!showAddCategoryForm);
        setCategoryFormData({
          category_name: "",
        });
      })
      .catch((error) => {
        console.error("Error creating category:", error);
        toast.error("Error creating category")
      });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 mb-2">
        <Navbar />
        <div className="mx-4 pt-4">
          <div className="p-4 bg-white rounded-lg shadow-md mb-6">
            <p className="text-gray-700 flex flex-wrap items-center">
              Path
              {path.map((x) => (
                <button
                  key={x.id}
                  className="text-indigo-600 hover:text-indigo-800 mx-1 focus:outline-none transition-colors duration-300"
                  onClick={() => handleCategoryClick(x.id, x.category_name)}
                >
                  -&gt; {x.category_name}
                </button>
              ))}
            </p>
          </div>

          <h2 className="text-2xl font-bold my-6 text-gray-800">Categories</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {relatedData.related_categories.map((category) => (
              <li
                key={category.id}
                onClick={() =>
                  handleCategoryClick(category.id, category.category_name)
                }
              >
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-lg transition-shadow duration-300">
                  <p className="text-lg font-semibold text-gray-800">
                    {category.category_name}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
            className="mb-4 mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 transition-colors duration-300"
          >
            {showAddCategoryForm ? "Hide" : "Add Category"}
          </button>
          {showAddCategoryForm && (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mb-8">
              <h1 className="text-2xl font-bold mb-4 text-gray-800">
                Add Category
              </h1>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-gray-700">
                    Category Name:
                  </label>
                  <input
                    type="text"
                    name="category_name"
                    value={CategoryFormData.category_name}
                    onChange={handleCategoryChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 transition-colors duration-300"
                >
                  Submit
                </button>
              </form>
            </div>
          )}

          <h2 className="text-2xl font-bold mt-8 mb-6 text-gray-800">
            Materials
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {relatedData.related_materials.map((material) => (
              <li key={material.material_id}>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-xl font-bold mb-2 text-gray-800">
                    {material.material_name}
                  </h2>
                  <p className="text-gray-700 mb-2">Price: ${material.price}</p>
                  <p className="text-gray-700 mb-2">
                    Quantity: {material.quantity}
                  </p>
                  <p className="text-gray-700 mb-2">
                    Critical Quantity: {material.critical_quantity}
                  </p>
                  <div className="mt-4 text-gray-600">
                    <span className="font-semibold">Rack Number:</span>{" "}
                    {material.rack_number}
                  </div>
                  <div className="mt-1 text-gray-600">
                    <span className="font-semibold">Row Number:</span>{" "}
                    {material.row_number}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowAddMaterialsForm(!showAddMaterialsForm)}
            className="mb-4 mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 transition-colors duration-300"
          >
            {showAddMaterialsForm ? "Hide" : "Add Material"}
          </button>
          {showAddMaterialsForm && (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Add Material
              </h2>
              <form onSubmit={handleMaterialSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-gray-700">
                    Material Name:
                  </label>
                  <input
                    type="text"
                    name="material_name"
                    value={MaterialFormData.material_name}
                    onChange={handleMaterialChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700">Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={MaterialFormData.price}
                    onChange={handleMaterialChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700">Quantity:</label>
                  <input
                    type="number"
                    name="quantity"
                    value={MaterialFormData.quantity}
                    onChange={handleMaterialChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700">
                    Critical Quantity:
                  </label>
                  <input
                    type="number"
                    name="critical_quantity"
                    value={MaterialFormData.critical_quantity}
                    onChange={handleMaterialChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700">
                    Rack Number:
                  </label>
                  <input
                    type="text"
                    name="rack_number"
                    value={MaterialFormData.rack_number}
                    onChange={handleMaterialChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700">
                    Row Number:
                  </label>
                  <input
                    type="text"
                    name="row_number"
                    value={MaterialFormData.row_number}
                    onChange={handleMaterialChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 transition-colors duration-300"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer2 />
    </>
  );
}
