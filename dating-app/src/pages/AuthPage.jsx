// src/pages/AuthPage.jsx
import React from "react";
import Login from "./Login";
import Signup from "./Signup";
// react-icons
import { FaYoutube, FaTiktok, FaTwitter, FaGooglePlay } from "react-icons/fa";

export default function AuthPage({ onLogin }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9", display: "flex", flexDirection: "column" }}>
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
            marginLeft: "760px",
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
          width: "96%",
          minHeight: "750px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Left: Hero Text */}
        {/* Left: Hero Text */}
      <div
        style={{
          flex: 1,
          color: "#fff",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "60px",
            lineHeight: "1.1",
            margin: 0,
            whiteSpace: "pre-line", // important
          }}
        >
          Get Who{'\n'}Gets You
        </h1>
      </div>



        {/* Signup form container */}
        <div
          style={{
            background: "rgba(255,255,255,0.9)",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            width: "100%",
            marginRight: "800px",
            marginTop: "200px"
          }}
        >
          <h3 style={{ marginTop: 0, textAlign: "center" }}>Sign Up</h3>
          <Signup />
        </div>
      </div>

      {/* 3-column TEXTS below */}
      <div style={{ display: "flex", width: "96%", minHeight: "250px" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.2rem",
            fontWeight: "bold",
            background: "#f2f2f2",
            
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
            background: "#e6e6e6",
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
            background: "#d9d9d9",
          }}
        >
          Match and Find Love
        </div>
      </div>
      <div style={{ textAlign: "center" , minHeight: "120px" , justifyContent: "center"}}>
        <h1 style={{ fontSize:"30px" , justifyContent: "center" ,color:"red", marginTop:"50px"}}>Our App Helps You Find True Love In The World Where Love Died</h1>
      </div>

      {/* 3-column IMAGES */}
      <div style={{ display: "flex", width: "96%", minHeight: "350px" }}>
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
            borderRadius: "70px"
          }}
        />
        <div
          style={{
            flex: 1,
            backgroundImage: "url('/allef-vinicius-pOrrjxBo6i4-unsplash (1).jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "70px"
          }}
        />
      </div>

      {/* captions under each photo */}
      <div style={{ display: "flex", width: "100%" }}>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "10px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            background: "#f2f2f2",
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
            background: "#e6e6e6",
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
            background: "#d9d9d9",
          }}
        >
          Love That Lasts Forever
        </div>
      </div>

      {/* Footer with icons */}
      <footer
        style={{
          backgroundColor: "#333",
          color: "#fff",
          padding: "15px 0",
          marginTop: "auto",
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
