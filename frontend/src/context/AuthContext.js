import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  // a call back func |()=>| is used so that ternary condition is run only once at a reload
  let [authTokens, setAuthTokens] = useState(() => {
    try {
      const storedToken = localStorage.getItem("authTokens");
      return storedToken ? JSON.parse(storedToken) : null;
    } catch (error) {
      //console.error("Error decoding authTokens:", error);
      // Clear local storage if decoding error occurs
      localStorage.removeItem("authTokens");
      return null;
    }
  });

  let [user, setUser] = useState(() => {
    try {
      const storedToken = localStorage.getItem("authTokens");
      return storedToken ? jwtDecode(storedToken) : null;
    } catch (error) {
      //console.error("Error decoding user:", error);
      // Clear local storage if decoding error occurs
      localStorage.removeItem("authTokens");
      return null;
    }
  });

  let [user_name, setUsername] = useState(() =>
    localStorage.getItem("user_name") ? localStorage.getItem("user_name") : null
  );
  // let [username, setUsername] = useState(null)
  let [loading, setLoading] = useState(true);

  let [userData, setUserData] = useState({
    id: null,
    username: "",
    email: "",
    departmentName: "",
    role: "",
  });

  //Data fetched here to reduce redundancy
  const [materialsData, setMaterialsData] = useState([]);
  let fetchMaterialsData = async () => {
    try {
      const response = await fetch("/api/materials", {
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
      //toast.success("hi");
      //console.log(data);
    } catch (error) {
      //console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchMaterialsData();
  }, []);

  const [techniciansData, setTechniciansData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/technicians", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTechniciansData(data);
        //console.log("technicians", data);
      } catch (error) {
        //console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/departments", {
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
        //console.log(data);
      } catch (error) {
        //console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [rolesData, setRolesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/get_roles", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setRolesData(data);
        //console.log(data);
      } catch (error) {
        //console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const Navigate = useNavigate();

  // let set_username = (x) => {
  //     setUser(x)
  // }

  let loginUser = async (e, next_url = "/") => {
    //console.log("loginUser");
    // to prevent default reload
    e.preventDefault();
    let response = await fetch("/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });
    let data = await response.json();

    if (response.status === 200) {
      let data2 = jwtDecode(data.access);
      //console.log("data: ", data2.id);
      let response2 = await fetch(
        `/api/get_username/${data2.id}`
      );
      if (response2.status == 400) {
        toast.error(
          "Login failed. Please contact the administrator to assign your department."
        );
        logoutUser();
        return;
      }
      let total_user_data = await response2.json();
      ////console.log("total_user_data", total_user_data);
      setUserData(total_user_data);
      let user_data = jwtDecode(data.access);
      //console.log("user_data", user_data);
      setAuthTokens(data);
      setUser(user_data);
      localStorage.setItem("authTokens", JSON.stringify(data));
      ////console.log(user_data.username)
      localStorage.setItem("username", user_data.username);
      Navigate(next_url);

      toast.success(`Hi, ${total_user_data.username}!`);
    } else {
      toast.error("Incorrect email-id or password!");
      //toast.error(response.message);
    }
  };

  let signupUser = async (e) => {
    //console.log("SignupUser");
    // //console.log(e.target.password.value)
    // //console.log(e.target.confirmpassword.value)
    //e.preventDefault();
    // if (e.target.password.value !== e.target.confirmpassword.value) {
    //   alert("Passwords don't match");
    //   return;
    // }
    let response = await fetch("/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.username,
        password: e.password,
        email: e.email,
        role: e.role,
        department: e.department,
      }),
    });

    if (response.status === 201) {
      toast.success("User registered successfully");
      try {
        await axios.post(`/api/delete_register_request/${e.id}`);
      } catch (error) {
        console.error("Error deleting register request:", error);
      }
      // setAuthTokens(data)
      // setUser(jwtDecode(data.access))
      // localStorage.setItem('authTokens', JSON.stringify(data))

      //   let response = await fetch("/api/token/", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       username: e.target.username.value,
      //       email: e.target.email.value,
      //       password: e.target.password.value,
      //     }),
      //   });
      //   let data = await response.json();

      //   if (response.status === 200) {
      //     Navigate("/");
      //     // let data2 = jwtDecode(data.access);
      //     // //console.log("data: ", data2.id);
      //     // let response2 = await fetch(
      //     //   `/api/get_username/${data2.id}`
      //     // );
      //     // let total_user_data = await response2.json();
      //     // //console.log("data: ");
      //     // //console.log(total_user_data);
      //     // setUserData({
      //     //   id: total_user_data.id,
      //     //   username: total_user_data.username,
      //     //   email: total_user_data.email,
      //     //   departmentName: total_user_data.department_name,
      //     //   role: total_user_data.role_name,
      //     // });
      //     // let user_data = jwtDecode(data.access);
      //     // //console.log("user_data", user_data);
      //     // setUser(user_data);
      //     // setAuthTokens(data);
      //     // localStorage.setItem("authTokens", JSON.stringify(data));
      //     // ////console.log(user_data.username)
      //     // localStorage.setItem("username", user_data.username);
      //     // Navigate(next_url);

      //     // toast.success(`Hi, ${localStorage.getItem("username")}!`);
      //   } else {
      //     toast.error("Something went wrong!");
      //   }
    } else {
      //console.log("Failed to register user. Response code:", response.status);
      //return response.text();
      toast.error("An account with that username/email already exists.");
    }
    //will check this later
    // else if(response.status === 400){
    //     alert('Already registered...redirecting to login')
    //     Navigate('/login')
    // }
  };

  let logoutUser = () => {
    //console.log("logoutUser");
    if (user !== null) {
      toast.success("Logged out successfully!");
    }
    Navigate("/login");
    setUserData({
      id: null,
      username: "",
      email: "",
      departmentName: "",
    });
    setAuthTokens(null);
    setUser(null);
    setUsername("null");
    // localStorage.removeItem('authTokens')
    localStorage.clear();
    // Navigate('/login')
  };

  let updateToken = async () => {
    //console.log("updateToken");
    ////console.log(authTokens?.refresh)
    ////console.log(authTokens.refresh)

    if (authTokens?.refresh === undefined) {
      logoutUser();
      if (loading) {
        setLoading(false);
      }
    } else {
      //console.log("ruth", authTokens?.refresh);
      // const [a, setA] = useState(authTokens.refresh);
      let response = await fetch("/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens?.refresh }),
      });

      let data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data);
        let data2 = jwtDecode(data.access);

        let response2 = await fetch(
          `/api/get_username/${data2.id}`
        );
        let total_user_data = await response2.json();
        //console.log("data: ");
        //console.log(total_user_data);
        setUserData(total_user_data);
        let user_data = jwtDecode(data.access);
        //console.log("user_data", user_data);
        setUser(user_data);

        //setUser(jwtDecode(data.access));
        //console.log("reload", jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));

        //JUST FOR EXTRA SECURITY , NOT REQUIRED!
        //     let data2 = jwtDecode(data.access)
        // //console.log("data: ",data2.id)
        // let response2 = await fetch(`/api/get_username/${data2.id}`)
        // let total_user_data = await response2.json()
        // //console.log("data: ")
        // //console.log(total_user_data)
        // setUserData(
        //     {
        //         id:total_user_data.id,
        //         username: total_user_data.username,
        //         email: total_user_data.email,
        //         departmentName: total_user_data.departmentName
        //     }
        // )
      } else {
        //console.log("LOG-OUT");
        logoutUser();
      }

      if (loading) {
        setLoading(false);
      }
    }
  };
  const location = useLocation();
  // Define a list of valid routes
  const validRoutes = [
    "/",
    "/login",
    "/signup",
    "/home",
    "/purchase",
    "/sanction",
    "/material",
    "/users",
    "/materials",
    "/departments",
    "/purchaseform",
    "/sanctionform",
    "/modifysanction",
    "/modifysanction/:sanct_id",
    "/purchase/purchase_pdf/",
    "/report",
    "/Report",
  ];

  const nonManagerValidRoutes = [
    "/",
    "/login",
    "/signup",
    "/sanction",
    "/sanctionform",
    "/modifysanction", //extra code is also wwritten below to handle /<int>
  ];
  const nonUserValidRoutes = ["/login","/signup"];

  const isValidRoute = validRoutes.includes(location.pathname);
  const nonManagerIsValidRoute = nonManagerValidRoutes.includes(
    location.pathname
  );
  const nonUserIsValidRoute = nonUserValidRoutes.includes(location.pathname);

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = localStorage.getItem("authTokens");
      let role = null;
      if (!userData.id) {
        if (storedToken) {
          try {
            let data2 = jwtDecode(storedToken);
            let response2 = await fetch(
              `/api/get_username/${data2.id}`
            );
            if (response2.ok) {
              let total_user_data = await response2.json();
              role = total_user_data.role;
              //console.log("here");
            }
          } catch (error) {
            console.error("Error occurred while fetching data:", error);
          }
        }
      } else {
        role = userData.role;
      }
      // console.log(role);
      if (role == null) {
        if (!nonUserIsValidRoute) {
          toast.error("Access denied");
          Navigate("/login");
        }
      } else if (role !== "Manager") {
        if (
          !nonManagerIsValidRoute &&
          !location.pathname.startsWith("/modifysanction")
        ) {
          toast.error("Access denied");
          Navigate("/");
        }
      }
    };

    fetchData();
  }, [nonManagerIsValidRoute, user, Navigate]);

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    signupUser: signupUser,
    setUserData: setUserData,
    fetchMaterialsData: fetchMaterialsData,
    setUser: setUser,
    setAuthTokens: setAuthTokens,
    materialsData: materialsData,
    techniciansData: techniciansData,
    departmentData: departmentData,
    rolesData: rolesData,
    userData: userData,
  };

  useEffect(() => {
    if (loading) {
      //  //console.log(user)
      updateToken();
    }

    let fourMinutes = 1000 * 60 * 4;

    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
