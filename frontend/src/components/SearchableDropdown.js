// import { useEffect, useRef, useState } from "react";
// import "./style.css";

// const SearchableDropdown = ({
//   options,
//   label,
//   id,
//   selectedVal,
//   handleChange,
// }) => {
//   const [query, setQuery] = useState("");
//   const [isOpen, setIsOpen] = useState(false);

//   const inputRef = useRef(null);

//   useEffect(() => {
//     document.addEventListener("click", toggle);
//     return () => document.removeEventListener("click", toggle);
//   }, []);

//   const selectOption = (option) => {
//     setQuery(() => "");
//     handleChange(option[label]);
//     setIsOpen((isOpen) => !isOpen);
//   };

//   function toggle(e) {
//     setIsOpen(e && e.target === inputRef.current);
//   }

//   const getDisplayValue = () => {
//     if (query) return query;
//     // if (selectedVal=="All") return "All Materials";
//     if (selectedVal) return selectedVal;

//     return "";
//   };

//   const filter = (options) => {
//     return options.filter(
//       (option) => option[label].toLowerCase().indexOf(query.toLowerCase()) > -1
//     );
//   };

//   return (
//     <div className="dropdown">
//       <div className="control">
//         <div className="selected-value">
//           <input
//             ref={inputRef}
//             type="text"
//             value={getDisplayValue()}
//             name="searchTerm"
//             onChange={(e) => {
//               setQuery(e.target.value);
//               handleChange(null);
//             }}
//             onClick={toggle}
//           />
//         </div>
//         <div className={`arrow ${isOpen ? "open" : ""}`}></div>
//       </div>

//       {/* <div className={`options ${isOpen ? "open" : ""}`}>
//         {filter(options).map((option, index) => {
//           return (
//             <div
//               onClick={() => selectOption(option)}
//               className={`option ${
//                 option[label] === selectedVal ? "selected" : ""
//               }`}
//               key={`${id}-${index}`}
//             >
//               {option[label]}
//             </div>
//           );
//         })}
//       </div> */}
//       <div className={`options ${isOpen ? "open" : ""}`}>
//         {/* Render "All" option */}
//         <div
//           onClick={() => selectOption({ [label]: "All" })} // Assuming "All" is the label for this option
//           className={`option ${selectedVal === "All" ? "selected" : ""}`}
//           key={`${id}-all`}
//         >
//           All
//         </div>

//         {/* Render other options */}
//         {filter(options).map((option, index) => {
//           return (
//             <div
//               onClick={() => selectOption(option)}
//               className={`option ${
//                 option[label] === selectedVal ? "selected" : ""
//               }`}
//               key={`${id}-${index}`}
//             >
//               {option[label]}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default SearchableDropdown;


import { useEffect, useRef, useState } from "react";
import "./style.css";

const SearchableDropdown = ({
  options,
  label,
  id,
  selectedVal,
  handleChange,
  allLabel ,
  display,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);

  const selectOption = (option, label) => {
    setQuery(() => "");
    handleChange(option[label]);
    setIsOpen((isOpen) => !isOpen);
  };

  function toggle(e) {
    setIsOpen(e && e.target === inputRef.current);
  }

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal === "All") return allLabel; // Show dynamically provided label for "All"
    if (selectedVal==display) return display;
    if (selectedVal) return selectedVal;


    return "";
  };

  const filter = (options) => {
    return options.filter(
      (option) => option[label].toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };

  return (
    <div className="dropdown">
      <div className="control">
        <div className="selected-value">
          <input
            ref={inputRef}
            type="text"
            value={getDisplayValue()}
            name="searchTerm"
            onChange={(e) => {
              setQuery(e.target.value);
              handleChange(null);
            }}
            onClick={toggle}
          />
        </div>
        <div className={`arrow ${isOpen ? "open" : ""}`}></div>
      </div>

      <div className={`options ${isOpen ? "open" : ""}`}>
        {/* Render "All" option */}
        <div
          onClick={() => selectOption({ [label]: "All" }, label)}
          className={`option ${selectedVal === "All" ? "selected" : ""}`}
          key={`${id}-all`}
        >
          {allLabel}
        </div>

        {/* Render other options */}
        {filter(options).map((option, index) => {
          return (
            <div
              onClick={() => selectOption(option, label)}
              className={`option ${
                option[label] === selectedVal ? "selected" : ""
              }`}
              key={`${id}-${index}`}
            >
              {option[label]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchableDropdown;
