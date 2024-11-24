import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion'; // Import Framer Motion for animation
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests

const LandingPage = () => {
  const [showMoreUsers, setShowMoreUsers] = useState(false);
  const [showMoreEvents, setShowMoreEvents] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [usersWithSimilarInterests, setUsersWithSimilarInterests] = useState([]); // State to store fetched users
  const location = useLocation();
  const navigate = useNavigate();

  const userName = location.state?.userName || '';
  const userEmail = location.state?.userEmail || '';
  
  const events = [
    { title: 'Hackathon', date: 'Nov 25', image: '../public/images/img1.png', description: 'A fun coding event for everyone!' },
    { title: 'AI Workshop', date: 'Nov 27', image: '../public/images/img2.png', description: 'Learn the basics of Artificial Intelligence.' },
    { title: 'Coding Contest', date: 'Nov 30', image: '../public/images/img3.png', description: 'Compete against others in a thrilling coding contest.' },
    { title: 'Web Development Workshop', date: 'Dec 5', image: '../public/images/img4.png', description: 'A workshop on building dynamic websites.' },
  ];

  const filteredUsers = usersWithSimilarInterests.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchUsersWithSimilarInterests = async () => {
      try {
        const response = await axios.get('https://deploydemo-backend.onrender.com', {
          params: { email: userEmail },
        });

        console.log(response.data);  // Check response structure
        setUsersWithSimilarInterests(response.data); // Set the fetched users
      } catch (error) {
        console.error("Error fetching users with similar interests:", error);
      }
    };

    if (userEmail) {
      fetchUsersWithSimilarInterests(); // Fetch the data if email exists
    }
  }, [userEmail]); // Re-fetch when the email changes

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowMoreUsers(false);
        setShowMoreEvents(false); // Close events modal when clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        {/* Campus Connect Heading Section */}
        <motion.div
          className="text-center my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Campus-Connect</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Campus-Connect is a platform designed to bring together students from various departments, 
            fostering a vibrant community for collaboration, learning, and networking. Here, you can connect 
            with like-minded individuals, participate in exciting events, and stay updated with campus happenings.
          </p>
        </motion.div>

        {/* Users with Similar Interests Section */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">Users with Similar Interests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(showMoreUsers ? filteredUsers : filteredUsers.slice(0, 4)).map((user, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-sm text-gray-800">{user.department}</p>
                <p className="text-sm text-gray-700">Graduation Year: {user.graduationYear}</p>
                <p className="text-sm text-gray-600">Interests: {user.interests?.join(", ")}</p>
              </div>
            ))}
          </div>
          {filteredUsers.length > 4 && (
            <div className="flex justify-end">
              <button
                onClick={() => { 
                  setShowMoreUsers(!showMoreUsers);
                }}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out"
              >
                {showMoreUsers ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
        </motion.section>

        {/* Show More Users in a Big Card in the Center */}
        {showMoreUsers && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto relative">
              {/* Close Button (X sign) */}
              <button
                onClick={() => setShowMoreUsers(false)}
                className="absolute top-2 right-2 text-2xl font-bold text-gray-500 hover:text-gray-800"
              >
                &times;
              </button>
              <h3 className="text-2xl font-semibold text-center mb-6">More Users</h3>
              
              {/* Search Bar Inside Modal */}
              <motion.div
                className="text-center my-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <input
                  type="text"
                  placeholder="Search Users by Name or Department"
                  className="p-2 w-full md:w-1/2 rounded-md border border-gray-300 shadow-md mb-6"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-sm text-gray-800">{user.department}</p>
                      <p className="text-sm text-gray-700">Graduation Year: {user.graduationYear}</p>
                      <p className="text-sm text-gray-600">Interests: {user.interests?.join(", ")}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Events Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showMoreEvents ? events : events.slice(0, 3)).map((event, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-t-lg mb-4" />
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.date}</p>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            ))}
          </div>
          {events.length > 3 && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowMoreEvents(!showMoreEvents)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out"
              >
                {showMoreEvents ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default LandingPage;
