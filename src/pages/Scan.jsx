import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Scan({ user }) {
  const navigate = useNavigate();
  const [result, setResult] = useState("");

  //  登出
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  //  模拟扫码（后面换成真实扫码）
  const handleFakeScan = () => {
    setResult(" Attendance recorded successfully");
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
      {/*  遮罩 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.2)",
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>

        {/*  顶部导航 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 120px",
            color: "white",
            alignItems: "center",
          }}
        >
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

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 18px",
              borderRadius: "20px",
              background: "black",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {/*  主内容 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          {/*  卡片 */}
          <div
            style={{
              width: "520px",
              padding: "50px",
              borderRadius: "24px",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <h2 style={{ marginBottom: "10px", fontSize: "26px" }}>
              Scan QR Code
            </h2>

            {/*  用户信息 */}
            <p style={{ marginBottom: "20px", color: "#555" }}>
              Logged in as: <b>{user?.email}</b>
            </p>

            {/*  扫码区域（占位） */}
            <div
              style={{
                width: "260px",
                height: "260px",
                margin: "0 auto 25px",
                border: "2px dashed #aaa",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#777",
              }}
            >
              Camera Area
            </div>

            {/*  模拟扫描按钮 */}
            <button
              onClick={handleFakeScan}
              style={{
                padding: "14px 30px",
                borderRadius: "20px",
                background: "black",
                color: "white",
                border: "none",
                cursor: "pointer",
                marginBottom: "15px",
              }}
            >
              Simulate Scan
            </button>

            {/*  结果反馈 */}
            {result && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                {result}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}