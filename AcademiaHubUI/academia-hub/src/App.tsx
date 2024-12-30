import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './modules/Login/Login'; 
import SignUp from './modules/SignUp/SignUp';
import Dashboard from './modules/Dashboard/Dashboard'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
