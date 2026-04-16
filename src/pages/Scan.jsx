import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { Html5Qrcode } from "html5-qrcode";

export default function Scan({ user }) {
  const navigate = useNavigate();
  const [result, setResult] = useState("");

  //  登出
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  //  启动扫码
  useEffect(() => {
    const qr = new Html5Qrcode("reader");

    qr.start(
      { facingMode: "environment" }, // 后置摄像头
      {
        fps: 10,
        qrbox: 250,
      },
      (decodedText) => {
        console.log("Scanned:", decodedText);

        setResult("✅ Scanned: " + decodedText);

        qr.stop(); // 扫描成功后停止
      },
      () => {}
    );

    return () => {
      qr.stop().catch(() => {});
    };
  }, []);

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
      {/* 遮罩（修复点击问题） */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.2)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>

        {/* 顶部导航 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "clamp(20px, 4vw, 40px) 5vw",
            color: "white",
            alignItems: "center",
          }}
        >
          <div
            onClick={() => navigate("/")}
            style={{
              fontSize: "clamp(18px, 4vw, 22px)",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Attendance
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "clamp(10px, 2.5vw, 16px) clamp(20px, 6vw, 40px)",
              fontSize: "clamp(14px, 3vw, 18px)",
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

        {/* 主内容 */}
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
              width: "90%",
              maxWidth: "520px",
              padding: "clamp(20px, 5vw, 50px)",
              borderRadius: "24px",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <h2
              style={{
                marginBottom: "10px",
                fontSize: "clamp(20px, 4vw, 26px)",
              }}
            >
              Scan QR Code
            </h2>

            {/*  用户信息 */}
            <p
              style={{
                marginBottom: "20px",
                color: "#555",
                fontSize: "clamp(14px, 2.5vw, 18px)",
              }}
            >
              Logged in as: <b>{user?.email}</b>
            </p>

            {/*  扫码区域 */}
            <div
              id="reader"
              style={{
                width: "100%",
                maxWidth: "260px",
                margin: "0 auto 25px",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            />

            {/*  结果反馈 */}
            {result && (
              <p
                style={{
                  color: "green",
                  fontWeight: "bold",
                  fontSize: "clamp(14px, 3vw, 18px)",
                }}
              >
                {result}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}