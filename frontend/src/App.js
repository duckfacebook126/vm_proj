import './App.css';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Home from './Home';
import LoadingSpinner from './components/Loading';
import { DataProvider } from './contexts/DashboardContext';
import AdminSignup from './AdminSignup';
import AdminLogin from './AdminLogin';
import Sidebar from './Sidebar';
import Dashboard3 from './Dashboard3';

import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';
function App() {
    return (
        <AuthProvider>
            <UserProvider>
                <DataProvider>
                    <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LoadingSpinner><Home /></LoadingSpinner>} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard3/>} />
                        <Route path="/admin_signup" element={<AdminSignup />} />
                        <Route path="/admin_login" element={<AdminLogin />} />
                        <Route path="/admin_dashboard" element={<Sidebar />} />

                    </Routes>
                </BrowserRouter>
            
            </DataProvider>
        </UserProvider>
        </AuthProvider>
    );
}

export default App;
