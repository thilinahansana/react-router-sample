import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ErrorPage = ({ response }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full px-8 py-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-lg mt-4 "
      >
        <h1 className="text-3xl  text-center text-blue-300 font-bold mb-8">
          Warning !
        </h1>
      </motion.div>

      <p className="text-center text-blue-200 text-md">{response.message}</p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-blue-200 bg-opacity-30 px-4 py-2 text-white rounded-xl block mt-8 text-center"
      >
        <Link to="/" className="">
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default ErrorPage;
