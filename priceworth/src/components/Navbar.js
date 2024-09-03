import React from 'react'
import './style.css'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn }) 
{
	const navigate = useNavigate();

	const handleLogout = () => {
        axios.post("http://localhost:3001/logout", {}, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    setIsLoggedIn(false);
					alert("Logout Successful")
                    navigate("/");
                }
            })
            .catch(error => {
                console.error("Error logging out:", error);
            });
    };

  return (
   <div className='nav'>
        <header class="header">
		<a href="/" class="logo">Price Worth</a>
		<nav class="navbar">
			<a href="/">home</a>
			<a href="#features">Menu List</a>
			<a href="#products">Our Plans</a>
			<a href="#footer">Contact Us</a>
		</nav>
	
		<div class="icons">
			{!isLoggedIn ? (
				
				<div class="fas fa-user" id="login-btn"
			 		><a href="/login">Login</a>
				</div>
			):(
				<div class="fas fa-user" id="login-btn">
            		<button class="logout" onClick={handleLogout}>Logout</button>
				</div>
				
			)
			}
			
			
		</div>
	</header>
   </div>
  )
}

export default Navbar