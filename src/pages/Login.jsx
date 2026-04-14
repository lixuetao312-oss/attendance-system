import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate("/scan");
    }
  };

  const handleRegister = async () => {
    setErrorMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setErrorMsg("Registered! Please login.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* 轻遮罩 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.2)",
        }}
      />
      {/*  顶部导航 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          padding: "20px 120px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          zIndex: 20,
        }}
      >
        {/* 左侧标题 */}
        <div
          onClick={() => navigate("/")}
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
            Attendance
        </div>
      </div>

      {/* 登录卡片 */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            width: "360px",
            padding: "40px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          }}
        >
          {/* 标题 */}
          <h2
            style={{
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            Welcome Back
          </h2>

          {/* 输入框 */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          />

          {/* 错误提示 */}
          {errorMsg && (
            <p style={{ color: "red", marginBottom: "10px" }}>
              {errorMsg}
            </p>
          )}

          {/* 登录按钮 */}
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              background: "black",
              color: "white",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            Log In
          </button>

          {/* 注册按钮 */}
          <button
            onClick={handleRegister}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              background: "#eee",
              color: "black",
              border: "none",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}