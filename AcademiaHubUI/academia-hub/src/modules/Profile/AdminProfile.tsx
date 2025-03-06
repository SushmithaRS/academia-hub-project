import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import apiClient from "../../ApiClient";
import { useTranslation } from "react-i18next";

interface AdminProfile {
  username: string;
  phoneNumber: string;
  email: string;
  profilePicture: string;
}

const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {t}=useTranslation();
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      apiClient
        .get(`/auth/user/${storedUsername}`)
        .then((response) => {
          setProfile(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
          setIsLoading(false);
        });
    }
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* 🔹 Toolbar with Back Button */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate("/dashboard")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t("adminProfile")}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 🔹 Profile Content */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 64px)", 
          width: "100vw",
          padding: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            padding: 4,
            borderRadius: 3,
            width: "100%",
            maxWidth: 500,
            textAlign: "center",
          }}
        >

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">
                {t("name")}
              </Typography>
              <Typography variant="h6">{profile?.username}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">
                {t("phoneNumber")}
              </Typography>
              <Typography variant="h6">{profile?.phoneNumber}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">
                {t("email")}
              </Typography>
              <Typography variant="h6">{profile?.email}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminProfile;
