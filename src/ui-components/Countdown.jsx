import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Co2Sharp } from "@mui/icons-material";

const CountdownTimer = ({ response }) => {
  const navigate = useNavigate();
  const { start_time, end_time } = response;

  // Helper function to parse date strings into timestamp (milliseconds)
  const parseTime = (timeString) => new Date(timeString).getTime();

  const startTime = parseTime(start_time);
  const endTime = parseTime(end_time);
  const nowTime = new Date().getTime(); // Get current device time

  // Calculate the initial time left based on the current time
  const [timeLeft, setTimeLeft] = useState(
    startTime > nowTime ? startTime - nowTime : 0
  );

  useEffect(() => {
    if (timeLeft <= 0) {
      window.location.reload();
      return;
    }

    // Update the countdown every second
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1000);
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [timeLeft, navigate]);

  // Format timeLeft into hh:mm:ss
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen  text-white">
      <AnimatePresence>
        {timeLeft > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="text-center p-8 px-20 rounded-lg bg-white bg-opacity-10 shadow-lg"
          >
            <motion.h2
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: 10 }}
              className="text-3xl font-semibold mb-4 text-blue-300"
            >
              Countdown Timer
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-6xl font-bold text-white tracking-wider"
            >
              {formatTime(timeLeft)}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-lg mt-4 text-blue-200"
            >
              <Co2Sharp />
              <span className="ml-2">
                Session will start at {new Date(startTime).toLocaleString()}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-200 bg-opacity-30 px-4 py-2 rounded-xl text-white block mt-8 text-center"
            >
              <Link to="/" className="font-semibold">
                Back to Home
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="text-center p-8 rounded-lg bg-white bg-opacity-10 shadow-lg"
          >
            <h2 className="text-3xl font-semibold mb-4 text-blue-300">
              Session Starting...
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountdownTimer;
