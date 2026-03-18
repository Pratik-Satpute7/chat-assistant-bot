import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/chat.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId='361932622014-67tv9l9sn9h240dcn36rdstkc473chqk.apps.googleusercontent.com'>
     <App />
  </GoogleOAuthProvider>
   
 
);