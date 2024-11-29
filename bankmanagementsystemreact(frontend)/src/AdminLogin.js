import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Form.css"; // For consistent styling

const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5010/api/v1/admin/login", // Backend endpoint
        data
      );

      if (response.data.success) {
        alert("Login successful");
        console.log("Admin Data:", response.data.data);

        // Redirect to admin-dashboard
        navigate("/admindashboard");
      } else {
        alert(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error.response?.data || error);
      alert(error.response?.data?.message || "An error occurred during login");
    }
  };

  return (
    <div className="form-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="Username">Username:</label>
          <input
            type="text"
            id="Username"
            {...register("Username", { required: "Username is required" })}
          />
          {errors.Username && <p className="error">{errors.Username.message}</p>}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="Password">Password:</label>
          <input
            type="password"
            id="Password"
            {...register("Password", { required: "Password is required" })}
          />
          {errors.Password && <p className="error">{errors.Password.message}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
