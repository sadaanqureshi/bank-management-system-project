// import React from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import "./Form.css";

// const Withdraw = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   // Handle form submission

//   const [isLoading, setIsLoading] = React.useState(false);
//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     try {
//       console.log("Withdrawal Data:", data);
    

//       const response = await axios.post(
//         "http://localhost:5010/api/v1/accountcards/withdrawl", // Backend endpoint
//         data
//       );
//       alert(response.data.message);
//       console.log("Withdrawal successful:", response.data);
//       // reset(); // Reset form fields
//     } catch (error) {
//       console.error("Error during withdrawal:", error.response?.data || error);
//       alert(
//         error.response?.data?.message || "An error occurred during the withdrawal."
//       );
//     }
//     finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Withdraw Amount</h2>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         {/* Customer ID Field */}
//         <div className="form-group">
//           <label htmlFor="CustomerID">Customer ID:</label>
//           <input
//             type="text"
//             id="CustomerID"
//             {...register("CustomerID", { required: "Customer ID is required" })}
//           />
//           {errors.CustomerID && (
//             <p className="error">{errors.CustomerID.message}</p>
//           )}
//         </div>

//         {/* Card Type Field */}
//         <div className="form-group">
//           <label htmlFor="CardType">Card Type:</label>
//           <select
//             id="CardType"
//             {...register("CardType", { required: "Card Type is required" })}
//           >
//             <option value="">-- Select Card Type --</option>
//             <option value="credit">Credit</option>
//             <option value="debit">Debit</option>
//           </select>
//           {errors.CardType && <p className="error">{errors.CardType.message}</p>}
//         </div>

//         {/* PIN Field */}
//         <div className="form-group">
//           <label htmlFor="PIN">PIN:</label>
//           <input
//             type="password"
//             id="PIN"
//             {...register("PIN", {
//               required: "PIN is required",
//               minLength: {
//                 value: 4,
//                 message: "PIN must be at least 4 digits long",
//               },
//             })}
//           />
//           {errors.PIN && <p className="error">{errors.PIN.message}</p>}
//         </div>

//         {/* Amount Field */}
//         <div className="form-group">
//           <label htmlFor="Amount">Amount:</label>
//           <input
//             type="number"
//             id="Amount"
//             {...register("Amount", {
//               required: "Amount is required",
//               min: { value: 1, message: "Amount must be greater than zero" },
//             })}
//           />
//           {errors.Amount && <p className="error">{errors.Amount.message}</p>}
//         </div>

//         {/* Submit Button */}
//         <button type="submit">Withdraw</button>
//       </form>
//     </div>
//   );
// };

// export default Withdraw;


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./Form.css";

const Withdraw = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsLoading(true); // Start loading
    try {
      console.log("Withdrawal Data Sent:", data);

      const response = await axios.post(
        "http://localhost:5010/api/v1/accountcards/withdrawl", // Backend endpoint
        data
      );

      // Successful response
      alert(response.data.message);
      console.log("Withdrawal Successful:", response.data);

      reset(); // Reset form fields
    } catch (error) {
      console.error(
        "Error during withdrawal:",
        error.response?.data || error.message || error
      );

      // Display an error message
      alert(
        error.response?.data?.message ||
          "An error occurred during the withdrawal. Please try again."
      );
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="form-container">
      <h2>Withdraw Amount</h2>
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Withdraw"}
        </button>
      </form>
    </div>
  );
};

export default Withdraw;
