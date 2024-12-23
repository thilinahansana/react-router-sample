import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { motion } from "framer-motion";

import { Link as RouterLink } from "react-router-dom";
import Logo from "../assets/AppStream.svg";
import admin from "../assets/user-setting.png";
import { loginRequest } from "../authConfig";
import adminList from "../adminList";
export function Home() {
  const { instance, accounts } = useMsal();

  const isAdmin = accounts[0] && adminList.includes(accounts[0]?.username);

  const handleLogin = (loginType) => {
    if (loginType === "popup") {
      instance.loginPopup({
        ...loginRequest,
        redirectUri: process.env.REACT_APP_POPUP_REDIRECT_URI, // e.g. /redirect
      });
    } else if (loginType === "redirect") {
      instance.loginRedirect(loginRequest);
    }
  };

  return (
    <>
      <AuthenticatedTemplate>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="absolute top-0 left-0 m-20"
        >
          <RouterLink
            to="/stream-redirect"
            className="px-8 py-6 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden items-center flex flex-col"
          >
            <img src={Logo} alt="Redirect" width={40} height={40} />
            <span className="font-bold mt-2 text-white">My Stream</span>
          </RouterLink>
        </motion.button>
        {isAdmin && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="absolute top-0 left-40 m-20"
          >
            <RouterLink
              to="/dashboard"
              className="px-8 py-6 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden items-center flex flex-col"
            >
              <img src={admin} alt="Redirect" width={40} height={40} />
              <span className="font-bold mt-2 text-white">Admin Dashboard</span>
            </RouterLink>
          </motion.button>
        )}
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full px-8 py-6 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
          <h1 className="text-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-500 text-transparent bg-clip-text mb-10">
            Welcome To JIT Platform
          </h1>
          <center className="text-blue-200">
            Please sign-in to Access Your Session.
          </center>

          <motion.button
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLogin("redirect")}
            key="loginRedirect"
            className="bg-blue-200 bg-opacity-30 border-1 text-white px-4 py-2 rounded-xl font-semibold w-full mt-8 text-center"
          >
            Sign In
          </motion.button>
        </motion.div>
      </UnauthenticatedTemplate>
    </>
  );
}
