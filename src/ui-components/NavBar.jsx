import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import WelcomeName from "./WelcomeName";
import SignInSignOutButton from "./SignInSignOutButton";
import { Link as RouterLink } from "react-router-dom";

const NavBar = () => {
  return (
    <div sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        className="bg-gradient-to-r from-blue-950 to-cyan-800"
      >
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>
            <div className="flex items-center space-x-3">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTVC0ARwJpu4lZZ0LtlFQorf3jrNnHxfe8Hw&s"
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <RouterLink to="/" className="text-xl font-semibold font-mono">
                JIT Platform
              </RouterLink>
            </div>
          </Typography>
          <WelcomeName />
          <SignInSignOutButton />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
