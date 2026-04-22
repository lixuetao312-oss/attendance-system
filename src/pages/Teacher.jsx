import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "../services/supabase";

export default function Teacher() {
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState(null);
  const [qrToken, setQrToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  //  mock / real 切换
  const BASE_URL = "mock"; // "mock" / "https://xxx"

  //  获取 JWT
  const getJWT = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };

  //  登出
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  //  创建 session
  const createSession = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (BASE_URL === "mock") {
        //  mock 模式
        const fakeId = "mock-session-" + Date.now();
        setSessionId(fakeId);
        setMessage(" Mock session created");
        return;
      }

      const jwt = await getJWT();

      const res = await fetch(`${BASE_URL}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`, 
        },
        body: JSON.stringify({
          name: "Lecture " + new Date().toLocaleString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSessionId(data.sessionId);
      setMessage(" Session created");
    } catch (err) {
      console.error(err);
      setMessage(" Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  //  获取 QR token
  const fetchQrToken = async () => {
    if (!sessionId) return;

    try {
      if (BASE_URL === "mock") {
        //  mock token（模拟10秒刷新）
        const fakeToken = "mock-token-" + Date.now();
        setQrToken(fakeToken);
        return;
      }

      const jwt = await getJWT();

      const res = await fetch(`${BASE_URL}/qr/${sessionId}`, {
        headers: {
          "Authorization": `Bearer ${jwt}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setQrToken(data.token);
      }
    } catch (err) {
      console.error("QR error:", err);
    }
  };

  // 自动刷新二维码（8秒）
  useEffect(() => {
    if (!sessionId) return;

    fetchQrToken();

    const interval = setInterval(fetchQrToken, 8000);

    return () => clearInterval(interval);
  }, [sessionId]);

  //  结束 session
  const endSession = async () => {
    try {
      if (BASE_URL === "mock") {
        setSessionId(null);
        setQrToken("");
        setMessage("Mock session ended");
        return;
      }

      const jwt = await getJWT();

      await fetch(`${BASE_URL}/sessions/${sessionId}/end`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwt}`,
        },
      });

      setSessionId(null);
      setQrToken("");
      setMessage(" Session ended");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "url('/bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
    }}>
      <div style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.2)",
        pointerEvents: "none"
      }} />

      <div style={{ position: "relative", zIndex: 10 }}>

        {/* 顶部 */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 5vw",
          color: "white",
        }}>
          <div
            onClick={() => navigate("/")}
            style={{ fontWeight: "bold", cursor: "pointer" }}
          >
            Attendance
          </div>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* 主体 */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh"
        }}>
          <div style={{
            width: "90%",
            maxWidth: "500px",
            padding: "40px",
            borderRadius: "20px",
            background: "white",
            textAlign: "center"
          }}>

            <h2>Teacher Panel</h2>

            {!sessionId && (
              <button onClick={createSession} disabled={loading}>
                {loading ? "Creating..." : "Start Session"}
              </button>
            )}

            {qrToken && (
              <>
                <QRCodeCanvas value={qrToken} size={220} />

                <p style={{ marginTop: "10px", color: "#666" }}>
                  QR refreshes every 8 seconds
                </p>

                <button onClick={endSession}>
                  End Session
                </button>
              </>
            )}

            {message && (
              <p style={{ marginTop: "10px" }}>{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}