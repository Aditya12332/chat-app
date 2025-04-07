import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome, {user.displayName} 👋</h1>
      <img
        src={user.photoURL}
        alt="Profile"
        style={{ borderRadius: "50%", width: "100px", margin: "1rem auto" }}
      />
      <p>Email: {user.email}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
