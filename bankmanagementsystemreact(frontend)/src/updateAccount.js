import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Form.css";

const UpdateAccount = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const { id: CustomerID } = useParams(); // Retrieve CustomerID from URL params

  // Fetch customer data and populate form
  useEffect(() => {
    if (CustomerID) {
      axios.get(`http://localhost:5010/api/v1/customers/get/${CustomerID}`)
        .then((response) => {
          const customer = response.data;
          Object.keys(customer).forEach((key) => setValue(key, customer[key]));
        })
        .catch((error) => {
          console.error("Error fetching customer data:", error);
          alert("Failed to load customer data. Please try again.");
        });
    }
  }, [CustomerID, setValue]);

  // Submit the updated data to the backend
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Send only the entered values (filter out empty fields)
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined && value !== "")
      );

      const response = await axios.put(
        `http://localhost:5010/api/v1/customers/update/${CustomerID}`,
        filteredData
      );

      if (response.data.success) {
        alert("Account updated successfully!");
      } else {
        alert("Failed to update the account. Please try again.");
      }
    } catch (error) {
      console.error("Error updating account:", error.response?.data || error);
      alert(error.response?.data?.message || "An error occurred while updating the account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Update Account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* First Name */}
        <div className="form-group">
          <label htmlFor="FirstName">First Name:</label>
          <input
            type="text"
            id="FirstName"
            {...register("FirstName", { required: "First Name is required" })}
          />
          {errors.FirstName && <p className="error">{errors.FirstName.message}</p>}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label htmlFor="LastName">Last Name:</label>
          <input
            type="text"
            id="LastName"
            {...register("LastName", { required: "Last Name is required" })}
          />
          {errors.LastName && <p className="error">{errors.LastName.message}</p>}
        </div>

        {/* Address */}
        <div className="form-group">
          <label htmlFor="Address">Address:</label>
          <input
            type="text"
            id="Address"
            {...register("Address")}
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="Email">Email:</label>
          <input
            type="email"
            id="Email"
            {...register("Email", { required: "Email is required" })}
          />
          {errors.Email && <p className="error">{errors.Email.message}</p>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="Phone">Phone:</label>
          <input
            type="tel"
            id="Phone"
            {...register("Phone")}
          />
        </div>

        {/* Branch ID */}
        <div className="form-group">
          <label htmlFor="BranchID">Branch ID:</label>
          <input
            type="text"
            id="BranchID"
            {...register("BranchID")}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="update-button" disabled={loading}>
          {loading ? "Updating..." : "Update Account"}
        </button>
      </form>
    </div>
  );
};

export default UpdateAccount;
