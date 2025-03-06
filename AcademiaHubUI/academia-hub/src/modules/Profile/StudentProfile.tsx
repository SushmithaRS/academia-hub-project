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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Delete, Edit, UploadFile } from "@mui/icons-material";
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
  const [file, setFile] = useState<File | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ username: "", email: "", phoneNumber: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get(`/students/with-documents/${storedUsername}`);
        const updatedDocuments = response.data.documents.map((doc: Document) => ({
          ...doc,
          filePath: `http://localhost:8080/${doc.filePath.replace("\\", "/")}`,
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

  /** 🔹 Handle File Selection */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };
 

  /** 🔹 Upload Document */
  const handleUpload = async () => {
    if (!file) return alert("Please select a file to upload.");
    const formData = new FormData();
    formData.append("files", file);
    formData.append("studentId", String(user?.id));
    try {
      await apiClient.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Failed to upload file.");
    }
  };

  /** 🔹 Delete Document */
  const handleDelete = async (docId: number) => {
    try {
      await apiClient.delete(`/documents/${docId}`);
      alert("Document deleted successfully!");
      setUser((prev) => prev ? { ...prev, documents: prev.documents.filter(doc => doc.id !== docId) } : null);
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document.");
    }
  };

  /** 🔹 Open Edit User Modal */
  const handleEditOpen = () => {
    if (user) {
      setUpdatedUser({ username: user.username, email: user.email, phoneNumber: user.phoneNumber });
      setEditOpen(true);
    }
  };

  /** 🔹 Handle Edit User */
  const handleEditSave = async () => {
    try {
      await apiClient.put(`/students/${user?.id}`, updatedUser);
      alert("Profile updated successfully!");
      setUser((prev) => prev ? { ...prev, ...updatedUser } : null);
      setEditOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid container height={"100vh"} width={"100vw"}>
      <Grid item xs={12}>
        <AppBar position="static" sx={{ marginBottom: "20px", width: "100%" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Academia Hub - Student Profile
            </Typography>
            <Button color="inherit" onClick={handleEditOpen} startIcon={<Edit />}>
              Edit Profile
            </Button>
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

            {/* Upload Document */}
            <input type="file" onChange={handleFileChange} />
            <Button variant="contained" color="secondary" onClick={handleUpload} startIcon={<UploadFile />}>
              Upload Document
            </Button>

            {/* Document Section */}
            <Typography variant="h5" gutterBottom>
              Uploaded Documents
            </Typography>
            <List>
              {user.documents.length > 0 ? (
                user.documents.map((doc) => (
                  <ListItem
                    key={doc.id}
                    sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}
                  >
                    <ListItemText primary={doc.fileName} />
                    <Button variant="contained" color="primary" href={doc.filePath} target="_blank">
                      View
                    </Button>
                    <IconButton color="error" onClick={() => handleDelete(doc.id)}>
                      <Delete />
                    </IconButton>
                  </ListItem>
                ))
              ) : (
                <Typography>No documents uploaded</Typography>
              )}
            </List>
          </Paper>
        </Container>
      </Grid>

      {/* Edit User Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            margin="dense"
            value={updatedUser.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={updatedUser.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="dense"
            value={updatedUser.phoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdatedUser({ ...updatedUser, phoneNumber: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default StudentProfile;
