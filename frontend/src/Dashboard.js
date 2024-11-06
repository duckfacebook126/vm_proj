// File: Dashboard.js
import React from 'react';
import './Dashboard.css'; // Add custom CSS here for styling

function Dashboard() {
    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2 className="logo">MyApp</h2>
                <nav className="nav-links">
                    <a href="#overview" className="nav-item">Overview</a>
                    <a href="#analytics" className="nav-item">Analytics</a>
                    <a href="#sales" className="nav-item">Sales</a>
                    <a href="#reports" className="nav-item">Reports</a>
                    <a href="#settings" className="nav-item">Settings</a>
                </nav>
            </aside>

            {/* Main content area */}
            <main className="main-content">
                {/* Header */}
                <header className="header">
                    <h1>Dashboard</h1>
                    <div className="header-profile">
                        <span>Welcome, User</span>
                        <button className="btn-logout">Logout</button>
                    </div>
                </header>

                {/* Dashboard Cards */}
                <section className="dashboard-cards">
                    <div className="card">
                        <h3>Total Users</h3>
                        <p>1,230</p>
                    </div>
                    <div className="card">
                        <h3>Active Users</h3>
                        <p>845</p>
                    </div>
                    <div className="card">
                        <h3>New Sales</h3>
                        <p>256</p>
                    </div>
                    <div className="card">
                        <h3>Revenue</h3>
                        <p>$12,400</p>
                    </div>
                </section>

                {/* Detailed Sections */}
                <section className="analytics">
                    <h2>Analytics</h2>
                    <p>Placeholder for analytics charts and data visualizations.</p>
                </section>

                <section className="sales-overview">
                    <h2>Sales Overview</h2>
                    <p>Placeholder for sales data and trends.</p>
                </section>

                <section className="reports">
                    <h2>Reports</h2>
                    <p>Placeholder for various reports.</p>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;
