import React, { useState, useEffect } from "react";

function Footer() {
  const [emailHover, setEmailHover] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  // Responsive state track karne ke liye event hook
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive Grid Logic setup
  let gridTemplateColumns = "1.4fr 1fr 1fr 1.2fr";
  if (windowWidth < 640) {
    gridTemplateColumns = "1fr"; // Mobile layout
  } else if (windowWidth < 1024) {
    gridTemplateColumns = "1fr 1fr"; // Tablet layout
  }

  return (
    <footer
      style={{
        background: "#152227", // Charcoal Base Dark
        borderTop: "1px solid rgba(216, 201, 155, 0.15)", // Subtle Ecru Border
        padding: windowWidth < 640 ? "48px 6% 24px" : "70px 8% 32px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Main Links Framework Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: gridTemplateColumns,
          gap: windowWidth < 640 ? "32px" : "40px",
          paddingBottom: "48px",
          borderBottom: "1px solid rgba(216, 201, 155, 0.15)",
        }}
      >
        {/* Brand column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div
              style={{
                background: "#D8973C", // Butterscotch Brand Highlight
                padding: "8px",
                borderRadius: "10px",
                fontSize: "18px",
                lineHeight: 1,
              }}
            >
              🔧
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "22px",
                background: "linear-gradient(90deg, #D8973C, #D8C99B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "0.5px",
              }}
            >
              PartDoc
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "#BAC7BE", lineHeight: 1.7, maxWidth: "280px", margin: "0 0 20px" }}>
            Computer, Laptop, aur Mobile parts — genuine quality, best price, fast delivery across Pakistan.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            {["𝕏", "in", "f", "▶"].map((icon, i) => (
              <a
                key={i}
                href="#"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  border: "1px solid rgba(186, 199, 190, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#BAC7BE",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#D8973C";
                  e.currentTarget.style.color = "#D8973C";
                  e.currentTarget.style.boxShadow = "0 0 15px rgba(216,151,60,0.3)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(186, 199, 190, 0.2)";
                  e.currentTarget.style.color = "#BAC7BE";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Shop links */}
        <div>
          <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: 700, color: "#fff", margin: "0 0 18px" }}>
            Shop
          </h4>
          {["Computer Parts", "Laptop Parts", "Mobile Parts", "Accessories"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                display: "block",
                fontSize: "14px",
                color: "#BAC7BE",
                textDecoration: "none",
                marginBottom: "13px",
                transition: "color 0.25s ease, transform 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#D8973C";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#BAC7BE";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Company links */}
        <div>
          <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: 700, color: "#fff", margin: "0 0 18px" }}>
            Company
          </h4>
          {["About Us", "Appointment", "Warranty", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                display: "block",
                fontSize: "14px",
                color: "#BAC7BE",
                textDecoration: "none",
                marginBottom: "13px",
                transition: "color 0.25s ease, transform 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#D8973C";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#BAC7BE";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Newsletter */}
        <div>
          <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: 700, color: "#fff", margin: "0 0 18px" }}>
            Stay Updated
          </h4>
          <p style={{ fontSize: "13.5px", color: "#BAC7BE", lineHeight: 1.6, margin: "0 0 16px" }}>
            Deals aur new arrivals ki updates seedha inbox mein.
          </p>
          <div style={{ display: "flex", gap: "8px", maxWidth: "100%" }}>
            <input
              type="email"
              placeholder="Your email"
              style={{
                flex: 1,
                minWidth: 0,
                padding: "11px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(186, 199, 190, 0.2)",
                background: "#273E47", // Charcoal Secondary Input Dark
                color: "#fff",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              onMouseEnter={() => setEmailHover(true)}
              onMouseLeave={() => setEmailHover(false)}
              style={{
                padding: "11px 16px",
                borderRadius: "10px",
                border: "none",
                background: "#D8973C", // Butterscotch Action
                color: "#152227",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: emailHover ? "0 0 20px rgba(216,151,60,0.5)" : "none",
                transform: emailHover ? "translateY(-2px)" : "translateY(0)",
                transition: "all 0.25s ease",
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: windowWidth < 640 ? "column" : "row",
          textAlign: windowWidth < 640 ? "center" : "left",
          gap: "16px",
          paddingTop: "28px",
        }}
      >
        <p style={{ fontSize: "13px", color: "#BAC7BE", opacity: 0.7, margin: 0 }}>
          © 2026 PartDoc. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
          {["Privacy Policy", "Terms of Service"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                fontSize: "13px",
                color: "#BAC7BE",
                opacity: 0.7,
                textDecoration: "none",
                transition: "color 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#D8973C";
                e.currentTarget.style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#BAC7BE";
                e.currentTarget.style.opacity = 0.7;
              }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;