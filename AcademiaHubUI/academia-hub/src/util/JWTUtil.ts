import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  username?: string;
  exp?: number;
}

const token = localStorage.getItem('token');

if (token) {
  const decoded: DecodedToken = jwtDecode(token);

  if (decoded.exp) {
    const expirationDate = new Date(decoded.exp * 1000); 
    console.log('Token expires at:', expirationDate);
  } else {
    console.log('Expiration time not found in token.');
  }
}
