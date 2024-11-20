import './App.css';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Routes,Route} from'react-router-dom'
import Signup from './Signup';
import Dashboard2 from './Dashboard2';
import Home from './Home';
import LoadingSpinner from './components/Loading';
function App() { 
  return (
    <BrowserRouter>
    
      <Routes>
       
        <Route path="/" element={ <LoadingSpinner><Home /></LoadingSpinner>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard2 />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;