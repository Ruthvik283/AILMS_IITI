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
  const { userData: { id: user_id }, logoutUser } = useContext(AuthContext);

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const tokenString = localStorage.getItem("authTokens");
    const token = tokenString ? JSON.parse(tokenString).access : null;

    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    console.log("usrid: ", user_id)
    const response1 = await fetch(`http://127.0.0.1:8000/api/change-password/`, {
      method: "POST",
      body: JSON.stringify({
        user_id,
        oldPassword,
        newPassword
      }),
      headers
    });

    if (!response1.ok) {
      if (response1.status === 401) {
        toast.error("Old password does not match")
      }
      else {
        toast.error("An Internal Server error occured");
      }
    }
    else {
      toast.success("Password changed successfully. Please log in again")
      logoutUser();
      return navigate("/login")
    }

  };

  return (
    <>
      <Navbar />
      <div className="change-password-container">
        <h2>Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <label htmlFor="oldPassword">Old Password:</label>
          <input
            className="passinput border-2"
            type="password"
            id="oldPassword"
            name="oldPassword"
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <label htmlFor="newPassword">New Password:</label>
          <input
            className="passinput border-2"
            type="password"
            id="newPassword"
            name="newPassword"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            className="passinput border-2"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={
            oldPassword.length === 0 ||
            newPassword.length === 0 ||
            newPassword !== confirmPassword ||
            newPassword === oldPassword
          }>
            Change Password
          </button>
        </form>
        <ul>
          {
            newPassword !== confirmPassword &&
            (
              <li> - Password and Confirm Password do not match</li>
            )
          }
          {
            oldPassword.length === 0 &&
            (
              <li> - Old Password cannot be Empty</li>
            )
          }
          {
            newPassword.length === 0 &&
            (
              <li> - New Password cannot be Empty</li>
            )
          }
          {
            newPassword === oldPassword &&
            (
              <li> - Passwords cannot be the same</li>
            )
          }
        </ul>
      </div>
    </>
  );
}