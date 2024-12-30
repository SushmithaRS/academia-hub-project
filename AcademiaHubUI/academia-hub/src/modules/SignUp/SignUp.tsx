import React, { useState } from 'react';
import { TextField } from '../../components/TextField/TextField';
import Button from '../../components/Button/Button';
import { FormControlLabel, Grid, Link, Radio, RadioGroup, Typography } from '@mui/material';
import { LoginContainer } from './SignUp.Styled';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpPage: React.FC = () => {
  const [username,setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role,setRole]=useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   if (name === 'email') {
  //     setEmail(value);
  //   } else if (name === 'password') {
  //     setPassword(value);
  //   } else if (name === 'confirmPassword') {
  //     setConfirmPassword(value);
  //   }else if (name === 'username') {
  //     setUsername(value);
  //   }else if (name === 'role') {
  //     setRole(value);
  //   }
  // };

  const handleSubmit = () => {
    if (!validateFields()) {
      return;
    }

    const userCredentials = {
      username,
      password,
      email,
      phoneNumber,
      role,
    };

    axios
      .post('http://localhost:8080/api/auth/signup', userCredentials)
      .then((response) => {
        console.log('Registration successful:', response);
        alert('Registration successful');
        navigate('/login');
      })
      .catch((error) => {
        console.error('There was an error!', error);
        setError('Registration failed. Please try again.');
      });
  };

  const handleLogin=()=>{
    navigate('/login');
  }
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber:'',
    role: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: '' })); // Clear field-specific errors on change

    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      case 'username':
        setUsername(value);
        break;
      case 'role':
        setRole(value);
        break;
      case 'phoneNumber':
        setPhoneNumber(value);
        break;
      default:
        break;
    }
  };
  const validateFields = () => {
    const errors: {
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
      phoneNumber: string;
      role: string;
    } = {
      username: '',
      email: '',
      phoneNumber:'',
      password: '',
      confirmPassword: '',
      role: '',
    };
  
    if (!username.trim()) errors.username = 'Username is required.';
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    if(!phoneNumber) {
      errors.phoneNumber = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      errors.phoneNumber = 'Phone number must be a valid 10-digit number.';
    }
  
    setFieldErrors(errors); // Errors now match the structure of fieldErrors
  
    // Return true if no errors exist
    return Object.values(errors).every((error) => error === '');
  };
  return (
    <LoginContainer container >
      <Grid item xs={12}>
        <Typography>SIGN UP</Typography>
      </Grid>
      <Grid item xs={12}>
      <TextField
        id="username"
        name="username"
        label="Username"
        type="text"
        required
        value={username}
        handleChange={handleChange}
        placeholder="Enter your username"
        style={{width:'500px'}}
        error={!!fieldErrors.username} 
        errorMsg={fieldErrors.username}
      />
      </Grid>
      <Grid item xs={12}>
      <TextField
        id="email"
        name="email"
        label="Email"
        type="email"
        required
        value={email}
        handleChange={handleChange}
        placeholder="Enter your email"
        style={{width:'500px',justifyContent:'center'}}
        error={!!fieldErrors.email} 
        errorMsg={fieldErrors.email}
      />
      </Grid>
      <Grid item xs={12}>
      <TextField
        id="phoneNumber"
        name="phoneNumber"
        label="Phone Number"
        type="number"
        required
        value={phoneNumber}
        handleChange={handleChange}
        placeholder="Enter your phone number"
        style={{width:'500px',justifyContent:'center'}}
        error={!!fieldErrors.phoneNumber} 
        errorMsg={fieldErrors.phoneNumber}
      />
      </Grid>
      <Grid item xs={12}>
      <TextField
        id="password"
        name="password"
        label="Password"
        type="password"
        required
        value={password}
        handleChange={handleChange}
        placeholder="Enter your password"
        style={{width:'500px'}}
        error={!!fieldErrors.password} 
        errorMsg={fieldErrors.password}
      />
      </Grid>
      <Grid item xs={12}>
      <TextField
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        required
        value={confirmPassword}
        handleChange={handleChange}
        placeholder="Confirm your password"
        style={{width:'500px'}}
        error={!!fieldErrors.confirmPassword} 
        errorMsg={fieldErrors.confirmPassword}
      />
      </Grid>
      <Grid item xs={12}>
      <RadioGroup onChange={handleChange} name='role' sx={{display:'flex',flexDirection:'row'}}>
      <Typography mt={'10px'} mr={'10px'}>Role: </Typography>
      <FormControlLabel value='admin' control={<Radio />} label="Admin" />
      <FormControlLabel value='student' control={<Radio />} label="Student" />
      </RadioGroup>
      </Grid>
      <Grid item xs={12} justifyContent={'center'}>
      <Button text={'Sign Up'} variant={'primary'} disabled={false} onClick={handleSubmit}/>
      </Grid>
      <Grid item xs={12} justifyContent={'center'}>
      <Link onClick={handleLogin}>Already an user?</Link>
      </Grid>
      {error && (
        <Grid item xs={12}>
          <Typography color="error">{error}</Typography>
        </Grid>
      )}
    </LoginContainer>
  );
};

export default SignUpPage;
