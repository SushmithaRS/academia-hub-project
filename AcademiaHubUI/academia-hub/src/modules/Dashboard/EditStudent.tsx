import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

type EditStudentPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (student: { id: number; username: string; email: string; phoneNumber: string }) => void;
  student: { id: number; username: string; email: string; phoneNumber: string } | null;
};

const EditStudentPopup: React.FC<EditStudentPopupProps> = ({
  open,
  onClose,
  onSave,
  student,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });
const {t}=useTranslation();
  // Synchronize state with student prop
  useEffect(() => {
    if (student) {
      setUsername(student.username || "");
      setEmail(student.email || "");
      setPhoneNumber(student.phoneNumber || "");
    }
  }, [student]);

  const validateFields = () => {
    const newErrors: { username: string; email: string; phoneNumber: string } = {
      username: "",
      email: "",
      phoneNumber: "",
    };

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required.";
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone number validation (example regex for a 10-digit number)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number.";
    }

    setErrors(newErrors);

    // Return false if there are errors
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSave = () => {
    if (validateFields()) {
      if (student) {
        onSave({ id: student.id, username, email, phoneNumber });
        onClose();
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("editStudent")}</DialogTitle>
      <DialogContent>
        <TextField
          label={t("name")}
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          label={t("email")}
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label={t("phoneNumber")}
          value={phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button onClick={handleSave} color="primary">
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStudentPopup;
