import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchParts } from "../features/parts/partsSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  Award,
  Star,
  Wrench,
  Monitor,
  Laptop,
  Smartphone,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Layers,
  Check,
  ShoppingBag,
  Clock,
  Filter
} from "lucide-react";

// Clean Mock Products for Light Theme Showcase
const MOCK_PRODUCTS = [
  {
    id: "m1",
    name: "NVIDIA GeForce RTX 4080 Super 16GB",
    category: "Computer Parts",
    price: 345000,
    rating: 4.9,
    reviewsCount: 48,
    stock: "In Stock",
    tag: "Top Seller",
    image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80"
  },
  {
    id: "m2",
    name: "Apple MacBook Pro 16\" M3 Liquid Retina Display",
    category: "Laptop Parts",
    price: 78000,
    rating: 4.8,
    reviewsCount: 32,
    stock: "In Stock",
    tag: "Original OEM",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
  },
  {
    id: "m3",
    name: "Samsung Galaxy S24 Ultra Dynamic AMOLED 2X",
    category: "Mobile Parts",
    price: 45000,
    rating: 5.0,
    reviewsCount: 64,
    stock: "In Stock",
    tag: "Best Value",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80"
  },
  {
    id: "m4",
    name: "Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 SSD",
    category: "Computer Parts",
    price: 48000,
    rating: 4.9,
    reviewsCount: 95,
    stock: "In Stock",
    tag: "High Speed",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80"
  },
  {
    id: "m5",
    name: "Dell XPS 15 Original 86Wh Battery",
    category: "Laptop Parts",
    price: 18500,
    rating: 4.7,
    reviewsCount: 22,
    stock: "In Stock",
    tag: "Genuine",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80"
  },
  {
    id: "m6",
    name: "iPhone 15 Pro Max Unlocked Motherboard 256GB",
    category: "Mobile Parts",
    price: 92000,
    rating: 4.9,
    reviewsCount: 19,
    stock: "Low Stock",
    tag: "Tested Verified",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&q=80"
  }
];

const CATEGORIES_SUMMARY = [
  {
    id: "Computer Parts",
    title: "Computer Parts",
    subtitle: "GPUs, CPUs, RAM, Motherboards & SSDs",
    itemCount: "1,200+ Products",
    icon: Monitor,
    color: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-200 hover:border-blue-400",
    iconBg: "bg-blue-600 text-white",
    path: "/computerparts"
  },
  {
    id: "Laptop Parts",
    title: "Laptop Parts",
    subtitle: "Displays, Batteries, Keyboards & Chargers",
    itemCount: "850+ Products",
    icon: Laptop,
    color: "from-purple-500/10 to-pink-500/10",
    border: "border-purple-200 hover:border-purple-400",
    iconBg: "bg-purple-600 text-white",
    path: "/computerparts?category=laptop"
  },
  {
    id: "Mobile Parts",
    title: "Mobile Parts",
    subtitle: "AMOLED Displays, Logic Boards & Cameras",
    itemCount: "1,500+ Products",
    icon: Smartphone,
    color: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-200 hover:border-emerald-400",
    iconBg: "bg-emerald-600 text-white",
    path: "/mobileparts"
  },
  {
    id: "Tools & Repair",
    title: "Repair & Services",
    subtitle: "Professional technician booking & repair",
    itemCount: "24/7 Available",
    icon: Wrench,
    color: "from-[#D8973C]/10 to-amber-500/10",
    border: "border-amber-200 hover:border-amber-400",
    iconBg: "bg-[#D8973C] text-slate-900",
    path: "/appointment"
  }
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Hamza Iqbal",
    location: "Lahore",
    role: "Custom PC Builder",
    text: "Ordered an RTX 4080 Super. The packaging was top-notch and delivery took under 36 hours. 100% genuine part with official serial verification!",
    rating: 5,
    avatar: "HI",
  },
  {
    id: 2,
    name: "Sana Malik",
    location: "Karachi",
    role: "Freelance Editor",
    text: "My MacBook battery had swollen completely. Ordered an OEM replacement screen & battery from PartDoc. Installed smoothly, performance is like new!",
    rating: 5,
    avatar: "SM",
  },
  {
    id: 3,
    name: "Bilal Ahmed",
    location: "Rawalpindi",
    role: "Repair Shop Owner",
    text: "I buy wholesale mobile displays and motherboards from PartDoc. Market prices are competitive, zero defect rate, and fast customer response time.",
    rating: 5,
    avatar: "BA",
  },
];

const BRANDS = [
  "NVIDIA", "AMD", "ASUS ROG", "MSI GAMING", "GIGABYTE", "CORSAIR", "SAMSUNG", "KINGSTON", "APPLE", "DELL", "HP", "LENOVO"
];

const TRUST_BADGES = [
  { icon: ShieldCheck, title: "100% Genuine Guarantee", desc: "Sourced directly from authorized distributors with official serial verification." },
  { icon: Truck, title: "Nationwide Express Shipping", desc: "Safely packaged & delivered in 24-48 hours anywhere across Pakistan." },
  { icon: Award, title: "Official Warranty Protected", desc: "Complete peace of mind with 6 to 36 months manufacturer warranty." },
  { icon: Headphones, title: "24/7 Expert Support", desc: "Talk directly with our technicians to check exact component compatibility." },
];

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: marqueeParts, loading } = useSelector((state) => state.parts);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Estimator Widget State
  const [calcDevice, setCalcDevice] = useState("Computer");
  const [calcPart, setCalcPart] = useState("GPU");

  useEffect(() => {
    dispatch(fetchParts());
  }, [dispatch]);

  const displayParts = (marqueeParts && marqueeParts.length > 0) ? marqueeParts : MOCK_PRODUCTS;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/computerparts?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setNewsletterEmail("");
    }, 3500);
  };

  // Estimator Data
  const ESTIMATOR_DATA = {
    Computer: {
      GPU: { price: "Rs. 45,000 - 450,000", time: "Same Day Dispatch", warranty: "1-3 Years Warranty" },
      CPU: { price: "Rs. 22,000 - 180,000", time: "24h Express Ship", warranty: "3 Years Warranty" },
      RAM: { price: "Rs. 6,500 - 48,000", time: "Instant Stock", warranty: "Lifetime Warranty" },
      Storage: { price: "Rs. 8,000 - 65,000", time: "Same Day Ship", warranty: "5 Years Warranty" },
    },
    Laptop: {
      Display: { price: "Rs. 12,500 - 55,000", time: "24-48h Delivery", warranty: "6 Months Warranty" },
      Battery: { price: "Rs. 5,500 - 24,000", time: "In Stock", warranty: "6 Months Warranty" },
      Keyboard: { price: "Rs. 3,200 - 12,000", time: "In Stock", warranty: "3 Months Warranty" },
      Charger: { price: "Rs. 3,800 - 14,500", time: "Same Day Ship", warranty: "6 Months Warranty" },
    },
    Mobile: {
      Display: { price: "Rs. 4,500 - 75,000", time: "Original OEM Grade", warranty: "Tested & Verified" },
      Battery: { price: "Rs. 2,800 - 16,000", time: "100% Health Cell", warranty: "3 Months Warranty" },
      Motherboard: { price: "Rs. 12,000 - 110,000", time: "Tested & Unlocked", warranty: "Tested Verified" },
      Camera: { price: "Rs. 3,500 - 28,000", time: "Original Pulls", warranty: "7 Days Replacement" },
    }
  };

  const currentEst = ESTIMATOR_DATA[calcDevice]?.[calcPart] || { price: "Rs. 5,000+", time: "24 Hours", warranty: "Warranty Included" };

  const filteredProducts = displayParts.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-[#D8973C] selection:text-white">
      
      {/* Top Banner Announcement Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-3">
        <span className="bg-[#D8973C] text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Fast Shipping</span>
        <span>Free Express Delivery Across Pakistan On Orders Above Rs. 15,000 | 100% Genuine Guaranteed</span>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (CLEAN LIGHT THEME) */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Official Tech & Repair Spare Parts Store</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-grotesk text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Your One-Stop Shop For <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-700 to-[#D8973C]">
                Original & Genuine
              </span> Tech Parts
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8">
              Computer GPUs, CPUs, SSDs, Laptop screens, batteries, and mobile spare parts — verified serial numbers with official warranty across Pakistan.
            </p>

            {/* Clean Quick Search Form */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-xl mb-8">
              <div className="relative flex items-center shadow-lg rounded-2xl bg-white border border-slate-200 p-1.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3 mr-2" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search e.g. 'RTX 4080', 'MacBook Screen', 'Samsung Battery'..."
                  className="w-full bg-transparent text-slate-900 text-sm placeholder-slate-400 focus:outline-none py-2 pr-2"
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-md"
                >
                  Search
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Popular Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-400">Popular:</span>
                {["RTX GPUs", "MacBook Battery", "Samsung Display", "NVMe SSD"].map((tag) => (
                  <button 
                    key={tag}
                    type="button"
                    onClick={() => setSearchQuery(tag)}
                    className="bg-slate-200/60 hover:bg-indigo-50 hover:text-indigo-600 px-2.5 py-1 rounded-md text-slate-600 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/computerparts" 
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-7 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-[#D8973C]" />
                <span>Explore Shop Catalog</span>
              </Link>

              <Link 
                to="/appointment" 
                className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold px-7 py-3.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <Wrench className="w-4 h-4 text-indigo-600" />
                <span>Book Repair Appointment</span>
              </Link>
            </div>

          </motion.div>

          {/* Right Visual Product Cards (Replacing heavy 3D model with crisp clean cards) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Background Decorative Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-100/70 rounded-full blur-3xl -z-10" />

            {/* Main Featured Light Card */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative">
              
              {/* Product Badge Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>In Stock & Ready To Ship</span>
                </span>
                <span className="text-xs font-bold text-slate-400">ID: #PD-4090</span>
              </div>

              {/* Product Image */}
              <div className="w-full h-56 rounded-2xl bg-slate-100 overflow-hidden mb-5 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80" 
                  alt="RTX Graphics Card"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-md">
                  ⭐ 4.9 (48 Reviews)
                </div>
              </div>

              {/* Product Info */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Computer Parts</div>
                  <h3 className="font-grotesk font-extrabold text-slate-900 text-lg">NVIDIA GeForce RTX 4080</h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Official Price</div>
                  <div className="font-grotesk text-xl font-extrabold text-slate-900">Rs. 345,000</div>
                </div>
              </div>

              {/* Trust Status Strip */}
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    🚚
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 leading-tight">Express Delivery</div>
                    <div className="text-[10px] text-slate-500">Shipped in 24-48h</div>
                  </div>
                </div>

                <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    🛡️
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 leading-tight">100% Genuine</div>
                    <div className="text-[10px] text-slate-500">Official Warranty</div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. CATEGORY TILES (APPLE & BEST BUY STYLE) */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES_SUMMARY.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link 
                key={cat.id} 
                to={cat.path}
                className={`bg-white rounded-2xl p-6 border ${cat.border} shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${cat.iconBg} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                      {cat.itemCount}
                    </span>
                  </div>

                  <h3 className="font-grotesk text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                  <span>Browse Category</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. INSTANT REPAIR & PART FINDER ESTIMATOR WIDGET */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-3">
                <Wrench className="w-3.5 h-3.5" />
                <span>Instant Estimator</span>
              </span>
              <h2 className="font-grotesk text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                Find Exact Part & Repair Cost
              </h2>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Select your device and required part to calculate price estimate and book an appointment with our expert technicians.
              </p>
              <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Free Compatibility Consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Original Parts With Serial Warranty</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              
              {/* Select Device */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">1. Select Device</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { type: "Computer", icon: Monitor },
                    { type: "Laptop", icon: Laptop },
                    { type: "Mobile", icon: Smartphone }
                  ].map(({ type, icon: Icon }) => (
                    <button
                      key={type}
                      onClick={() => {
                        setCalcDevice(type);
                        setCalcPart(Object.keys(ESTIMATOR_DATA[type])[0]);
                      }}
                      className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        calcDevice === type
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Component */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">2. Select Component</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.keys(ESTIMATOR_DATA[calcDevice]).map((partKey) => (
                    <button
                      key={partKey}
                      onClick={() => setCalcPart(partKey)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                        calcPart === partKey
                          ? "bg-slate-900 text-white font-bold"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {partKey}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimator Result Box */}
              <div className="bg-white p-4 rounded-xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Estimated Price Range</div>
                  <div className="font-grotesk text-xl font-extrabold text-indigo-700">{currentEst.price}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    ⏱️ {currentEst.time} • 🛡️ {currentEst.warranty}
                  </div>
                </div>

                <Link 
                  to={`/appointment?device=${calcDevice}&part=${calcPart}`}
                  className="w-full sm:w-auto bg-[#D8973C] hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 shadow-md transition-all whitespace-nowrap"
                >
                  <span>Book Appointment</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. FEATURED PRODUCTS CATALOG GRID */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">Genuine Catalog</span>
            <h2 className="font-grotesk text-3xl font-extrabold text-slate-900">Featured & Trending Parts</h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Parts" },
              { id: "Computer Parts", label: "Computer" },
              { id: "Laptop Parts", label: "Laptop" },
              { id: "Mobile Parts", label: "Mobile" }
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.slice(0, 6).map((item) => (
            <div 
              key={item.id || item._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="w-full h-48 rounded-xl bg-slate-100 overflow-hidden mb-4 relative">
                  <img 
                    src={item.image || item.img || "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80"} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {item.tag || item.stock || "In Stock"}
                  </span>
                </div>

                {/* Info */}
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  {item.category}
                </div>
                <h3 className="font-grotesk font-bold text-slate-900 text-base mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {item.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs text-slate-500 font-medium ml-1">
                    ({item.rating || 4.9})
                  </span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Price</span>
                  <span className="font-grotesk text-lg font-extrabold text-slate-900">
                    {typeof item.price === 'number' ? `Rs. ${item.price.toLocaleString()}` : item.price}
                  </span>
                </div>

                <Link 
                  to={`/product/${item._id || item.id}`}
                  className="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white p-3 rounded-xl transition-all font-bold text-xs flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/computerparts" 
            className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-8 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all"
          >
            <span>View Full Inventory</span>
            <ArrowRight className="w-4 h-4 text-[#D8973C]" />
          </Link>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5. TRUST BADGES (4 PILLARS) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRUST_BADGES.map(({ icon: Icon, title, desc }, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-grotesk font-bold text-slate-900 text-base mb-1">{title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 6. BRANDS TICKER */}
      {/* ========================================================================= */}
      <section className="py-10 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
          Authorized Brands We Stock
        </div>
        <div className="flex overflow-hidden">
          <div className="flex gap-10 whitespace-nowrap animate-marquee">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span key={`${brand}-${i}`} className="font-grotesk text-xl font-bold text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer tracking-wider">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 7. CUSTOMER TESTIMONIALS */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Customer Reviews</span>
          <h2 className="font-grotesk text-3xl font-extrabold text-slate-900 mb-3">Trusted Across Pakistan</h2>
          <p className="text-sm text-slate-600">Read what PC builders and tech repair owners say about our genuine parts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-6 italic">"{t.text}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-grotesk font-bold text-slate-900 text-sm">{t.name}</h4>
                  <div className="text-[11px] text-slate-500">{t.role} • {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 8. NEWSLETTER & CTA */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-xl mx-auto relative z-10">
            <h2 className="font-grotesk text-3xl sm:text-4xl font-extrabold mb-3">
              Subscribe For Exclusive Deals & Stock Alerts
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mb-6">
              Get notified immediately when rare GPU stock, displays, or laptop batteries arrive in Pakistan.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-white text-sm placeholder-slate-400 border border-slate-700 focus:outline-none focus:border-[#D8973C]"
              />
              <button 
                type="submit"
                className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  subscribed 
                    ? "bg-emerald-500 text-white" 
                    : "bg-[#D8973C] text-slate-950 hover:bg-amber-500"
                }`}
              >
                {subscribed ? "Subscribed ✓" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}