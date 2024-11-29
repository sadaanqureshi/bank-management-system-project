import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./Form.css";

const DepositForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5010/api/v1/accountcards/deposit", // Backend endpoint
        data
      );
      alert(response.data.message);
      console.log("Deposit successful:", response.data);
      reset(); // Reset form fields
    } catch (error) {
      console.error("Error during deposit:", error.response?.data || error);
      alert(
        error.response?.data?.message || "An error occurred during the deposit."
      );
    }
  };

  return (
    <div className="deposit-form">
      <h2>Deposit Money</h2>
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

        {/* Card Type Field */}
        <div className="form-group">
          <label htmlFor="CardType">Card Type:</label>
          <select
            id="CardType"
            {...register("CardType", { required: "Card Type is required" })}
          >
            <option value="">-- Select Card Type --</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          {errors.CardType && <p className="error">{errors.CardType.message}</p>}
        </div>


        {/* PIN Field */}
        <div className="form-group">
          <label htmlFor="PIN">PIN:</label>
          <input
            type="password"
            id="PIN"
            {...register("PIN", {
              required: "PIN is required",
              minLength: {
                value: 4,
                message: "PIN must be at least 4 digits long",
              },
            })}
          />
          {errors.PIN && <p className="error">{errors.PIN.message}</p>}
        </div>

        {/* Amount Field */}
        <div className="form-group">
          <label htmlFor="Amount">Amount:</label>
          <input
            type="number"
            id="Amount"
            {...register("Amount", {
              required: "Amount is required",
              min: { value: 1, message: "Amount must be greater than zero" },
            })}
          />
          {errors.Amount && <p className="error">{errors.Amount.message}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit">Deposit</button>
      </form>
    </div>
  );
};

export default DepositForm;
