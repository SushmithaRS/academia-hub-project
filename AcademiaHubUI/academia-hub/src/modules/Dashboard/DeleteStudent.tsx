import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

type DeleteStudentPopupProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  student: { id: number; name: string; email: string; phoneNumber: string };
};

const DeleteStudentPopup: React.FC<DeleteStudentPopupProps> = ({
  open,
  onClose,
  onConfirm,
  student,
}) => {
  const handleConfirm = () => {
    onConfirm(student.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Student</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this student?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteStudentPopup;
