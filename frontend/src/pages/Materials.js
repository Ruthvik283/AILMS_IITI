import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer2 from "../components/Footer";

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
        setx(!x);
        setShowAddCategoryForm(!showAddCategoryForm);
        setCategoryFormData({
          category_name: "",
        });
      })
      .catch((error) => {
        console.error("Error creating category:", error);
      });
  };

  return (
    <>
      <div className="min-h-screen mb-2">
        <Navbar />
        <div className="ml-2 mr-2">
          <div className="p-4 bg-gray-200">
            <p className="text-gray-600">
              Path
              {path.map((x) => (
                <button
                  key={x.id}
                  className="text-blue-600 hover:text-blue-800 mx-1 focus:outline-none"
                  onClick={() => handleCategoryClick(x.id, x.category_name)}
                >
                  -&gt; {x.category_name}
                </button>
              ))}
            </p>
          </div>

          <h2 className="text-xl font-bold mb-4">Related Categories</h2>
          <ul className="space-y-2">
            {relatedData.related_categories.map((category) => (
              <li
                key={category.id}
                className="bg-blue-200 hover:bg-blue-300 cursor-pointer rounded p-2"
                onClick={() =>
                  handleCategoryClick(category.id, category.category_name)
                }
              >
                {category.category_name}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
            className="mb-4 mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            {showAddCategoryForm ? "Hide" : "Add Category"}
          </button>
          {showAddCategoryForm && (
            <div className="max-w-md mx-auto p-6 bg-gray-100">
              <h1 className="text-2xl font-bold mb-4">Add Category</h1>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block mb-1">Category Name:</label>
                  <input
                    type="text"
                    name="category_name"
                    value={CategoryFormData.category_name}
                    onChange={handleCategoryChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  Submit
                </button>
              </form>
            </div>
          )}

          <h2 className="text-xl font-bold mt-8 mb-4">Related Materials</h2>
          <ul className="space-y-2">
            {relatedData.related_materials.map((material) => (
              <li
                key={material.material_id}
                className="bg-blue-200 hover:bg-blue-300 cursor-pointer rounded p-2"
              >
                <span className="font-bold">{material.material_name}</span> -{" "}
                {material.price}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowAddMaterialsForm(!showAddMaterialsForm)}
            className="mb-4 mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            {showAddMaterialsForm ? "Hide" : "Add Material"}
          </button>
          {showAddMaterialsForm && (
            <div className="max-w-md mx-auto p-6 bg-gray-100">
              <h2 className="text-2xl font-bold mb-4">Add Material</h2>
              <form onSubmit={handleMaterialSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1">Material Name:</label>
                  <input
                    type="text"
                    name="material_name"
                    value={MaterialFormData.material_name}
                    onChange={handleMaterialChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1">Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={MaterialFormData.price}
                    onChange={handleMaterialChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1">Quantity:</label>
                  <input
                    type="number"
                    name="quantity"
                    value={MaterialFormData.quantity}
                    onChange={handleMaterialChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1">Critical Quantity:</label>
                  <input
                    type="number"
                    name="critical_quantity"
                    value={MaterialFormData.critical_quantity}
                    onChange={handleMaterialChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1">Rack Number:</label>
                  <input
                    type="text"
                    name="rack_number"
                    value={MaterialFormData.rack_number}
                    onChange={handleMaterialChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1">Row Number:</label>
                  <input
                    type="text"
                    name="row_number"
                    value={MaterialFormData.row_number}
                    onChange={handleMaterialChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
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
