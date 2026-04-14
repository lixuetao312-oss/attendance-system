import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./services/supabase";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Scan from "./pages/Scan";
import Teacher from "./pages/Teacher";


function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* 首页 */}
        <Route path="/" element={<Home />} />

        {/* 登录 */}
        <Route path="/login" element={<Login />} />

        {/* 教师 */}
        <Route path="/teacher" element={<Teacher />} />

        {/* 扫码（受保护） */}
        <Route
          path="/scan"
          element={
            <ProtectedRoute user={user}>
              <Scan user={user} />
            </ProtectedRoute>
          }
        />

        {/* 默认跳首页 */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}