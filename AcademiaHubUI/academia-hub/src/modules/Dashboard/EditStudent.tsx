import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

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
    const [username, setusername] = useState(student?.username || "");
    const [email, setEmail] = useState(student?.email || "");
    const [phoneNumber, setPhoneNumber] = useState(student?.phoneNumber || "");
  
    const handleSave = () => {
      if (student) {
        onSave({ id: student.id, username, email, phoneNumber });
        onClose();
      }
    };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Student</DialogTitle>
      <DialogContent>
        <TextField
          label="username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStudentPopup;
