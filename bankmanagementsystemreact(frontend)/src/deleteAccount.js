import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./Form.css";

const DeleteAccount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this account? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:5010/api/v1/customers/delete/${data.CustomerID}`
        );

        if (response.data.success) {
          alert("Account deleted successfully.");
          reset(); // Reset the form fields after successful deletion
        } else {
          alert("Failed to delete the account. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting account:", error.response?.data || error);
        alert(
          error.response?.data?.message ||
            "An error occurred while attempting to delete the account."
        );
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Delete Account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Customer ID Field */}
        <div className="form-group">
          <label htmlFor="CustomerID">Customer ID:</label>
          <input
            type="text"
            id="CustomerID"
            {...register("CustomerID", { required: "Customer ID is required" })}
          />
          {errors.CustomerID && (
            <p className="error">{errors.CustomerID.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="delete-button">
          Delete Account
        </button>
      </form>
    </div>
  );
};

export default DeleteAccount;