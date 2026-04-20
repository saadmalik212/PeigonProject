import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Admin from "./Admin";
import User from "./User";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/user/24-April" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<Navigate to="/user/24-April" replace />} />
        <Route path="/user/:dateSlug" element={<User />} />
        <Route path="/admin" element={<Navigate to="/admin/24-April" replace />} />
        <Route
          path="/admin/:dateSlug"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}