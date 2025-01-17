import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import { useEffect, useRef } from 'react';

const Navbar = ({currentpage, redirectToLogin }) => {

  const isSignupPage = currentpage === 'signup';
  const isLoginPage = currentpage === 'login';
  const [userEmail, setUserEmail] = useState(null);

useEffect(() => {
  function callback2(data) {
    if (data.username) {
      setUserEmail(data.username);
    }
  }

  function callback1(res) {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  }

  console.log("token - " + localStorage.getItem("token"));
  fetch("http://localhost:3000/admin/me", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then(callback1)
    .then(callback2)
    .catch((error) => {
      // Handle the error here, e.g., show an error message or redirect to login.
      console.error("Error fetching user data:", error);
    });
}, []);

function handleLogout() {
  // Clear the token from localStorage
  localStorage.removeItem("token");
  // Set userEmail to null to trigger the conditional rendering in the Navbar
  setUserEmail(null);
}

    if(userEmail){
  return (
    <div className="w-full h-16 shadow-xl nav flex justify-between items-center bg-powderwala fixed z-10">
      <Link to ="/">
      <img
        src="https://media.licdn.com/dms/image/D4D03AQHKcFjsa4jbUQ/profile-displayphoto-shrink_800_800/0/1684321183885?e=2147483647&v=beta&t=RmnAamuVXaA9SzBOeI9DASoNGvWNwc7gdz4CLe-hiT4"
        alt="Profile Picture"
        className="w-16 rounded-full shadow-xl m-4" 
      />  
      </Link>
      <h1 className="text-2xl rounded font-headerWala bg-white px-2 py-1 ml-24 ">#100xdevs</h1>
      
      {!isSignupPage && !isLoginPage && (
        <div className="w-80 flex justify-around">
        <h1 className=" text-md px-3 h-6 rounded font-headerWala mt-2  ">{userEmail}</h1>

          <button className="w-36 h-10 ring-2 ring-blue-100 hover:ring-blue-300 rounded-md bg-blue-500 hover:bg-slate-100 text-white hover:text-cyan-800 font-semibold" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      )}
    </div>
    
  )
}else{
  return(
        <div className="w-full h-16 shadow-xl nav flex justify-between items-center bg-powderwala fixed z-10">
      <Link to ="/">
      <img
        src="https://media.licdn.com/dms/image/D4D03AQHKcFjsa4jbUQ/profile-displayphoto-shrink_800_800/0/1684321183885?e=2147483647&v=beta&t=RmnAamuVXaA9SzBOeI9DASoNGvWNwc7gdz4CLe-hiT4"
        alt="Profile Picture"
        className="w-16 rounded-full shadow-xl m-4" 
      />  
      </Link>
      <h1 className="text-2xl rounded font-headerWala bg-white px-2 py-1 ml-24 ">#100xdevs</h1>
      {!isSignupPage && !isLoginPage && (
        <div className="w-52  flex justify-around">
          <button className="w-36 h-10 ring-2 ring-blue-100 hover:ring-blue-300 rounded-md bg-blue-500 hover:bg-slate-100 text-white hover:text-cyan-800 font-semibold" onClick={redirectToLogin}>
            LOGIN
          </button>
        </div>
      )}
    </div>
  );
}
};

export default Navbar;