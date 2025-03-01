import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useNavigate } from "react-router-dom";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useEffect, useState } from "react";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [newUserData, setNewUserData] = useState({
    username: "",
    password: "",
  });

  function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
  }

  useEffect(() => {
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));
    if (userAuth?.id) navigate("/");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!username || !password) {
      setLoginError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
      localStorage.setItem("userAuth", JSON.stringify(data.user));
      navigate("/");
    } catch (error) {
      setLoginError(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignupError("");

    if (!newUserData.username || !newUserData.password) {
      setSignupError("Please fill in all fields");
      return;
    }

    if (newUserData.password.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }

    try {
      await axios.post("http://localhost:3000/users", newUserData);
      setOpenDialog(false);
      setNewUserData({ username: "", password: "" });
      alert("Account created successfully! Please login.");
    } catch (error) {
      setSignupError(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Box sx={{ maxWidth: 400, width: "100%", p: 3 }}>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: 0 }}>Welcome Back</h2>
          <p style={{ textAlign: "center", color: "#666", marginTop: 0 }}>
            Please login to continue
          </p>

          {loginError && <Alert severity="error">{loginError}</Alert>}

          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <FormControl fullWidth variant="outlined" required>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Login"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            Dont have an account?{" "}
            <Button
              variant="text"
              onClick={() => setOpenDialog(true)}
              sx={{ textTransform: "none" }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <Box component="form" onSubmit={handleSignUp} sx={{ p: 2 }}>
            <DialogTitle sx={{ textAlign: "center" }}>
              Create Account
            </DialogTitle>
            <DialogContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {signupError && <Alert severity="error">{signupError}</Alert>}

              <TextField
                fullWidth
                label="Username"
                value={newUserData.username}
                name="username"
                onChange={(e) =>
                  setNewUserData({ ...newUserData, username: e.target.value })
                }
                required
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={newUserData.password}
                name="password"
                onChange={(e) =>
                  setNewUserData({ ...newUserData, password: e.target.value })
                }
                helperText="At least 6 characters"
                required
              />
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", p: 3 }}>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                Create Account
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        <Tooltip title="Back to Home Page">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              component={Link}
              to="/"
              sx={{ display: "block", mx: "auto", mt: 4 }}
              startIcon={<HomeIcon color="primary" />}
            ></Button>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}
