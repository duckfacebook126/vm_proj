import './App.css';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import { DataProvider } from './contexts/DashboardContext';
import { AdminDataProvider } from './contexts/AdminDashboardContext';
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
                        <AdminDataProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<Login />}/>
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/dashboard" element={<Dashboard3/>} />
                                <Route path="/admin_signup" element={<AdminSignup />} />
                                <Route path="/admin_login" element={<AdminLogin />} />
                                <Route path="/admin_dashboard" element={<Sidebar />} />
                            </Routes>
                            </BrowserRouter>
                        </AdminDataProvider>
                    </DataProvider>
                </UserProvider>
            </AuthProvider>
       
    );
}

export default App;


/**
 * @summary This is the main application component which renders all the pages according to the route.
 * @description The App component is the top level component of the application and it contains all the routes.
 * The routes are defined using the react-router-dom library.
 * The App component is wrapped with the UserProvider and DataProvider contexts
 * which provide the user and data state to the components.
 * The App component is also wrapped with the AuthProvider and AdminDataProvider contexts
 * which provide the authentication and admin data state to the components.
 * @workflow
 * 1. The App component renders the routes.
 * 2. The routes render the corresponding components.
 * 3. The components retrieve the data from the DataProvider context.
 * 4. The components render the data.
 * 5. The user interacts with the components.
 * 6. The components update the state of the DataProvider context.
 * 7. The DataProvider context updates the state of the App component.
 * 8. The App component re-renders the routes.
 * 9. The routes re-render the corresponding components.
 * 10. The components re-render the data.
 */
