import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const DeleteEmployee = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async ({ EmployeeID }) => {
    try {
      const response = await axios.delete(`http://localhost:5010/api/v1/employees/delete/${EmployeeID}`);
      alert(response.data.message);
      reset();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting employee');
    }
  };

  return (
    <div>
      <h1>Delete Employee</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('EmployeeID')} placeholder="Employee ID" required />
        <button type="submit">Delete Employee</button>
      </form>
    </div>
  );
};

export default DeleteEmployee;
