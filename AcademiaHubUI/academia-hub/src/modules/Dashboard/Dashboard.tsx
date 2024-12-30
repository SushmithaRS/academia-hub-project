import { useEffect, useState } from 'react';
import {AppBar, Box, Grid, Table, TableCell, TableHead, TableRow, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import Button from '../../components/Button/Button';
import AddStudent from './AddStudent';
type Student = {
    id?: number;
    username?: string;
    email: string;
    phoneNumber: string;
  };
  
  const Dashboard = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [showPopup, setShowPopup] = useState(false);
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
                <Button text={'Edit'} disabled={false} variant='primary' size='small'/>
                <Button text={'Delete'} disabled={false} variant='primary' size='small' />
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
      </Grid>
    
   </Grid>
  );
};

export default Dashboard;
