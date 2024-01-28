 // src/App.js
import React from 'react';
import HomePage from './components/HomePage';
import SanctionDetails from './components/SanctionDetails';
import SanctionHistory from './components/SanctionHistory';
import { BrowserRouter , Routes, Route,} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="sanction-details" element={<SanctionDetails />} />
        <Route path="sanction-History" element={<SanctionHistory />} />
        <Route path="login" element={<Login/>} />
        <Route path="signup" component={<Signup/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
