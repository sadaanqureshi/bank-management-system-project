// import React, { useState } from 'react';
// import axios from 'axios';
// import { useForm } from 'react-hook-form';

// const Loan = () => {
//   const { register, handleSubmit, formState: { errors }, reset } = useForm();
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Handle form submission
//   const onSubmit = async (data) => {
//     const { CustomerID, LoanType } = data;

//     try {
//       setLoading(true);
//       // Sending a POST request to create a loan
//       const response = await axios.post('http://localhost:5010/api/v1/loans/create', {
//         CustomerID,
//         LoanType,
//       });

//       if (response.data.success) {
//         setMessage('Loan created successfully!');
//         reset(); // Reset form fields
//       } else {
//         setMessage(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       setMessage('Error creating loan. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="loan-form">
//       <h2>Create a Loan</h2>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div>
//           <label htmlFor="customerID">Customer ID:</label>
//           <input
//             type="text"
//             id="customerID"
//             {...register('CustomerID', { required: 'Customer ID is required' })}
//           />
//           {errors.CustomerID && <p>{errors.CustomerID.message}</p>}
//         </div>

//         <div>
//           <label htmlFor="loanType">Loan Type:</label>
//           <input
//             type="text"
//             id="loanType"
//             {...register('LoanType', { required: 'Loan Type is required' })}
//           />
//           {errors.LoanType && <p>{errors.LoanType.message}</p>}
//         </div>

//         <button type="submit" disabled={loading}>
//           {loading ? 'Processing...' : 'Create Loan'}
//         </button>
//       </form>

//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default Loan;


import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const PaymentForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onSubmit = async (data) => {
    const { CustomerID, LoanType } = data;
//fixed
    try {
      setLoading(true);
      // Sending a POST request to create a payment
      const response = await axios.post('http://localhost:5010/api/v1/payments/create', {
        LoanID,
        Amount,
        PaymentMethod,
      });

      if (response.data.success) {
        setMessage('Payment successfully recorded!');
        reset(); // Reset form fields
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Error processing payment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h2>Make a Payment</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="LoanID">Loan ID:</label>
          <input
            type="text"
            id="LoanID"
            {...register('LoanID', { required: 'Loan ID is required' })}
          />
          {errors.LoanID && <p>{errors.LoanID.message}</p>}
        </div>

        <div>
          <label htmlFor="Amount">Amount:</label>
          <input
            type="number"
            id="Amount"
            {...register('Amount', { required: 'Amount is required', min: 1 })}
          />
          {errors.Amount && <p>{errors.Amount.message}</p>}
        </div>

        <div>
          <label htmlFor="PaymentMethod">Payment Method:</label>
          <input
            type="text"
            id="PaymentMethod"
            {...register('PaymentMethod', { required: 'Payment Method is required' })}
          />
          {errors.PaymentMethod && <p>{errors.PaymentMethod.message}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Make Payment'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default PaymentForm;
