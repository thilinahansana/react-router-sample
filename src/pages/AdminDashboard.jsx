import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { Link as RouterLink } from "react-router-dom";
import LoadingSpinner from "../ui-components/LoadingSpinner";

const AdminDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [statusFilter, setStatusFilter] = useState("all"); // Status filter state
  const [durationFilter, setDurationFilter] = useState("all"); // Duration filter state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://kecsb4zutd.execute-api.ap-south-1.amazonaws.com/dev/as-user?userId=h.thilina@gtngroup.com`
        );

        const data = response.data;
        const startTime = new Date(data.start_time);
        const endTime = new Date(data.end_time);
        const durationMs = endTime - startTime;

        // Calculate session duration
        let sessionDuration = "Session duration invalid.";
        let status = "Inactive";
        if (durationMs > 0) {
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor(
            (durationMs % (1000 * 60 * 60)) / (1000 * 60)
          );
          sessionDuration = `${hours} hrs ${minutes} mins`;
          status = "Active";
        }

        setUserData([
          {
            userId: data.userId || "h.thilina@gtngroup.com",
            sessionDuration,
            status,
            durationMs,
          },
        ]);
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter logic
  const filteredData = userData.filter((user) => {
    const matchesSearchTerm = user.userId
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status.toLowerCase() === statusFilter;
    const matchesDuration = (() => {
      if (durationFilter === "all") return true;
      if (durationFilter === "short") return user.durationMs < 3600000; // Less than 1 hour
      if (durationFilter === "long") return user.durationMs >= 3600000; // 1 hour or more
      return true;
    })();

    return matchesSearchTerm && matchesStatus && matchesDuration;
  });

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-blue-300 text-lg"
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-500 text-lg"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col w-full mb-6">
      <h1 className="text-2xl sm:text-4xl text-blue-300 font-bold text-center mb-6">
        Admin Dashboard
      </h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full sm:w-3/4 lg:w-1/2 h-[80vh] mx-auto px-8 py-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex flex-col mb-8">
          <div className="flex items-center justify-between">
            <RouterLink to="/" className="text-white text-4xl">
              <IoChevronBackCircleOutline className="text-white text-4xl" />
            </RouterLink>
          </div>

          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search by User ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 w-full sm:w-1/2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 sm:mt-0"
              >
                <option value="all">All Durations</option>
                <option value="short">Short (Less than 1 hour)</option>
                <option value="long">Long (1 hour or more)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full table-auto border-none">
            <thead>
              <tr className="bg-blue-200 text-black rounded-lg">
                <th className="border border-gray-300 px-6 py-3 text-left">
                  User_ID
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  Session Duration
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user, index) => (
                <motion.tr
                  key={user.userId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border border-gray-300 rounded-lg ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {user.userId}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {user.sessionDuration}
                  </td>
                  <td className="px-6 py-4 text-gray-700 flex items-center gap-2">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        user.status === "Active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {user.status}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
