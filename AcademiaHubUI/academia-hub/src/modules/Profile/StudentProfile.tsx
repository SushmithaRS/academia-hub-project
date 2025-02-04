import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid,
} from "@mui/material";
import apiClient from "../../ApiClient";

interface Document {
  id: number;
  fileName: string;
  filePath: string;
  uploadTime: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  documents: Document[];
}

const StudentProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const storedUsername = localStorage.getItem("username");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get(
          `/students/with-documents/${storedUsername}`
        );
        const updatedDocuments = response.data.documents.map((doc: Document) => ({
          ...doc,
          filePath: `http://localhost:8080/${doc.filePath.replace("\\", "/")}`, // Update filePath for browser use
        }));
        setUser({ ...response.data.student, documents: updatedDocuments });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (storedUsername) {
      fetchUserProfile();
    }
  }, [storedUsername]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid container height={"100vh"} width={"100vw"}>
    <Grid item xs={12}>
      <AppBar position="static" sx={{ marginBottom: "20px",width:'100%' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Academia Hub - Student Profile
          </Typography>
        </Toolbar>
      </AppBar>
    </Grid>
      {/* Main Container */}
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: "20px", borderRadius: "10px" }}>
          {/* User Details */}  
          <Typography variant="body1" sx={{ marginBottom: "10px" }}>
            <strong>Username:</strong> {user.username}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "10px" }}>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "20px" }}>
            <strong>Phone Number:</strong> {user.phoneNumber}
          </Typography>

          {/* Document Section */}
          <Typography variant="h5" gutterBottom>
            Uploaded Documents
          </Typography>
          <List>
            {user.documents.length > 0 ? (
              user.documents.map((doc) => (
                <ListItem
                  key={doc.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                  }}
                >
                  <ListItemText primary={doc.fileName} />
                  <Button
                    variant="contained"
                    color="primary"
                    href={doc.filePath} // Redirect to the updated filePath
                    target="_blank"
                  >
                    View Document
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography>No documents uploaded</Typography>
            )}
          </List>
        </Paper>
      </Container>
      </Grid>
    </Grid>
  );
};

export default StudentProfile;
