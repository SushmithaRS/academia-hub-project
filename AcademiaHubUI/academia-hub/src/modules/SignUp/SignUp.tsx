import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  Link,
  styled,
  Box,
  Button,
} from '@mui/material';
import { TextField } from '../../components/TextField/TextField';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const StyledLink = styled(Link)`
  color: #1976d2;
  text-align: center;
  display: block;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

const SignUpPage: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));

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
    const errors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      role: '',
    };

    if (!username.trim()) errors.username = t('errors.usernameRequired');
    if (!email.trim()) {
      errors.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t('errors.invalidEmail');
    }
    if (!password) {
      errors.password = t('errors.passwordRequired');
    } else if (password.length < 6) {
      errors.password = t('errors.passwordShort');
    }
    if (!confirmPassword) {
      errors.confirmPassword = t('errors.confirmPasswordRequired');
    } else if (password !== confirmPassword) {
      errors.confirmPassword = t('errors.passwordMismatch');
    }
    if (!phoneNumber) {
      errors.phoneNumber = t('errors.phoneNumberRequired');
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      errors.phoneNumber = t('errors.invalidPhoneNumber');
    }

    setFieldErrors(errors);
    return Object.values(errors).every((error) => error === '');
  };

  const handleSubmit = () => {
    if (!validateFields()) return;

    const userCredentials = {
      username,
      email,
      phoneNumber,
      password,
      role,
    };

    axios
      .post('http://localhost:8080/api/auth/signup', userCredentials)
      .then(() => {
        alert(t('success.registration'));
        navigate('/login');
      })
      .catch(() => {
        setError(t('errors.registrationFailed'));
      });
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '90vh',
        minWidth: '100vw',
        backgroundColor: '#f0f4fc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card sx={{
        width: 500,
        boxShadow: 3,
        borderRadius: 4,
        backgroundColor: '#ffffff',
      }}>
        <CardContent>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            {t('signup.title')}
          </Typography>
          <TextField
            id="username"
            name="username"
            label={t('signup.username')}
            type="text"
            required
            value={username}
            handleChange={handleChange}
            placeholder={t('signup.usernamePlaceholder')}
            error={!!fieldErrors.username}
            errorMsg={fieldErrors.username}
          />
          <TextField
            id="email"
            name="email"
            label={t('signup.email')}
            type="email"
            required
            value={email}
            handleChange={handleChange}
            placeholder={t('signup.emailPlaceholder')}
            error={!!fieldErrors.email}
            errorMsg={fieldErrors.email}
          />
          <TextField
            id="phoneNumber"
            name="phoneNumber"
            label={t('signup.phoneNumber')}
            type="number"
            required
            value={phoneNumber}
            handleChange={handleChange}
            placeholder={t('signup.phoneNumberPlaceholder')}
            error={!!fieldErrors.phoneNumber}
            errorMsg={fieldErrors.phoneNumber}
          />
          <TextField
            id="password"
            name="password"
            label={t('signup.password')}
            type="password"
            required
            value={password}
            handleChange={handleChange}
            placeholder={t('signup.passwordPlaceholder')}
            error={!!fieldErrors.password}
            errorMsg={fieldErrors.password}
          />
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            label={t('signup.confirmPassword')}
            type="password"
            required
            value={confirmPassword}
            handleChange={handleChange}
            placeholder={t('signup.confirmPasswordPlaceholder')}
            error={!!fieldErrors.confirmPassword}
            errorMsg={fieldErrors.confirmPassword}
          />
          <RadioGroup onChange={handleChange} name="role" sx={{ marginTop: 2 }}>
            <Typography>{t('signup.role')}</Typography>
            <FormControlLabel value="admin" control={<Radio />} label={t('signup.admin')} />
            <FormControlLabel value="student" control={<Radio />} label={t('signup.student')} />
          </RadioGroup>
          <Button type="submit"
            variant="contained"
            color="primary"
            fullWidth onClick={handleSubmit} sx={{
              py: 1.5,
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: 2,
              mb: 2,
            }} >
              {t('signup.submit')}
          </Button>
          <StyledLink onClick={handleLogin}>{t('signup.loginLink')}</StyledLink>
          {error && (
            <Typography color="error" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignUpPage;
