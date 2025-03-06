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
import apiClient from "../../ApiClient";
import { t } from "i18next";

type AddStudentPopupProps = {
  open: boolean;
  onClose: () => void;
  onStudentAdded: (student: { id: number; username: string; email: string; phoneNumber: string }) => void;
};

const AddStudent: React.FC<AddStudentPopupProps> = ({ open, onClose, onStudentAdded }) => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false); // Loading state for API call

  // Validation function
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate name
    if (!username.trim()) newErrors.name = "Name is required.";

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    // Validate phone number
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSave = async () => {
    if (validate()) {
      setLoading(true); // Start loading
      try {
        const response = await apiClient.post("http://localhost:8080/api/students", {
          username,
          email,
          phoneNumber,
        });
        onStudentAdded(response.data); // Notify parent component
        onClose(); // Close popup
        setName(""); // Reset form
        setEmail("");
        setPhoneNumber("");
      } catch (error: any) {
        // Handle API error
        const errorMessage = error.response?.data?.message || "Failed to add student.";
        setErrors({ api: errorMessage });
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("addStudent")}</DialogTitle>
      <DialogContent>
        {errors.api && <Typography color="error">{errors.api}</Typography>}
        <TextField
          label={t("name")}
          fullWidth
          margin="normal"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label={t("email")}
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label={t("phoneNumber")}
          fullWidth
          margin="normal"
          value={phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          {t("cancel")}
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudent;
