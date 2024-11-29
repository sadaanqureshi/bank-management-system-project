import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
// import "./Form.css"; // Add styles if needed

const createTransaction = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await axios.post(
        "http://localhost:5010/api/v1/transactions/create",
        data
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        console.log("Transaction successful:", response.data);
        alert("Transaction successful!");
      } else {
        setErrorMessage(response.data.message || "Transaction failed.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred during the transaction."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
  {/* Account ID */}
  <div className="form-group">
    <label htmlFor="AccountID">Account ID:</label>
    <input
      type="text"
      id="AccountID"
      {...register("AccountID", { required: "Account ID is required" })}
    />
    {errors.AccountID && <p className="error">{errors.AccountID.message}</p>}
  </div>

  {/* Amount */}
  <div className="form-group">
    <label htmlFor="Amount">Amount:</label>
    <input
      type="number"
      id="Amount"
      {...register("Amount", {
        required: "Amount is required",
        min: { value: 1, message: "Amount must be greater than 0" },
      })}
    />
    {errors.Amount && <p className="error">{errors.Amount.message}</p>}
  </div>

  {/* Card Type */}
  <div className="form-group">
    <label htmlFor="CardType">Card Type:</label>
    <select
      id="CardType"
      {...register("CardType", { required: "Card type is required" })}
    >
      <option value="">Select Card Type</option>
      <option value="Debit">Debit</option>
      <option value="Credit">Credit</option>
    </select>
    {errors.CardType && <p className="error">{errors.CardType.message}</p>}
  </div>

  {/* PIN */}
  <div className="form-group">
    <label htmlFor="PIN">PIN:</label>
    <input
      type="password"
      id="PIN"
      {...register("PIN", { required: "PIN is required" })}
    />
    {errors.PIN && <p className="error">{errors.PIN.message}</p>}
  </div>

  {/* Receiver ID */}
  <div className="form-group">
    <label htmlFor="ReceiverID">Receiver ID:</label>
    <input
      type="text"
      id="ReceiverID"
      {...register("ReceiverID", { required: "Receiver ID is required" })}
    />
    {errors.ReceiverID && <p className="error">{errors.ReceiverID.message}</p>}
  </div>

  {/* Submit Button */}
  <button type="submit" className="submit-button" disabled={loading}>
    {loading ? "Processing..." : "Create Transaction"}
  </button>
</form>

  );
};

export default createTransaction;
