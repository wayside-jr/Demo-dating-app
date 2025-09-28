// src/pages/AuthPage.jsx
import React from "react";
import Login from "./Login";
import Signup from "./Signup";
// react-icons
import { FaYoutube, FaTiktok, FaTwitter, FaGooglePlay } from "react-icons/fa";

export default function AuthPage({ onLogin }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9", display: "flex", flexDirection: "column" , }}>
      {/* Top bar */}

      
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "5px 46px",
          backgroundColor: "#fff",
          borderBottom: "1px solid #eee",
        }}
      > 
        <div style={{ height: "1px" ,}}>
          <h5 style={{ fontSize: "10px" , marginBottom: "15px"   }}>HeartLink</h5>
          </div>
        <div
          style={{
            background: "#fff",
            padding: "10px 15px",
            borderRadius: "8px",
            marginLeft: "560px",
            marginRight: "400px"
          }}
        >
          <Login onLogin={onLogin} />
        </div>
      </div>

      {/* Section with background photo */}
      <div
        style={{
          backgroundImage: "url('/sajad-nazeran-g3Wi7ud9IZA-unsplash.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "90%",
          minHeight: "650px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Left: Hero Text */}
<div
  style={{
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    minWidth: "400px",
    marginLeft:"100px" // ensure enough width
  }}
>
  <h1
    style={{
      fontSize: "80px",
      margin: 0,
      lineHeight: "1.2",
      whiteSpace: "normal",
      marginBottom: "500px",
      color: "#7a3b3bff"
    }}
  >
    Get Who<br />Gets You
  </h1>
</div>


        {/* Signup form container */}
        <div
          style={{
            
            padding: "90px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            width: "100%",
            marginRight: "500px",
            marginTop: "200px"
          }}
        >
          <h3 style={{ marginTop: 0, textAlign: "center" }}>Sign Up</h3>
          <Signup />
        </div>
      </div>

      {/* 3-column TEXTS below */}
      <div style={{ display: "flex", width: "90%", minHeight: "250px" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.2rem",
            fontWeight: "bold",
            background: "#f0ededff",
            
          }}
        >
          The 1# Trusted Dating App
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.2rem",
            fontWeight: "bold",
            background: "#d47878ff",
          }}
        >
          Get a Date Within 10Minutes
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.2rem",
            fontWeight: "bold",
            background: "#774040ff",
          }}
        >
          Match and Find Love
        </div>
      </div>
      <div style={{ textAlign: "center" , minHeight: "120px" , justifyContent: "center"}}>
        <h1 style={{ fontSize:"24px" , justifyContent: "center" ,color:"red", marginTop:"50px"}}>Our App Helps You Find True Love In The World Where Love Died</h1>
      </div>

      {/* 3-column IMAGES */}
      <div style={{ display: "flex", width: "80%", minHeight: "350px", padding: "10px" }}>
        <div
          style={{
            flex: 1,
            backgroundImage: "url('/freddie-addery-UlcD_8t_zek-unsplash.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "70px"
          }}
        />
        <div
          style={{
            flex: 1,
            backgroundImage: "url('/dmitry-ganin-Qq_EbjdTkzo-unsplash (1).jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "70px",
            marginLeft: "150px"
            
          }}
        />
        <div
          style={{
            flex: 1,
            backgroundImage: "url('/allef-vinicius-pOrrjxBo6i4-unsplash (1).jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "70px",
            marginLeft: "150px"
          }}
        />
      </div>

      {/* captions under each photo */}
      <div style={{ display: "flex", width: "79%" , minHeight: "100px" }}>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "10px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            marginTop: "30px"
          }}
        >
          Millions Have Find Love
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "10px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            marginTop: "30px"
          }}
        >
          Find Who Truly Gets You
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "10px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            marginTop: "30px"
          }}
        >
          Love That Lasts Forever
        </div>
      </div>

      {/* Footer with icons */}
      <footer
        style={{
          backgroundColor: "#b47070ff",
          color: "#fff",
          padding: "70px 0",
          marginTop: "auto",
          width: "90%"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <FaYoutube size={24} />
          <FaTiktok size={24} />
          <FaTwitter size={24} />
          <FaGooglePlay size={24} />
        </div>
        <p style={{ textAlign: "center", fontSize: "0.9rem", marginTop: "5px" }}>
          © 2025 My App
        </p>
      </footer>
    </div>
  );
}
