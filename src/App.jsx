import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./services/supabase";
import { useNavigate } from "react-router-dom";

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
  const [error, setError] = useState(""); 

  useEffect(() => {
    // 初始化 session
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;

      if (user) {
        const domain = user.email.split("@")[1];

        if (!domain.endsWith("elte.hu")) {
          setError("Only ELTE email accounts are allowed");
          await supabase.auth.signOut();
          setUser(null);
        } else {
          setUser(user);
          setError("");
        }
      } else {
        setUser(null);
      }
    });

    // 监听登录状态
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        const user = session?.user;

        if (user) {
          const domain = user.email.split("@")[1];

          if (!domain.endsWith("elte.hu")) {
            setError("Only ELTE email accounts are allowed");
            await supabase.auth.signOut();
            setUser(null);
            return;
          }

          setUser(user);
          setError("");
        } else {
          setUser(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 登录成功跳转
  useEffect(() => {
    if (user) {
      window.location.href = "/scan";
    }
  }, [user]);

  return (
    <BrowserRouter>

      {/* 全局错误提示 */}
      {error && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 80, 80, 0.95)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "12px",
            zIndex: 9999,
            fontSize: "14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}
        >
          {error}
        </div>
      )}

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