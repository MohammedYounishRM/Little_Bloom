import React from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, BookOpen, HeartPulse, Award, FileText, CheckCircle, Users, Building2, Calendar } from "lucide-react";

const HomePage = () => {
    const regionalStats = [
        { label: "Sanctioned Anganwadi Centers (AWCs)", count: "54,439", icon: Building2 },
        { label: "Beneficiaries (Children & Mothers)", count: "approx 40+ Lakhs", icon: Users },
        { label: "Districts Operational", count: "38 Districts", icon: CheckCircle }
    ];

    const governmentSchemes = [
        {
            title: "Early Childhood Care and Education (ECCE)",
            description: "Pre-school non-formal education module mapping psychological development parameters for children between 3 to 6 years using localized interactive learning models.",
            benefits: "School readiness indicators, cognitive foundation mapping, and linguistic updates."
        },
        {
            title: "Puratchi Thalaivar MGR Nutritious Meal Programme",
            description: "Providing hot cooked nutritious meals at centers daily. Includes standard menu rotations with boiled eggs (5 days a week) or bananas for alternative diets to eliminate classroom hunger and malnutrition.",
            benefits: "Daily calories compliance, protein enrichment, and micro-nutrient tracking."
        },
        {
            title: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
            description: "Direct Benefit Transfer (DBT) cash incentive of ₹5,000 (in 2 installments) for the first child, and ₹6,000 for a second child if it is a girl, aimed at incentivizing healthcare and nutrition.",
            benefits: "Compensates wage loss, promotes safe delivery setups, and postnatal rest periods."
        },
        {
            title: "Poshan Abhiyaan (National Nutrition Mission)",
            description: "Technology-driven convergence mechanism targeting stunting, under-nutrition, anemia reduction among young children, adolescent girls, pregnant women, and lactating mothers.",
            benefits: "Real-time growth monitoring registries, clean water access, and behavioral change drives."
        }
    ];

    return (
        <div className="gov-portal-wrapper">
            <header className="gov-top-banner">
                <div className="gov-container header-flex">
                    <div className="gov-brand-block">
                        <img src="../assets/logo.svg" alt="Little Bloom Emblem" className="gov-emblem-img" />
                        <div className="gov-title-text">
                            <h1>Little Bloom - Integrated Child Development Services (ICDS)</h1>
                            <p className="sub-dept">Department of Social Welfare and Women Empowerment • Government of Tamil Nadu</p>
                        </div>
                    </div>
                    <div className="gov-header-actions">
                        <Link to="/login" className="gov-btn gov-btn-primary">
                            <LogIn size={16} />
                            <span>Teacher Sign In</span>
                        </Link>
                        <Link to="/signup" className="gov-btn gov-btn-secondary">
                            <UserPlus size={16} />
                            <span>Register Center</span>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="gov-ticker-tape">
                <div className="gov-container ticker-content">
                    <span className="badge">UPDATES</span>
                    <marquee behavior="scroll" direction="left" scrollamount="5">
                        Real-time growth monitoring metrics synchronized with Poshan Tracker. | Ensure all local daily logs and daily meal records are submitted before 4:00 PM.
                    </marquee>
                </div>
            </div>

            <section className="gov-hero-section">
                <div className="gov-container">
                    <div className="hero-grid">
                        <div className="hero-text-content">
                            <h2>Nurturing the Future: Little Bloom Anganwadi Workspace</h2>
                            <p>
                                Welcome to the unified portal mapping resource records across Anganwadi blocks within Tamil Nadu. This system provides critical structural infrastructure for tracking attendance, nutritional metrics, and child development milestones to ensure a healthy childhood.
                            </p>
                            <div className="cta-row">
                                <a href="#schemes" className="gov-btn gov-btn-outline">
                                    <FileText size={16} /> Explore Active Schemes
                                </a>
                            </div>
                        </div>
                        <div className="hero-stats-panel">
                            <h3>State Operations Overview</h3>
                            <div className="stats-cards-stack">
                                {regionalStats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div className="stat-row-card" key={index}>
                                            <div className="stat-icon-wrapper"><Icon size={24} /></div>
                                            <div>
                                                <h4>{stat.count}</h4>
                                                <p>{stat.label}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="gov-features-section">
                <div className="gov-container">
                    <div className="section-header-centered">
                        <h2>Portal Core Operations & Services</h2>
                        <div className="accent-line"></div>
                    </div>
                    <div className="features-layout-grid">
                        <div className="feature-item-card">
                            <div className="feat-header-icon"><Calendar size={22} /></div>
                            <h3>Daily Attendance Logistics</h3>
                            <p>Authorized desk teachers manage roster checklists live for assigned village children including automated metric synchronization with regional servers.</p>
                        </div>
                        <div className="feature-item-card">
                            <div className="feat-header-icon"><HeartPulse size={22} /></div>
                            <h3>Malnutrition Registry</h3>
                            <p>Strategic monitoring metrics built over weight, age, height matrices helping identify stunting or wasting symptoms early according to WHO standards.</p>
                        </div>
                        <div className="feature-item-card">
                            <div className="feat-header-icon"><BookOpen size={22} /></div>
                            <h3>ECCE Pre-School Registry</h3>
                            <p>Standardized tracking mechanisms managing instructional participation across early foundational curricula modules setup for Toddlers.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section id="schemes" className="gov-schemes-section">
                <div className="gov-container">
                    <div className="section-header-left">
                        <h2>Active Welfare Programs & Schemes</h2>
                        <p>Official guidelines administered through regional child welfare circles</p>
                        <div className="accent-line"></div>
                    </div>

                    <div className="schemes-vertical-list">
                        {governmentSchemes.map((scheme, index) => (
                            <div className="scheme-detailed-card" key={index}>
                                <div className="scheme-badge-index">0{index + 1}</div>
                                <div className="scheme-main-body">
                                    <h3>{scheme.title}</h3>
                                    <p className="scheme-desc">{scheme.description}</p>
                                    <div className="scheme-benefits-tag">
                                        <strong>Key Objective Focus:</strong> {scheme.benefits}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="gov-portal-footer">
                <div className="gov-container footer-grid">
                    <div>
                        <h5>Little Bloom System</h5>
                        <p className="footer-desc-text">An unified resource mapping utility built supporting local Anganwadi tracking workflows throughout the state circles.</p>
                    </div>
                    <div>
                        <h5>Quick Links</h5>
                        <ul className="footer-links-list">
                            <li><Link to="/login">Teacher Account Authentication</Link></li>
                            <li><Link to="/signup">New Center Allocation Enrollment</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5>Technical Support Disclaimer</h5>
                        <p className="footer-desc-text">For technical queries regarding state analytics data dashboard mapping setups, contact center block administrators directly.</p>
                    </div>
                </div>
                <div className="footer-bottom-copyright">
                    <div className="gov-container copyright-flex">
                        <span>© {new Date().getFullYear()} Little Bloom, Department of Women and Child Development, Government of Tamil Nadu. All rights reserved.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;