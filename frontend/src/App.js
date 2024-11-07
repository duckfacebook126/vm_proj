import './App.css';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Routes,Route} from'react-router-dom'
import Signup from './Signup';
import Dashboard from './Dashboard';
function App() { 
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />

      
    </Routes>
    </BrowserRouter>
    
    </>
  );
}

export default App;