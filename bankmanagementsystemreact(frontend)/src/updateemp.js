import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const UpdateEmployee = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(`http://localhost:5010/api/v1/employees/update/${data.EmployeeID}`, data);
      alert(response.data.message);
      reset();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating employee');
    }
  };

  return (
    <div>
      <h1>Update Employee</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('EmployeeID')} placeholder="Employee ID" required />
        <input {...register('FirstName')} placeholder="First Name" />
        <input {...register('LastName')} placeholder="Last Name" />
        <input {...register('Position')} placeholder="Position" />
        <input {...register('Salary')} placeholder="Salary" type="number" />
        <input {...register('HireDate')} placeholder="Hire Date" type="date" />
        <input {...register('BranchID')} placeholder="Branch ID" />
        <button type="submit">Update Employee</button>
      </form>
    </div>
  );
};

export default UpdateEmployee;
    