import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Teacher() {
  const [qrData, setQrData] = useState("");
  const navigate = useNavigate();

  //  生成二维码
  const generateQR = () => {
    const token = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now();
    setQrData(`${token}-${timestamp}`);
  };

  //  自动刷新
  useEffect(() => {
    generateQR();
    const interval = setInterval(generateQR, 10000);
    return () => clearInterval(interval);
  }, []);

  //  登出
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  //  导出（占位）
  const handleExport = () => {
    alert("Exporting attendance data...");
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
          <div style={{ fontSize: "22px", fontWeight: "bold" }}>
            Teacher Panel
          </div>

          <div>
            <button
              onClick={handleExport}
              style={{
                marginRight: "10px",
                padding: "10px 18px",
                borderRadius: "20px",
                background: "white",
                color: "black",
                border: "none",
                cursor: "pointer",
              }}
            >
              Export
            </button>

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
        </div>

        {/*  中间内容 */}
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
            <h2 style={{ marginBottom: "30px", fontSize: "26px" }}>
              Live QR Code
            </h2>

            {/*  居中布局 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* QR */}
              {qrData && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${qrData}`}
                  alt="QR Code"
                  style={{ marginBottom: "25px" }}
                />
              )}

              {/* 按钮 */}
              <button
                onClick={generateQR}
                style={{
                  padding: "14px 30px",
                  borderRadius: "20px",
                  background: "black",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Refresh QR
              </button>
            </div>

            <p style={{ marginTop: "15px", fontSize: "13px", color: "#555" }}>
              Auto refresh every 10 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}