import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import useUserSetup from "../hooks/useUserSetup";
import ChatBox from "../components/ChatBox";
import Navbar from "../components/Navbar";

export default function Home() {
  useUserSetup(); // 🔥 Save user to Firestore if new

  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1>Welcome, {user.displayName} 👋</h1>
          <img
            src={user.photoURL}
            alt="Profile"
            style={{
              borderRadius: "50%",
              width: "100px",
              height: "100px",
              objectFit: "cover",
              margin: "1rem auto",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            }}
          />
          <p>{user.email}</p>
          <button
            onClick={handleLogout}
            style={{
              marginTop: "1rem",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <ChatBox /> {/* 💬 Real-time chat */}
      </div>
    </div>
  );
}
