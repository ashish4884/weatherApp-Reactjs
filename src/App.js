import React, { useState } from "react";
import CurrentLocation from "./currentLocation";
import "./App.css";

function App() {
  return (
    <React.Fragment>
      <div className="container">
        <CurrentLocation />
      </div>
      <div className="footer-info">
      <a target="_blank" href="https://www.gauravghai.dev/">
        Developed by {" "}
        </a> {" "}
        <a target="_blank" href="https://www.gauravghai.dev/">
        {" "}  Ashish Rajput 
        </a>
       
      </div>
    </React.Fragment>
  );
}

export default App;
