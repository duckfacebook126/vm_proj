import './App.css';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Routes,Route} from'react-router-dom'
import Signup from './Signup';
import Dashboard from './Dashboard';
import Home from './Home';
import LoadingSpinner from './components/Loading';
import { AuthProvider } from './contexts/AuthContext';

function App() { 
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <LoadingSpinner><Home /></LoadingSpinner>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;