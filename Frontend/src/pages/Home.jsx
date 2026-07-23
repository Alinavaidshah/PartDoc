import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchParts } from "../features/parts/partsSlice";

// GSAP Imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PRODUCTS = [
  { id: 1, name: "RTX Graphics Cards", category: "Computer Parts", price: "Starting Rs 45,000", icon: "🎮" },
  { id: 2, name: "Gaming Laptops", category: "Laptop Parts", price: "Starting Rs 120,000", icon: "💻" },
  { id: 3, name: "Mobile Displays", category: "Mobile Parts", price: "Starting Rs 3,500", icon: "📱" },
  { id: 4, name: "SSD Storage", category: "Computer Parts", price: "Starting Rs 6,000", icon: "⚡" },
  { id: 5, name: "Laptop Batteries", category: "Laptop Parts", price: "Starting Rs 4,500", icon: "🔋" },
  { id: 6, name: "Mobile Motherboards", category: "Mobile Parts", price: "Starting Rs 8,000", icon: "🔧" },
];

const FEATURES = [
  { icon: "🖥️", title: "Computer Parts", desc: "GPUs, CPUs, RAM, Motherboards — sab kuch original aur warranty ke sath." },
  { icon: "💻", title: "Laptop Parts", desc: "Screens, Keyboards, Batteries, Chargers — har brand ke liye available." },
  { icon: "📱", title: "Mobile Parts", desc: "Displays, Batteries, Cameras, Charging Ports — genuine quality guaranteed." },
];

const UPCOMING_PARTS = [
  {
    id: 1,
    name: "RTX 5090 Series",
    desc: "Next-gen 32GB GDDR7, arriving Aug 2026",
    img: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=500&q=80",
    accent: "#D8973C",
  },
  {
    id: 2,
    name: "Motherboard X870E",
    desc: "PCIe 5.0, DDR5, Wi-Fi 7 onboard",
    img: "https://images.unsplash.com/photo-1741392078419-c510a00b68b8?w=500&q=80",
    accent: "#D8C99B",
  },
  {
    id: 3,
    name: "RAM DDR5 Kits",
    desc: "64GB, 6400MHz, low-latency CL30",
    img: "https://images.unsplash.com/photo-1754331497635-314cd4daaf58?w=500&q=80",
    accent: "#D8973C",
  },
];

const CORNER_EMOJIS = [
  { emoji: "💾", tint: "#D8973C" },
  { emoji: "⚙️", tint: "#D8C99B" },
  { emoji: "🎮", tint: "#D8973C" },
  { emoji: "🔌", tint: "#D8C99B" },
];

const TESTIMONIALS = [
  { id: 1, name: "Hamza Iqbal", role: "PC Builder, Lahore", text: "Order kiya tha RTX card, packaging aur quality dono zabardast thi. Delivery bhi 2 din mein mil gayi.", rating: 5, initials: "HI" },
  { id: 2, name: "Sana Malik", role: "Freelance Editor, Karachi", text: "Laptop battery kharab ho gayi thi, yahan se original mangwai — ab performance pehle jaisi hai.", rating: 5, initials: "SM" },
  { id: 3, name: "Bilal Ahmed", role: "Mobile Repair Shop Owner", text: "Bulk mein mobile parts mangwata hoon, prices market se acha hain aur quality consistent rehti hai.", rating: 4, initials: "BA" },
  { id: 4, name: "Ayesha Raza", role: "Gamer, Islamabad", text: "SSD lagane ke baad boot time half ho gaya. Genuine part tha, koi issue nahi aya.", rating: 5, initials: "AR" },
];

const BRANDS = ["ASUS", "MSI", "Gigabyte", "Corsair", "Samsung", "Kingston", "NVIDIA", "AMD"];

const TRUST_BADGES = [
  { icon: "✅", title: "100% Genuine Parts", desc: "Har product verified aur original — koi compromise nahi." },
  { icon: "🚚", title: "Fast Nationwide Delivery", desc: "24-48 hours mein delivery, poore Pakistan mein." },
  { icon: "🛡️", title: "Warranty Included", desc: "Manufacturer warranty ke sath har part protected." },
  { icon: "💬", title: "24/7 Support", desc: "Kabhi bhi sawaal ho, hamari team available hai." },
];

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

const slideStyle = (visible, delay = 0) => ({
  transform: visible ? "translateY(0)" : "translateY(32px)",
  opacity: visible ? 1 : 0,
  transition: `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, opacity 0.7s ease ${delay}s`,
});

// Updated Theme Palette with Ecru, Charcoal, and Butterscotch
const THEME = {
  bgCanvas: "#152227",
  bgCanvasAlt: "#1c2e35",
  cardBg: "linear-gradient(155deg, #273E47, #1e3037)",
  border: "rgba(216, 201, 155, 0.15)",
  borderHover: "#D8973C",
  heading: "#D8C99B",
  body: "#BAC7BE",
  iconBg: "#1a2a30",
  iconBgHover: "rgba(216, 151, 60, 0.12)",
  eyebrow: "#D8973C",
  shadow: "0 8px 32px rgba(12, 20, 23, 0.6)",
  shadowHover: "0 24px 48px rgba(216, 151, 60, 0.2), 0 0 0 1px rgba(216, 151, 60, 0.25)",
};

function TiltCard({ product, delay }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const cardRef = useRef(null);
  const [sectionRef, inView] = useInView(0.15);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -9;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 9;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 350);
  };

  return (
    <div
      ref={(node) => {
        cardRef.current = node;
        sectionRef.current = node;
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        position: "relative",
        transform: inView
          ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${clicked ? 0.96 : isHovered ? 1.04 : 1}) translateY(0)`
          : "perspective(900px) translateY(32px)",
        opacity: inView ? 1 : 0,
        transition: isHovered || clicked
          ? "transform 0.15s ease"
          : `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, opacity 0.7s ease ${delay}s`,
        background: THEME.cardBg,
        border: `1px solid ${isHovered ? THEME.borderHover : THEME.border}`,
        borderRadius: "18px",
        padding: "28px 24px",
        cursor: "pointer",
        overflow: "hidden",
        boxShadow: isHovered ? THEME.shadowHover : THEME.shadow,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-40%",
          left: "-20%",
          width: "70%",
          height: "180%",
          background: "linear-gradient(115deg, transparent 40%, rgba(216, 151, 60, 0.12) 50%, transparent 60%)",
          transform: isHovered ? "translateX(220%)" : "translateX(-100%)",
          transition: "transform 0.7s ease",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: "58px",
          height: "58px",
          borderRadius: "14px",
          background: isHovered ? THEME.iconBgHover : THEME.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          marginBottom: "18px",
          transform: isHovered ? "rotate(-6deg) scale(1.08)" : "rotate(0deg) scale(1)",
          transition: "all 0.3s ease",
        }}
      >
        {product.icon}
      </div>
      <p style={{ fontSize: "11.5px", color: THEME.eyebrow, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 8px" }}>
        {product.category}
      </p>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "18px", fontWeight: 700, color: THEME.heading, margin: "0 0 8px" }}>
        {product.name}
      </h3>
      <p style={{ fontSize: "14px", color: THEME.body, margin: 0 }}>{product.price}</p>
    </div>
  );
}

function MarqueeCard({ item }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        flexShrink: 0,
        width: "300px",
        height: "220px",
        borderRadius: "18px",
        overflow: "hidden",
        border: `1px solid ${hover ? "#D8973C" : THEME.border}`,
        cursor: "pointer",
        transition: "border-color 0.3s ease, transform 0.3s ease",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <img
        src={item.img || item.image || "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=500&q=80"}
        alt={item.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: hover ? "brightness(0.35)" : "brightness(0.65)",
          transform: hover ? "scale(1.08)" : "scale(1)",
          transition: "filter 0.35s ease, transform 0.5s ease",
        }}
      />
      <p style={{ position: "absolute", left: "18px", right: "18px", bottom: "16px", margin: 0, fontSize: "16px", fontWeight: 600, color: THEME.heading, fontFamily: "'Space Grotesk', sans-serif" }}>
        {item.name}
      </p>
      <p style={{ position: "absolute", left: "18px", right: "18px", bottom: hover ? "42px" : "-30px", opacity: hover ? 1 : 0, margin: 0, fontSize: "13px", color: THEME.body, transition: "bottom 0.3s ease, opacity 0.3s ease" }}>
        {item.desc || item.description || "Original Quality Guaranteed"}
      </p>
    </div>
  );
}

function MarqueeRow({ items, reverse }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div style={{ display: "flex", gap: "22px", width: "max-content", animation: `${reverse ? "marqueeReverse" : "marqueeForward"} 38s linear infinite` }}>
        {doubled.map((item, i) => (
          <MarqueeCard key={`${item.id || item._id}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

function MarqueeSkeletonRow() {
  const skeletonItems = Array(5).fill(0);
  return (
    <div style={{ overflow: "hidden", width: "100%", padding: "0 8%" }}>
      <div style={{ display: "flex", gap: "22px" }}>
        {skeletonItems.map((_, i) => (
          <div key={i} className="shimmer" style={{ width: "300px", height: "220px", borderRadius: "18px", background: "#273E47", border: `1px solid ${THEME.border}` }} />
        ))}
      </div>
    </div>
  );
}

function UpcomingCard({ item, delay }) {
  const [hover, setHover] = useState(false);
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        borderRadius: "18px",
        padding: "22px 22px 26px",
        background: THEME.cardBg,
        border: `1px solid ${hover ? item.accent : THEME.border}`,
        cursor: "pointer",
        transition: `border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease, opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        transform: inView ? (hover ? "translateY(-6px)" : "translateY(0)") : "translateY(32px)",
        opacity: inView ? 1 : 0,
        boxShadow: hover ? `0 20px 40px ${item.accent}22` : THEME.shadow,
      }}
    >
      <div style={{ width: "100%", height: "150px", borderRadius: "12px", overflow: "hidden", marginBottom: "20px", position: "relative", border: `1px solid ${item.accent}33` }}>
        <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)", transform: hover ? "scale(1.06)" : "scale(1)", transition: "transform 0.5s ease" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, ${item.accent}22 100%)` }} />
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "18px", fontWeight: 700, color: THEME.heading, margin: "0 0 10px" }}>
        {item.name}
      </h3>
      <p style={{ fontSize: "14px", color: THEME.body, margin: 0 }}>{item.desc}</p>
    </div>
  );
}

function CornerEmoji({ data, style }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "absolute",
        width: "72px",
        height: "72px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        background: `radial-gradient(circle at 30% 25%, ${data.tint}22, rgba(39, 62, 71, 0.2) 70%)`,
        border: `1px solid ${data.tint}33`,
        boxShadow: hover ? `0 0 30px ${data.tint}44` : `0 0 18px ${data.tint}11`,
        backdropFilter: "blur(6px)",
        transform: hover ? "translateY(-4px) scale(1.06)" : "translateY(0) scale(1)",
        transition: "all 0.35s ease",
        zIndex: 2,
        ...style,
      }}
    >
      {data.emoji}
    </div>
  );
}

function UpcomingPartsSection() {
  const [headRef, headIn] = useInView(0.3);
  return (
    <section style={{ padding: "90px 8%", background: THEME.bgCanvas, position: "relative", overflow: "hidden" }}>
      <CornerEmoji data={CORNER_EMOJIS[0]} style={{ top: "40px", left: "6%" }} />
      <CornerEmoji data={CORNER_EMOJIS[1]} style={{ top: "40px", right: "6%" }} />
      <CornerEmoji data={CORNER_EMOJIS[2]} style={{ bottom: "40px", left: "6%" }} />
      <CornerEmoji data={CORNER_EMOJIS[3]} style={{ bottom: "40px", right: "6%" }} />

      <div ref={headRef} style={{ textAlign: "center", marginBottom: "44px", position: "relative", zIndex: 2, ...slideStyle(headIn, 0) }}>
        <p style={{ color: "#D8C99B", fontWeight: 600, fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>
          On The Way
        </p>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "32px", fontWeight: 700, margin: "0 0 10px", color: THEME.heading }}>
          Upcoming Parts
        </h2>
        <p style={{ color: THEME.body, fontSize: "14.5px" }}>Next-gen tech landing soon at PartDoc</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        {UPCOMING_PARTS.map((item, i) => (
          <UpcomingCard key={item.id} item={item} delay={i * 0.12} />
        ))}
      </div>
    </section>
  );
}

function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", gap: "3px", marginBottom: "14px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ fontSize: "14px", color: n <= rating ? "#D8973C" : "rgba(216,201,155,0.2)" }}>★</span>
      ))}
    </div>
  );
}

function TestimonialCard({ item, delay }) {
  const [hover, setHover] = useState(false);
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        background: THEME.cardBg,
        border: `1px solid ${hover ? THEME.borderHover + "55" : THEME.border}`,
        borderRadius: "18px",
        padding: "28px 26px",
        transform: inView ? (hover ? "translateY(-6px)" : "translateY(0)") : "translateY(32px)",
        opacity: inView ? 1 : 0,
        transition: `transform 0.3s ease, opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, border-color 0.3s ease, box-shadow 0.3s ease`,
        boxShadow: hover ? THEME.shadowHover : THEME.shadow,
      }}
    >
      <div style={{ position: "absolute", top: "20px", right: "24px", fontSize: "40px", color: "rgba(216,151,60,0.12)", fontFamily: "Georgia, serif", lineHeight: 1 }}>"</div>
      <StarRating rating={item.rating} />
      <p style={{ fontSize: "14.5px", color: THEME.body, lineHeight: 1.7, margin: "0 0 22px", position: "relative", zIndex: 1 }}>{item.text}</p>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: hover ? THEME.iconBgHover : THEME.iconBg, border: `1px solid ${THEME.borderHover}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: THEME.eyebrow, transition: "all 0.3s ease" }}>
          {item.initials}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: THEME.heading }}>{item.name}</p>
          <p style={{ margin: 0, fontSize: "12.5px", color: THEME.body, opacity: 0.75 }}>{item.role}</p>
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const [headRef, headIn] = useInView(0.3);
  return (
    <section style={{ padding: "90px 8%", background: THEME.bgCanvasAlt, position: "relative", zIndex: 2 }}>
      <div ref={headRef} style={{ textAlign: "center", marginBottom: "48px", ...slideStyle(headIn, 0) }}>
        <p style={{ color: "#D8973C", fontWeight: 600, fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>Customer Voices</p>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "32px", fontWeight: 700, margin: "0 0 10px", color: "#D8C99B" }}>What People Are Saying</h2>
        <p style={{ color: THEME.body, fontSize: "14.5px" }}>Real feedback from real customers across Pakistan</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.id} item={t} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}

function BrandsStrip() {
  const [headRef, headIn] = useInView(0.3);
  const doubled = [...BRANDS, ...BRANDS];
  return (
    <section style={{ padding: "60px 0", background: THEME.bgCanvas, position: "relative", zIndex: 2, overflow: "hidden" }}>
      <div ref={headRef} style={{ textAlign: "center", marginBottom: "36px", padding: "0 8%", ...slideStyle(headIn, 0) }}>
        <p style={{ color: THEME.body, fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600, opacity: 0.7 }}>
          Trusted Brands We Stock
        </p>
      </div>
      <div style={{ overflow: "hidden", width: "100%" }}>
        <div style={{ display: "flex", gap: "60px", width: "max-content", animation: "marqueeForward 26s linear infinite" }}>
          {doubled.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "22px",
                fontWeight: 700,
                color: THEME.heading,
                opacity: 0.4,
                whiteSpace: "nowrap",
                letterSpacing: "0.5px",
                transition: "opacity 0.3s ease",
              }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustBadgeCard({ item, delay }) {
  const [hover, setHover] = useState(false);
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: "center",
        padding: "10px",
        transform: inView ? "translateY(0)" : "translateY(32px)",
        opacity: inView ? 1 : 0,
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          margin: "0 auto 18px",
          borderRadius: "16px",
          background: hover ? THEME.iconBgHover : THEME.iconBg,
          border: `1px solid ${hover ? THEME.borderHover + "55" : THEME.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          transform: hover ? "translateY(-4px) scale(1.06)" : "translateY(0) scale(1)",
          transition: "all 0.3s ease",
        }}
      >
        {item.icon}
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16.5px", fontWeight: 700, color: THEME.heading, margin: "0 0 8px" }}>
        {item.title}
      </h3>
      <p style={{ fontSize: "13.5px", color: THEME.body, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
    </div>
  );
}

function TrustSection() {
  const [headRef, headIn] = useInView(0.3);
  return (
    <section style={{ padding: "80px 8%", background: THEME.bgCanvasAlt, position: "relative", zIndex: 2 }}>
      <div ref={headRef} style={{ textAlign: "center", marginBottom: "48px", ...slideStyle(headIn, 0) }}>
        <p style={{ color: "#D8973C", fontWeight: 600, fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>Why PartDoc</p>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "32px", fontWeight: 700, margin: 0, color: "#D8C99B" }}>Built On Trust</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "30px", maxWidth: "1100px", margin: "0 auto" }}>
        {TRUST_BADGES.map((b, i) => (
          <TrustBadgeCard key={i} item={b} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [ref, inView] = useInView(0.3);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 3000);
  };

  return (
    <section style={{ padding: "90px 8%", background: THEME.bgCanvas, position: "relative", zIndex: 2, overflow: "hidden" }}>
      <div
        ref={ref}
        style={{
          maxWidth: "780px",
          margin: "0 auto",
          textAlign: "center",
          background: THEME.cardBg,
          border: `1px solid ${THEME.border}`,
          borderRadius: "24px",
          padding: "56px 40px",
          position: "relative",
          overflow: "hidden",
          ...slideStyle(inView, 0),
        }}
      >
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(216,151,60,0.12), transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(216,201,155,0.08), transparent 70%)" }} />
        <p style={{ color: "#D8973C", fontWeight: 600, fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "14px", position: "relative", zIndex: 1 }}>
          Stay Updated
        </p>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "30px", fontWeight: 700, margin: "0 0 12px", color: "#D8C99B", position: "relative", zIndex: 1 }}>
          Get Notified On New Parts & Deals
        </h2>
        <p style={{ color: THEME.body, fontSize: "14.5px", marginBottom: "32px", position: "relative", zIndex: 1 }}>
          Subscribe to our newsletter aur sabse pehle discounts aur new arrivals ka pata karo.
        </p>
        <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "12px", maxWidth: "440px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              flex: "1 1 240px",
              padding: "14px 18px",
              borderRadius: "10px",
              border: `1px solid ${THEME.border}`,
              background: "rgba(21, 34, 39, 0.6)",
              color: THEME.heading,
              fontSize: "14.5px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            className="glow-btn"
            style={{
              padding: "14px 26px",
              borderRadius: "10px",
              border: "none",
              background: subscribed ? "#4CAF50" : "#D8973C",
              color: "#152227",
              fontWeight: 600,
              fontSize: "14.5px",
              cursor: "pointer",
              transition: "all 0.25s ease",
              whiteSpace: "nowrap",
            }}
          >
            {subscribed ? "Subscribed ✓" : "Subscribe →"}
          </button>
        </form>
      </div>
    </section>
  );
}

function StatCounter({ end, label, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.4);

  useEffect(() => {
    if (!inView) return;
    const cappedEnd = Math.min(end, 999);
    let start = 0;
    const duration = 1400;
    const stepTime = Math.max(Math.floor(duration / cappedEnd), 15);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= cappedEnd) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [end, inView]);

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "32px", fontWeight: 700, color: "#D8973C", margin: "0 0 4px" }}>
        {count}{suffix}
      </p>
      <p style={{ fontSize: "13px", color: THEME.body, margin: 0 }}>{label}</p>
    </div>
  );
}

function FeatureCard({ feature, delay }) {
  const [hover, setHover] = useState(false);
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: THEME.cardBg,
        border: `1px solid ${hover ? THEME.borderHover + "55" : THEME.border}`,
        borderRadius: "18px",
        padding: "32px 26px",
        transform: inView ? (hover ? "translateY(-6px)" : "translateY(0)") : "translateY(32px)",
        opacity: inView ? 1 : 0,
        transition: `transform 0.3s ease, opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, border-color 0.3s ease, box-shadow 0.3s ease`,
        boxShadow: hover ? THEME.shadowHover : THEME.shadow,
      }}
    >
      <div style={{ fontSize: "30px", width: "58px", height: "58px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "14px", background: hover ? THEME.iconBgHover : THEME.iconBg, marginBottom: "20px", transition: "all 0.3s ease" }}>
        {feature.icon}
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "19px", fontWeight: 700, color: THEME.heading, margin: "0 0 10px" }}>
        {feature.title}
      </h3>
      <p style={{ fontSize: "14.5px", lineHeight: 1.6, color: THEME.body, margin: 0 }}>{feature.desc}</p>
    </div>
  );
}

function DeviceCluster() {
  const [rotY, setRotY] = useState(15);
  const [rotX, setRotX] = useState(10);
  const clusterRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!clusterRef.current) return;
    const rect = clusterRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 25;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -20;
    setRotY(rotateY);
    setRotX(rotateX);
  };

  const handleMouseLeave = () => {
    setRotY(15);
    setRotX(10);
  };

  return (
    <div
      ref={clusterRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "500px",
        height: "460px",
        perspective: "1500px",
        cursor: "pointer",
        touchAction: "none",
        flexShrink: 0,
        zIndex: 2,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`,
          transition: "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)"
        }}
      >
        <div style={{ position: "absolute", width: "138px", height: "250px", top: "50%", left: "50%", marginTop: "-125px", marginLeft: "-69px", transform: "translateZ(88px)", borderRadius: "17px", background: "linear-gradient(160deg, #273E47, #152227)", border: "1px solid rgba(216, 201, 155, 0.3)", boxShadow: "0 30px 60px rgba(216, 151, 60, 0.15)", overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: "12px", top: "12px", bottom: "12px", width: "7px", borderRadius: "3.5px", background: "linear-gradient(180deg, #D8973C, #D8C99B, #273E47, #D8973C)", backgroundSize: "100% 300%", animation: "rgbFlow 3s linear infinite", boxShadow: "0 0 12px rgba(216, 151, 60, 0.6)" }} />
          <div style={{ position: "absolute", right: "20px", top: "44px", width: "64px", height: "64px", borderRadius: "50%", border: "3px solid #D8973C", boxShadow: "0 0 20px rgba(216, 151, 60, 0.5)", animation: "spinCW 3s linear infinite, rgbGlow 2.5s ease-in-out infinite" }} />
          <div style={{ position: "absolute", right: "27px", top: "134px", width: "52px", height: "52px", borderRadius: "50%", border: "3px solid #D8C99B", boxShadow: "0 0 18px rgba(216, 201, 155, 0.5)", animation: "spinCCW 2.5s linear infinite, rgbGlow 2.5s ease-in-out infinite 0.5s" }} />
        </div>
        <div style={{ position: "absolute", width: "188px", height: "123px", top: "50%", left: "50%", marginTop: "22px", marginLeft: "-256px", transform: "rotateY(32deg) translateZ(12px)", transformOrigin: "right center", pointerEvents: "none" }}>
          <div style={{ width: "100%", height: "68%", borderRadius: "9px 9px 0 0", background: "linear-gradient(160deg, #273E47, #152227)", border: "1px solid rgba(216, 201, 155, 0.2)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "7px", borderRadius: "5px", background: "linear-gradient(120deg, #152227, rgba(216, 151, 60, 0.15), #152227)", backgroundSize: "200% 200%", animation: "screenGlow 2.5s ease-in-out infinite" }} />
          </div>
          <div style={{ width: "100%", height: "32%", borderRadius: "0 0 9px 9px", background: "linear-gradient(160deg, #1e3037, #273E47)", border: "1px solid rgba(216, 201, 155, 0.2)", borderTop: "none" }} />
        </div>
        <div style={{ position: "absolute", width: "80px", height: "170px", top: "50%", left: "50%", marginTop: "-48px", marginLeft: "169px", transform: "rotateY(-28deg) translateZ(12px)", transformOrigin: "left center", borderRadius: "18px", background: "linear-gradient(160deg, #273E47, #152227)", border: "1px solid rgba(216, 201, 155, 0.2)", boxShadow: "0 20px 40px rgba(216, 201, 155, 0.15)", overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", inset: "6px", borderRadius: "13px", background: "linear-gradient(160deg, #152227, rgba(216, 151, 60, 0.08))" }} />
          <div style={{ position: "absolute", top: "11px", left: "50%", transform: "translateX(-50%)", width: "7px", height: "7px", borderRadius: "50%", background: "#D8973C", boxShadow: "0 0 8px 2px rgba(216, 151, 60, 0.7)", animation: "rgbGlow 2.5s ease-in-out infinite" }} />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const container = useRef(); 
  const dispatch = useDispatch();
  const { items: marqueeParts, loading } = useSelector((state) => state.parts);

  useEffect(() => {
    dispatch(fetchParts());
  }, [dispatch]);

  // GSAP Animation Logic 
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(".hero-animate", 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: "power4.out" }
    );
  }, { scope: container });

  const [featuresHeadRef, featuresHeadIn] = useInView(0.3);
  const [marqueeHeadRef, marqueeHeadIn] = useInView(0.3);

  return (
    <div ref={container} style={{ fontFamily: "'Inter', sans-serif", background: THEME.bgCanvas, color: THEME.body, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .glow-btn:hover { box-shadow: 0 0 25px rgba(216,151,60,0.5); transform: translateY(-2px); }
        .outline-btn:hover { background: rgba(216, 201, 155, 0.08); border-color: #D8C99B; }
        @keyframes pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes rgbFlow { 0% { background-position: 0% 0%; } 100% { background-position: 0% 300%; } }
        @keyframes rgbGlow {
          0%, 100% { box-shadow: 0 0 8px 2px rgba(216,151,60,0.7); }
          50% { box-shadow: 0 0 10px 3px rgba(216,201,155,0.7); }
        }
        @keyframes spinCW { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes spinCCW { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
        @keyframes screenGlow { 0%, 100% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } }
        @keyframes marqueeForward { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marqueeReverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        @keyframes shimmerAnimation { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer { background: linear-gradient(90deg, #273E47 25%, #35535f 50%, #273E47 75%); background-size: 200% 100%; animation: shimmerAnimation 1.5s infinite linear; }
      `}</style>

      {/* ===== HERO SECTION ===== */}
      <section style={{ minHeight: "92vh", display: "flex", alignItems: "center", justifyContent: "center", gap: "40px", padding: "100px 8% 40px", position: "relative", flexWrap: "wrap", overflow: "hidden" }}>
        <div style={{ maxWidth: "480px", flex: "1 1 420px", position: "relative", zIndex: 2 }}>
          <span className="hero-animate" style={{ display: "inline-block", padding: "6px 16px", borderRadius: "999px", background: "rgba(216, 151, 60, 0.08)", border: "1px solid rgba(216, 151, 60, 0.25)", color: "#D8973C", fontSize: "13px", fontWeight: 600, marginBottom: "22px", animation: "pulse 2.5s infinite" }}>
            ⚡ Pakistan's #1 Tech Parts Store
          </span>
          <h1 className="hero-animate" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "46px", fontWeight: 700, lineHeight: 1.15, margin: "0 0 18px", color: "#D8C99B" }}>
            Upgrade Your Tech<br />With <span style={{ color: "#D8973C" }}>Genuine</span> Parts
          </h1>
          <p className="hero-animate" style={{ fontSize: "16.5px", color: "#BAC7BE", lineHeight: 1.7, marginBottom: "30px" }}>
            Computer, Laptop, aur Mobile parts — sab kuch ek jagah, best price aur original quality ke sath. Fast delivery across Pakistan.
          </p>
          <div className="hero-animate" style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "40px" }}>
            <button className="glow-btn" style={{ padding: "14px 30px", borderRadius: "10px", border: "none", background: "#D8973C", color: "#152227", fontWeight: 600, fontSize: "15px", cursor: "pointer", transition: "all 0.25s ease" }}>Shop Now →</button>
            <button className="outline-btn" style={{ padding: "14px 30px", borderRadius: "10px", border: "1px solid rgba(216, 201, 155, 0.3)", background: "transparent", color: "#D8C99B", fontWeight: 600, fontSize: "15px", cursor: "pointer", transition: "all 0.25s ease" }}>Explore Parts</button>
          </div>
          <div className="hero-animate" style={{ display: "flex", gap: "36px" }}>
            <StatCounter end={999} suffix="+" label="Parts Sold" />
            <StatCounter end={98} suffix="%" label="Happy Customers" />
            <StatCounter end={24} suffix="hr" label="Fast Delivery" />
          </div>
        </div>

        <div className="hero-animate" style={{ flex: "1 1 460px", display: "flex", justifyContent: "center" }}>
          <DeviceCluster />
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section style={{ padding: "90px 8%", background: THEME.bgCanvasAlt, position: "relative", zIndex: 2 }}>
        <div ref={featuresHeadRef} style={{ textAlign: "center", marginBottom: "48px", ...slideStyle(featuresHeadIn, 0) }}>
          <p style={{ color: "#D8973C", fontWeight: 600, fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>What We Offer</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "32px", fontWeight: 700, margin: 0, color: "#D8C99B" }}>Every Part You Need</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {FEATURES.map((f, i) => <FeatureCard key={i} feature={f} delay={i * 0.12} />)}
        </div>
      </section>

      {/* ===== MARQUEE SECTION WITH REDUX DATA FLOW ===== */}
      <section style={{ padding: "90px 0", background: THEME.bgCanvas, overflow: "hidden", position: "relative", zIndex: 2 }}>
        <div ref={marqueeHeadRef} style={{ textAlign: "center", marginBottom: "44px", padding: "0 8%", ...slideStyle(marqueeHeadIn, 0) }}>
          <p style={{ color: "#D8973C", fontWeight: 600, fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>Trending This Week</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "32px", fontWeight: 700, margin: "0 0 10px", color: "#D8C99B" }}>High Demand Right Now</h2>
          <p style={{ color: "#BAC7BE", fontSize: "14.5px" }}>Hover any part to see the details</p>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <MarqueeSkeletonRow />
          </div>
        ) : marqueeParts && marqueeParts.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <MarqueeRow items={marqueeParts} reverse={false} />
            <MarqueeRow items={[...marqueeParts].reverse()} reverse={true} />
          </div>
        ) : (
          <div style={{ textAlign: "center", color: THEME.body, fontSize: "14px", padding: "20px" }}>
            No products available at the moment.
          </div>
        )}
      </section>

      {/* ===== UPCOMING SECTION ===== */}
      <UpcomingPartsSection />

      {/* ===== TRUST BADGES SECTION ===== */}
      <TrustSection />

      {/* ===== BRANDS STRIP ===== */}
      <BrandsStrip />

      {/* ===== TESTIMONIALS SECTION ===== */}
      <TestimonialsSection />

      {/* ===== NEWSLETTER / CTA SECTION ===== */}
      <NewsletterSection />
    </div>
  );
}