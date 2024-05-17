import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const {
    userData: { id: user_id },
    logoutUser,
  } = useContext(AuthContext);

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (newPassword === oldPassword) {
      toast.error("Old and new passwords cannot be the same");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }

    if (oldPassword.length === 0) {
      toast.error("Old Password cannot be Empty");
      return;
    }

    if (newPassword.length === 0) {
      toast.error("New Password cannot be Empty");
      return;
    }
    const tokenString = localStorage.getItem("authTokens");
    const token = tokenString ? JSON.parse(tokenString).access : null;
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    console.log("usrid: ", user_id);
    const response1 = await fetch(
      `http://127.0.0.1:8000/api/change-password/`,
      {
        method: "POST",
        body: JSON.stringify({ user_id, oldPassword, newPassword }),
        headers,
      }
    );
    if (!response1.ok) {
      if (response1.status === 401) {
        toast.error("Old password is incorrect");
      } else {
        toast.error("An Internal Server error occured");
      }
    } else {
      toast.success("Password changed successfully. Please log in again");
      logoutUser();
      return navigate("/login");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Change Password</h2>
        <form
          onSubmit={handleChangePassword}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="oldPassword"
            >
              Old Password:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              id="oldPassword"
              name="oldPassword"
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="newPassword"
            >
              New Password:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              id="newPassword"
              name="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm New Password:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              //   disabled={
              //     oldPassword.length === 0 ||
              //     newPassword.length === 0 ||
              //     newPassword !== confirmPassword ||
              //     newPassword === oldPassword
              //   }
            >
              Change Password
            </button>
          </div>
        </form>
        <ul className="list-disc pl-6">
          {newPassword === oldPassword && (
            <li className="text-red-500">
              - Old and new passwords cannot be the same
            </li>
          )}
          {newPassword !== confirmPassword && (
            <li className="text-red-500">
              - Password and Confirm Password do not match
            </li>
          )}
          {oldPassword.length === 0 && (
            <li className="text-red-500">- Old Password cannot be Empty</li>
          )}
          {newPassword.length === 0 && (
            <li className="text-red-500">- New Password cannot be Empty</li>
          )}
        </ul>
      </div>
    </>
  );
}
