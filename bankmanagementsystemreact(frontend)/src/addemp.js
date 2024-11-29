import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const AddEmployee = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5010/api/v1/employees/create', data);
      alert(response.data.message);
      reset();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding employee');
    }
  };

  return (
    <div>
      <h1>Add Employee</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('EmployeeID')} placeholder="Employee ID" required />
        <input {...register('FirstName')} placeholder="First Name" required />
        <input {...register('LastName')} placeholder="Last Name" required />
        <input {...register('Position')} placeholder="Position" required />
        <input {...register('Salary')} placeholder="Salary" required type="number" />
        <input {...register('HireDate')} placeholder="Hire Date" required type="date" />
        <input {...register('BranchID')} placeholder="Branch ID" required />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
