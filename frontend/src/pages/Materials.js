import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Materials() {
  const [relatedData, setRelatedData] = useState({
    related_categories: [],
    related_materials: [],
  });
  const [path, setPath] = useState([]);
  const [newpath, setnewPath] = useState([]);
  const [categoryId, setCategoryId] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch related categories and materials
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
  }, [categoryId]);

  const handleCategoryClick = (x, name) => {
    // Find the index of x in the path array
    const index = path.findIndex((item) => item.id === x);

    if (index !== -1) {
      // If x is found in the path, remove all elements after it
      setPath((prevPath) => prevPath.slice(0, index + 1));
    } else {
      // If x is not found in the path, add it to the path
      setPath((prevPath) => [...prevPath, { id: x, name: name }]);
    }
    //setPath((prevPath) => [...prevPath, { id: x, name: name }]);
    setCategoryId(x);
  };

  //   const handleGoBack = () => {
  //     // Go back to the cumulative category list
  //     navigate(-1);
  //   };

  return (
    <div className="p-4">
      <div className="p-4 bg-gray-200">
        <p className="text-gray-600">
          All Materials:
          {path.map((x) => (
            <button
              key={x.id}
              className="text-blue-600 hover:text-blue-800 mx-1 focus:outline-none"
              onClick={() => handleCategoryClick(x.id, x.name)}
            >
              -{">"} {x.name}
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
            onClick={() => handleCategoryClick(category.id, category.name)}
          >
            {category.name}
          </li>
        ))}
      </ul>
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
      {/* <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={handleGoBack}
      >
        Go Back
      </button> */}
    </div>
  );
}
