import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Grid,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Button as MuiButton,
  TextField,
  IconButton,
} from "@mui/material";
import Button from "../../components/Button/Button";
import AddStudent from "./AddStudent";
import EditStudentPopup from "./EditStudent";
import DeleteStudentPopup from "./DeleteStudent";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import apiClient from "../../ApiClient";
import axios from "axios";
import { Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../../components/LanguageToggle/LanguageToggle";

type Student = {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
};

type DocumentType = {
  filePath: string;
  id: number;
  fileName: string;
  fileType: string;
  size: number;
  url: string;
};

const Dashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0); // State to manage selected tab
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const {t}=useTranslation();

  // Fetch all students
  const fetchStudents = async (name = "", email = "") => {
    try {
      const params = new URLSearchParams();
      if (name) params.append("name", name);
      if (email) params.append("email", email);

      const response = await apiClient.get(
        `/students/search?${params.toString()}`
      );
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Fetch all documents
  const fetchDocuments = async () => {
    if (!selectedStudent) return;
    try {
      const response = await apiClient.get(`/documents/${selectedStudent.id}`);
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    console.log(event);
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    fetchStudents(value);
  };

  // Add a new student
  const handleAddStudent = (student: Student) => {
    setStudents((prev) => [...prev, student]);
    setFilteredStudents((prev) => [...prev, student]); // Ensure filtered list is updated
  };

  // Open edit popup
  const handleEditOpen = (student: Student) => {
    setSelectedStudent(student);
    setEditPopupOpen(true);
  };

  // Open delete popup
  const handleDeleteOpen = (student: Student) => {
    setSelectedStudent(student);
    setDeletePopupOpen(true);
  };

  // Close edit or delete popup
  const handleClose = () => {
    setSelectedStudent(null);
    setEditPopupOpen(false);
    setDeletePopupOpen(false);
  };

  // Save edited student
  const handleEditSave = async (updatedStudent: Student) => {
    try {
      const response = await apiClient.put(
        `/students/${updatedStudent.id}`,
        updatedStudent
      );
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === response.data.id ? response.data : student
        )
      );
      setFilteredStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === response.data.id ? response.data : student
        )
      );
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update the student. Please try again.");
    }
  };

  // Confirm delete student
  const handleDeleteConfirm = async (id: number) => {
    try {
      await apiClient.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setFilteredStudents((prev) => prev.filter((s) => s.id !== id)); // Update filtered list
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete the student. Please try again.");
    }
  };

  // Handle file change for document upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // Upload document
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    // Add studentId (replace with the actual student ID you want to send)
    const studentId = selectedStudent?.id; // Ensure `selectedStudent` is set before upload
    if (!studentId) {
      alert("Please select a student before uploading documents.");
      setUploading(false);
      return;
    }
    formData.append("studentId", String(studentId));

    try {
      await apiClient.post(
        "/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // setDocuments((prev) => [...prev, ...response.data]);
      setSelectedFiles([]);
      alert("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
      fetchDocuments(); // Fetch documents again to update the list
    }
  };
  // Function to handle document deletion
  const handleDeleteDocument = async (documentId: number) => {
    if (!selectedStudent) {
      alert("Please select a student.");
      return;
    }

    try {
      await apiClient.delete(`/documents/${documentId}`);
      setDocuments((prevDocuments) =>
        prevDocuments.filter((doc) => doc.id !== documentId)
      );
      alert("Document deleted successfully!");
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete the document. Please try again.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []); // Empty dependency array ensures students are fetched on mount

  useEffect(() => {
    if (selectedStudent) {
      fetchDocuments();
    }
  }, [selectedStudent, uploading]); // Fetch documents when selected student changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleOpenDocument = async (filePath: string) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
  
      const response = await axios.get(`http://localhost:8080/${filePath.replace(/\\/g, "/")}`, {
        responseType: "blob", 
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });
  
      // Convert the response to a downloadable URL and open it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error opening document:", error);
      alert("Failed to open the document.");
    }
  };
  
  

  return (
    <Grid container height={"100vh"} width={"100vw"}>
      <Grid item xs={12}>
        <AppBar position="static" color="info">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Academia Hub
            </Typography>
            <LanguageToggle />
            <IconButton color="inherit" onClick={() => navigate("/profile")}>
              <AccountCircleIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Grid>

      <Grid
        item
        xs={12}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="20px"
      >
        <TextField
          label={t("search")}
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ width: "300px" }}
        />
        <Button
          text={t("addStudent")}
          onClick={() => setShowPopup(true)}
          disabled={false}
          variant="primary"
          size="medium"
        />
      </Grid>

      <Grid item xs={12} height={"100%"}>
        <Box>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label={t("studentManagement")} />
            <Tab label={t("documentUpload")} />
          </Tabs>

          {selectedTab === 0 && (
            <Box>
              <Table style={{ width: "100%", textAlign: "center" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("name")}</TableCell>
                    <TableCell>{t("email")}</TableCell>
                    <TableCell>{t("phoneNumber")}</TableCell>
                    <TableCell>{t("actions")}</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.username}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.phoneNumber}</TableCell>
                      <TableCell>
                        <Box display="flex" gap="10px" justifyContent="center">
                          <Button
                            text={t("edit")}
                            onClick={() => handleEditOpen(student)}
                            variant="primary"
                            size="small"
                            disabled={false}
                          />
                          <Button
                            text={t("delete")}
                            onClick={() => handleDeleteOpen(student)}
                            variant="primary"
                            size="small"
                            disabled={false}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>

              {showPopup && (
                <AddStudent
                  onClose={() => setShowPopup(false)}
                  onStudentAdded={handleAddStudent}
                  open={showPopup}
                />
              )}

              {selectedStudent && (
                <>
                  <EditStudentPopup
                    key={selectedStudent.id}
                    open={editPopupOpen}
                    onClose={handleClose}
                    onSave={handleEditSave}
                    student={selectedStudent}
                  />
                  <DeleteStudentPopup
                    open={deletePopupOpen}
                    onClose={handleClose}
                    onConfirm={() => handleDeleteConfirm(selectedStudent.id!)}
                    student={selectedStudent}
                  />
                </>
              )}
            </Box>
          )}

          {selectedTab === 1 && (
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                {t("uploadedDocuments")}
              </Typography>

              {/* Dropdown for selecting a student */}
              <TextField
                label=""
                select
                fullWidth
                value={selectedStudent?.id || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const student = students.find(
                    (s) => s.id === Number(e.target.value)
                  );
                  setSelectedStudent(student || null);
                }}
                SelectProps={{
                  native: true,
                }}
                sx={{ mb: 2 }}
              >
                <option value="" disabled>
                  -- {t("selectStudent")}--
                </option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.username || student.email}
                  </option>
                ))}
              </TextField>

              {/* File input for document upload */}
              <input type="file" multiple onChange={handleFileChange} />
              <Box mt={2}>
                <MuiButton
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={uploading || !selectedStudent}
                >
                  {uploading ? t("Uploading") : t("upload")}
                </MuiButton>
              </Box>

              {/* Display uploaded documents */}
              {selectedStudent && (
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                  {t("uploadedDocuments")}
                  </Typography>
                  <Table style={{ width: "100%" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("fileName")}</TableCell>
                        <TableCell>{t("link")}</TableCell>
                        <TableCell>{t("actions")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <tbody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{doc.fileName}</TableCell>
                          <TableCell>
                            <MuiButton
                              variant="outlined"
                              color="primary"
                              onClick={() => handleOpenDocument(doc.filePath)}
                            >
                              {t("open")}
                            </MuiButton>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              <Delete /> 
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
