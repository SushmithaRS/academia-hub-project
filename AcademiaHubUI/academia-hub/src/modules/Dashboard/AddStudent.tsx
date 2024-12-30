import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";

type AddStudentPopupProps = {
  open: boolean;
  onClose: () => void;
  onStudentAdded: (student: { name: string; email: string; phoneNumber: string }) => void;
};

const AddStudent: React.FC<AddStudentPopupProps> = ({ open, onClose, onStudentAdded }) => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false); // Loading state for API call

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!username.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validate()) {
      setLoading(true); // Start loading
      try {
        const response = await axios.post("http://localhost:8080/api/students", {
          username,
          email,
          phoneNumber,
        });
        onStudentAdded(response.data); // Notify parent component
        onClose(); // Close popup
        setName("");
        setEmail("");
        setPhoneNumber("");
      } catch (error: any) {
        // Handle API error
        setErrors({ api: error.response?.data?.message || "Failed to add student." });
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Student</DialogTitle>
      <DialogContent>
        {errors.api && <Typography color="error">{errors.api}</Typography>}
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Phone Number"
          fullWidth
          margin="normal"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} />}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudent;
