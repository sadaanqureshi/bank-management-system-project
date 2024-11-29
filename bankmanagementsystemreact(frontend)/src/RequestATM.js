import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Form.css";

const RequestATM = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log("ATM Card Request Data:", data);
      const response = await axios.post("http://localhost:5010/api/v1/accountcards/create", data);

      console.log("ATM Card Request Response:", response.data);
      alert(`ATM Card Request Successful! Response: ${response.data.message}`);
      navigate('/customer-dashboard');
    } catch (error) {
      console.error("Error requesting ATM card:", error);

      // Handle cases where error.response is undefined
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred. Please try again.";
      alert(`Failed to request ATM card: ${errorMessage}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Request ATM Card</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <label>Name:</label>
        <input
          type="text"
          placeholder="Enter your name"
          {...register("Name", { required: "Name is required" })}
        />
        {errors.name && <p className="error">{errors.name.message}</p>}

        {/* AccountID Field */}
        <label>Account ID:</label>
        <input
          type="text"
          placeholder="Enter your Account ID"
          {...register("AccountID", { required: "Account ID is required" })}
        />
        {errors.accountID && <p className="error">{errors.accountID.message}</p>}

        {/* Card Type Field */}
        <label>Card Type:</label>
        <select {...register("CardType", { required: "Card type is required" })}>
          <option value="">Select Card Type</option>
          <option value="Debit">Debit</option>
          <option value="Credit">Credit</option>
        </select>
        {errors.cardType && <p className="error">{errors.cardType.message}</p>}

        {/* PIN Field */}
        <label>PIN:</label>
        <input
          type="password"
          placeholder="Enter a 4-digit PIN"
          {...register("PIN", {
            required: "PIN is required",
            pattern: {
              value: /^\d{4}$/,
              message: "PIN must be exactly 4 digits",
            },
          })}
        />
        {errors.pin && <p className="error">{errors.pin.message}</p>}

        {/* Submit Button */}
        <button type="submit">Request</button>
      </form>
    </div>
  );
};

export default RequestATM;
