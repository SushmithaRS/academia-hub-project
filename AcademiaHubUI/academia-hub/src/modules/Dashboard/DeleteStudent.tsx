import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

type DeleteStudentPopupProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  student: { id: number; username: string; email: string; phoneNumber: string };
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
const {t}=useTranslation();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("deleteStudent")}</DialogTitle>
      <DialogContent>
        {t("confirmDeleteStudent")}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button onClick={handleConfirm} color="error">
          {t("delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteStudentPopup;
