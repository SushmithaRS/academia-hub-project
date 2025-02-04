import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './modules/Login/Login';
import SignUp from './modules/SignUp/SignUp';
import Dashboard from './modules/Dashboard/Dashboard';
import StudentProfile from './modules/Profile/StudentProfile';
import AdminProfile from './modules/Profile/AdminProfile';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<AdminProfile />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['student']} />}>
          <Route path="/student-profile" element={<StudentProfile />} />
        </Route>


        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
