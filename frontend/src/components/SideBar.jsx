import React from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, CheckSquare, TrendingUp, User, LogOut, Heart } from "lucide-react";
import { useAuthStore } from "./authStore.js";
import Swal from "sweetalert2";

const SideBar = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be securely logged out of your currently working session.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Log out!",
            cancelButtonText: "Stay"
        }).then(async(result) => {
            if (result.isConfirmed) {
                await logout();
                navigate("/");
            }
        });
    };

    const navigationItems = [
        { path: "/dashboard", label: "Teacher's Dashboard", icon: LayoutDashboard },
        { path: "/child-management", label: "Child Management", icon: Users },
        { path: "/attendance", label: "Attendance", icon: CheckSquare },
        { path: "/growth", label: "Growth", icon: TrendingUp },
        { path: "/profile", label: "Profile", icon: User }
    ];

    return (
        <div className="workspace-app-shell">
            <aside className="workspace-sidebar">
                <div className="sidebar-brand-branding">
                    <div className="brand-logo-mock-graphic">
                        <img src="../assets/logo.svg" />
                    </div>
                    <h2>Little Bloom</h2>
                </div>

                <nav className="sidebar-nav-links-stack">
                    {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `sidebar-nav-btn ${isActive ? "active-tab-link" : ""}`}>
                                <IconComponent size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="sidebar-footer-region">
                    <button className="sidebar-logout-action" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Sign out</span>
                    </button>
                </div>
            </aside>

            <main className="workspace-viewport-window">
                <Outlet />
            </main>
        </div>
    );
};

export default SideBar;