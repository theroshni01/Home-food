import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import {React, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login';
import axios from 'axios'

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      axios.get('http://localhost:3001/user', { withCredentials: true })
          .then(response => {
              if (response.data.user) {
                  setIsLoggedIn(true);
              } else {
                  setIsLoggedIn(false);
              }
          })
          .catch(() => setIsLoggedIn(false));
  }, []);

  return (

    <div className="App">

      <BrowserRouter>
              <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path='/login' element={isLoggedIn ? (<Navigate to="/" /> ): (<Login setIsLoggedIn={setIsLoggedIn} /> )} />
              </Routes>
          </BrowserRouter>
      
    </div>
  );
}

export default App;
