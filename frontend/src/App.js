import './App.css';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Routes,Route} from'react-router-dom'
import Signup from './Signup';
import Dashboard from './Dashboard';
import Home from './Home';
import LoadingWrapper from './components/LoadingWrapper';

function App() { 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoadingWrapper><Home /></LoadingWrapper>} />
        <Route path="/signup" element={<LoadingWrapper><Signup /></LoadingWrapper>} />
        <Route path="/login" element={<LoadingWrapper><Login /></LoadingWrapper>} />
        <Route path="/dashboard" element={<LoadingWrapper><Dashboard /></LoadingWrapper>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;