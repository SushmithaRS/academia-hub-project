import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import apiClient from "../../ApiClient";

interface AdminProfile {
  username: string;
  phoneNumber: string;
  email: string;
  profilePicture: string;
}

const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      setUsername(storedUsername);

      // Make an API request to fetch the user's profile using the username
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
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: 2,
        width:'100vw'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          height: "100%",
          width: "100%",
          // maxWidth: 800,
          padding: 4,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Profile
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Name
            </Typography>
            <Typography variant="h6">{profile?.username}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Mobile
            </Typography>
            <Typography variant="h6">{profile?.phoneNumber}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary">
              Email
            </Typography>
            <Typography variant="h6">{profile?.email}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminProfile;
