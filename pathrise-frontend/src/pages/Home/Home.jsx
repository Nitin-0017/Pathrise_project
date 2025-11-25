// // src/pages/Home/Home.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Bell, Search } from "lucide-react";
// import Sidebar from "../../components/Sidebar";
// import "./Home.css";

// export default function Home() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (!token || !storedUser) {
//       navigate("/login");
//       return;
//     }

//     try {
//       setUser(JSON.parse(storedUser));
//     } catch (error) {
//       console.error("Invalid user data", error);
//       localStorage.removeItem("user");
//       navigate("/login");
//     }
//   }, [navigate]);

//   const logout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const handleNavigate = (page) => {
//     // Sidebar navigation logic
//     if (page === "dashboard") navigate("/home");
//     else if (page === "applications") navigate("/candidate/applications");
//     else if (page === "jobs") navigate("/candidate/jobs");
//     else if (page === "messages") navigate("/candidate/messages");
//     else if (page === "settings") navigate("/candidate/settings");
//   };

//   if (!user) return <div className="loading-screen">Loading...</div>;

//   return (
//     <div className="layout">
//       <Sidebar user={user} onLogout={logout} activePage="dashboard" onNavigate={handleNavigate} />

//       <main className="main">
//         <header className="navbar">
//           <div className="search">
//             <Search size={18} />
//             <input type="text" placeholder="Search..." />
//           </div>
//           <button className="icon-btn">
//             <Bell size={20} />
//           </button>
//         </header>

//         <div className="heading">
//           <h1>Welcome back, {user.name.split(" ")[0]}</h1>
//           <p>Your job search insights & performance</p>
//         </div>

//         <div className="cards">
//           <div className="card">
//             <h2>Total Applications</h2>
//             <p className="count">24</p>
//           </div>
//           <div className="card">
//             <h2>Messages</h2>
//             <p className="count">8</p>
//           </div>
//           <div className="card">
//             <h2>Profile Score</h2>
//             <p className="count">87%</p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CandidateDashboard from "../Candidate/Dashboard";
import EmployerDashboard from "../Employer/Dashboard";
import AdminDashboard from "../Admin/Dashboard";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  if (user.role === "Candidate") return <CandidateDashboard user={user} />;
  if (user.role === "Employer") return <EmployerDashboard user={user} />;
  if (user.role === "Admin") return <AdminDashboard user={user} />;

  return <div>Role not recognized</div>;
}
