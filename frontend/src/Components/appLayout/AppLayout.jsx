import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
import { AuthProvider } from "../Context/AuthContext";
import ProtectedRoute from "../ProtectedRoute";
import MinOfMeeting from "../../Pages/MinOfMeeting/MinOfMeeting";

function AppLayout() {
  return (
    <AuthProvider>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MinOfMeeting />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default AppLayout;
