import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { ToastContainer, toast } from 'react-toastify'; // Import Toastr
import 'react-toastify/dist/ReactToastify.css'; // Import Toastr CSS

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNo: '',
    department: '',
    graduationYear: '',
    interests: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/signup', { ...formData });
      toast.success('Signup successful!'); // Toastr success message
      setTimeout(() => {
        navigate('/login'); // Redirect to login page after signup success
      }, 2000); // Delay to ensure toast message shows up before navigation
    } catch (error) {
      console.error(error);
      toast.error('Error signing up!'); // Toastr error message
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="w-full max-w-md bg-white p-6 rounded shadow-lg" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        {['name', 'email', 'password', 'rollNo', 'department', 'graduationYear'].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none"
            />
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Interests (comma-separated)</label>
          <input
            type="text"
            name="interests"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none"
          />
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Signup</button>
        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </form>
      <ToastContainer /> {/* Add ToastContainer to render notifications */}
    </div>
  );
};

export default Signup;
