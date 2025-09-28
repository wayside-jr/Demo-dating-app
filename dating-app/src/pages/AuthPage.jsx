// src/pages/AuthPage.jsx
import React from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function AuthPage({ onLogin }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>
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
          width: "100%",
          minHeight: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.9)",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <h3 style={{ marginTop: 0, textAlign: "center" }}>Sign Up</h3>
          <Signup />
        </div>
      </div>



      {/* 3-column TEXTS below */}
      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: "100px",
        }}
      >
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
          the first is good
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
          the third is good
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
          how good are u
        </div>
      </div>
           {/* 3-column IMAGES */}
      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: "250px",
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundImage: "url('/freddie-addery-UlcD_8t_zek-unsplash.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            flex: 1,
            backgroundImage:
              "url('/dmitry-ganin-Qq_EbjdTkzo-unsplash (1).jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            flex: 1,
            backgroundImage:
              "url('/allef-vinicius-pOrrjxBo6i4-unsplash (1).jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

    </div>
  );
}
