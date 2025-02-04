import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '../../components/TextField/TextField';
import { AppBar, Box, Button, Card, CardContent, CssBaseline, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';

const Login: React.FC = () => {
  const { t} = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });

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
    if (!validateFields()) return;

    const userCredentials = { username: email, password };

    axios
      .post('http://localhost:8080/api/auth/login', userCredentials)
      .then((response) => {
        localStorage.setItem('username', userCredentials.username);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);

        alert(t('login_success')); // Use translation key

        if (response.data.role === 'admin') navigate('/dashboard');
        else if (response.data.role === 'student') navigate('/student-profile');
      })
      .catch(() => {
        alert(t('invalid_credentials'));
      });
  };

  const validateFields = () => {
    const errors: { username: string; password: string } = { username: '', password: '' };

    if (!email.trim()) errors.username = t('enter_username');
    if (!password.trim()) errors.password = t('enter_password');

    setFieldErrors(errors);
    return Object.values(errors).every((error) => error === '');
  };

  return (
    <>
    <CssBaseline />
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Academia Hub</h2>
        <LanguageToggle />
      </Toolbar>
    </AppBar>
    <Box sx={{ minHeight: '90vh', minWidth: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4fc' }}>
      <Card sx={{ width: 500, boxShadow: 3, borderRadius: 4, backgroundColor: '#ffffff' }}>
        <CardContent>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            {t('login')}
          </Typography>
          <TextField
            id="email"
            name="email"
            label={t('username')}
            type="text"
            required
            value={email}
            handleChange={handleChange}
            placeholder={t('enter_username')}
            error={!!fieldErrors.username}
            errorMsg={fieldErrors.username}
          />
          <TextField
            id="password"
            name="password"
            label={t('password')}
            type="password"
            required
            value={password}
            handleChange={handleChange}
            placeholder={t('enter_password')}
            error={!!fieldErrors.password}
            errorMsg={fieldErrors.password}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            sx={{ py: 1.5, textTransform: 'none', fontWeight: 'bold', borderRadius: 2, mb: 2 }}
          >
            {t('login')}
          </Button>
        </CardContent>
      </Card>
    </Box>
    </>
  );
};

export default Login;
