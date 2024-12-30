import React, { useState } from 'react';
import { TextField } from '../../components/TextField/TextField';
import { Grid, Typography } from '@mui/material';
import { LoginContainer } from './Login.Styled';
import Button from '../../components/Button/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
      setFieldErrors((prev) => ({ ...prev, username: '' }));

    } else if (name === 'password') {
      setPassword(value);
      setFieldErrors((prev) => ({ ...prev, password: '' }));

    }
  };

 
  const handleSubmit = () => {
    // Validate fields before submission
    if (!validateFields()) return;

    const userCredentials = {
      username: email,
      password: password,
      // email: email,
    };

    axios
      .post('http://localhost:8080/api/auth/login', userCredentials)
      .then((response) => {
        console.log('Login successful:', response);
        alert('login successful');
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('There was an error!', error);
        alert('Invalid username or password');
      });

  };

  const validateFields = () => {
    const errors: { username: string; password: string } = {
      username: '',
      password: '',
    };

    // Email validation
    if (!email.trim()) errors.username = 'Username is required.';

    // Password validation
    if (!password.trim()) {
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);

    // Return true if no errors exist
    return Object.values(errors).every((error) => error === '');
  };

  return (
    <LoginContainer container >
      <Grid item xs={12}>
        <Typography>LOGIN</Typography>
      </Grid>
      <Grid item xs={12}>
      <TextField
        id="email"
        name="email"
        label="Username"
        type="text"
        required
        value={email}
        handleChange={handleChange}
        placeholder="Enter your username"
        style={{width:'500px',justifyContent:'center'}}
        error={!!fieldErrors.username} 
        errorMsg={fieldErrors.username}
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
        style={{width:'500px',justifyContent:'center'}}
        error={!!fieldErrors.password} 
        errorMsg={fieldErrors.password}
      />
      </Grid>
      <Grid item xs={12}>
      <Button type="submit" onClick={handleSubmit} variant='primary' text='Login' disabled={false} />
      </Grid>
    </LoginContainer>
  );
};

export default Login;
