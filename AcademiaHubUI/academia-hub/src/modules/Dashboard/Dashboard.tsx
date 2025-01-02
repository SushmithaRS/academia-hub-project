import { useEffect, useState } from 'react';
import {AppBar, Box, Grid, Table, TableCell, TableHead, TableRow, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import Button from '../../components/Button/Button';
import AddStudent from './AddStudent';
import EditStudentPopup from './EditStudent';
import DeleteStudentPopup from './DeleteStudent';
type Student = {
    id?: number;
    username?: string;
    email: string;
    phoneNumber: string;
  };
  
  const Dashboard = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);

  const handleEditOpen = (student:any) => {
    setSelectedStudent(student);
    setEditPopupOpen(true);
  };

  const handleDeleteOpen = (student:any) => {
    setSelectedStudent(student);
    setDeletePopupOpen(true);
  };

  const handleClose = () => {
    setSelectedStudent(null);
    setEditPopupOpen(false);
  };
  const handleEditSave = async (updatedStudent: { id: number; username: string; email: string; phoneNumber: string }) => {
    try {
      // Make the API call to update the student
      const response = await fetch(`http://localhost:8080/api/students/${updatedStudent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStudent),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update student: ${response.statusText}`);
      }
  
      const updatedData = await response.json();
  
      // Update the state with the updated student data
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === updatedData.id ? updatedData : student
        )
      );
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update the student. Please try again.");
    }
  };
  

  const handleDeleteConfirm = async (id: number) => {
    try {
      // Make a DELETE API request to the backend
      await axios.delete(`http://localhost:8080/api/students/${id}`);
      
      // Update the students list after deletion
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("There was an error deleting the student!", error);
    }
  };
    const handleAddStudent = (student: { name: string; email: string; phoneNumber: string }) => {
      setStudents((prev) => [...prev, student]);
    };
    useEffect(() => {
      const fetchStudents = async () => {
        try {
          const response = await axios.get("http://localhost:8080/api/students");
          setStudents(response.data);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      };
  
      fetchStudents();
    }, []);
  
  return (
    <Grid container alignItems={'flex-start'} height={'100vh'} width={'100vw'}>
    <Grid item xs={12}>
    <AppBar position="static" color='info'>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Academia Hub
          </Typography>
        </Toolbar>
      </AppBar>
    </Grid>
    <Grid item xs={12} display={'flex'} height={'50px'} justifyContent={'right'} mr={'40px'} mt={'20px'}>
            <Button text={'Add Student'}onClick={() => setShowPopup(true)} disabled={false} variant='primary' size={'medium'}/>   
    </Grid>
    <Grid item xs={12} height={'100%'} >
      <Table style={{width:'100%', textAlign:'center'}} >
        <TableHead>
          <TableRow >
            <TableCell sx={{textAlign:'center'}}>Name</TableCell>
            <TableCell sx={{textAlign:'center'}}>Email</TableCell>
            <TableCell sx={{textAlign:'center'}}>Phone Number</TableCell>
            <TableCell sx={{textAlign:'center'}}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <tbody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell sx={{textAlign:'center'}}>{student.username}</TableCell>
              <TableCell sx={{textAlign:'center'}} >{student.email}</TableCell>
              <TableCell sx={{textAlign:'center'}}>{student.phoneNumber}</TableCell>
              <TableCell >
                <Box display={'flex'} flexDirection={'row'} gap={'5px'} sx={{justifyContent:'center'}}>
                <Button text={'Edit'} disabled={false} variant='primary' size='small' onClick={() => handleEditOpen(student)}/>
                <Button text={'Delete'} disabled={false} variant='primary' size='small' onClick={() => handleDeleteOpen(student)} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      {showPopup && (
        
        <AddStudent
            onClose={() => setShowPopup(false)}
            onStudentAdded={handleAddStudent} open={showPopup}        />
          )}
          
          {selectedStudent && (
            <>
            <EditStudentPopup
            open={editPopupOpen}
            onClose={handleClose}
            onSave={handleEditSave}
            student={selectedStudent}
          />
          <DeleteStudentPopup
            open={deletePopupOpen}
            onClose={() => setDeletePopupOpen(false)}
            onConfirm={handleDeleteConfirm}
            student={selectedStudent}
          />
          </>
          )}
      
      </Grid>
    
   </Grid>
  );
};

export default Dashboard;
