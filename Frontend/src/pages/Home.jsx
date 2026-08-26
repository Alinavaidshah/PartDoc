import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchParts } from "../features/parts/partsSlice";
import { addToCart } from "../features/cart/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import AestheticLoader from "../components/AestheticLoader";
import Toast from "../components/Toast";
import { getImageUrl } from "../api/axiosConfig";
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
  ShoppingBag,
  Clock,
  Check,
  Cpu,
  Layers,
  ArrowUpRight,
  Zap
} from "lucide-react";

// Mock Products Fallback
const MOCK_PRODUCTS = [
  {
    _id: "m1",
    name: "NVIDIA GeForce RTX 4080 Super 16GB",
    category: "Computer",
    price: 345000,
    rating: 4.9,
    countInStock: 10,
    tag: "Top Seller",
    image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80",
    description: "Ultra-fast graphics card for high-end gaming and 4K rendering."
  },
  {
    _id: "m2",
    name: "Intel Core i9-14900K Processor",
    category: "Computer",
    price: 185000,
    rating: 4.9,
    countInStock: 15,
    tag: "High Speed",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&q=80",
    description: "24 cores and 32 threads for extreme desktop performance."
  },
  {
    _id: "m3",
    name: "Samsung 990 PRO 2TB NVMe SSD",
    category: "Computer",
    price: 48000,
    rating: 4.9,
    countInStock: 25,
    tag: "Blazing Fast",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80",
    description: "Read speeds up to 7450 MB/s for instant load times."
  },
  {
    _id: "m4",
    name: "iPhone 15 Pro Max Dynamic OLED Screen",
    category: "Mobile",
    price: 65000,
    rating: 5.0,
    countInStock: 8,
    tag: "Original OEM",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
    description: "Original Super Retina XDR OLED display assembly."
  },
  {
    _id: "m5",
    name: "Samsung Galaxy S24 Ultra Battery 5000mAh",
    category: "Mobile",
    price: 14500,
    rating: 4.8,
    countInStock: 20,
    tag: "100% Health",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&q=80",
    description: "Authentic replacement battery with 100% health grade."
  },
  {
    _id: "m6",
    name: "Corsair Vengeance RGB 32GB DDR5 RAM",
    category: "Computer",
    price: 38000,
    rating: 4.9,
    countInStock: 30,
    tag: "Gaming RAM",
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&q=80",
    description: "6000MHz CL36 high-speed desktop memory with dynamic RGB."
  }
];

const CATEGORIES_SUMMARY = [
  {
    id: "Computer",
    title: "Computer Parts",
    subtitle: "GPUs, CPUs, RAM, Motherboards & SSDs",
    itemCount: "1,200+ Parts",
    icon: Monitor,
    color: "from-amber-500/20 to-orange-500/10",
    glow: "rgba(216,151,60,0.15)",
    path: "/computerparts"
  },
  {
    id: "Laptop",
    title: "Laptop Parts",
    subtitle: "Displays, Batteries, Keyboards & Chargers",
    itemCount: "850+ Parts",
    icon: Laptop,
    color: "from-indigo-500/20 to-blue-500/10",
    glow: "rgba(99,102,241,0.15)",
    path: "/computerparts?category=laptop"
  },
  {
    id: "Mobile",
    title: "Mobile Parts",
    subtitle: "AMOLED Displays, Logic Boards & Cameras",
    itemCount: "1,500+ Parts",
    icon: Smartphone,
    color: "from-emerald-500/20 to-teal-500/10",
    glow: "rgba(16,185,129,0.15)",
    path: "/mobileparts"
  },
  {
    id: "Repair",
    title: "Repair & Services",
    subtitle: "Professional technician booking & repair",
    itemCount: "24/7 Priority",
    icon: Wrench,
    color: "from-purple-500/20 to-pink-500/10",
    glow: "rgba(168,85,247,0.15)",
    path: "/appointment"
  }
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Hamza Iqbal",
    location: "Lahore",
    role: "Custom PC Builder",
    text: "Ordered an RTX 4080 Super. Delivery took under 36 hours. 100% genuine part with official serial verification!",
    rating: 5,
    avatar: "HI"
  },
  {
    id: 2,
    name: "Sana Malik",
    location: "Karachi",
    role: "Video Editor",
    text: "My MacBook battery had swollen. Ordered OEM replacement screen & battery from PartDoc. Installed smoothly, performance is like new!",
    rating: 5,
    avatar: "SM"
  },
  {
    id: 3,
    name: "Bilal Ahmed",
    location: "Rawalpindi",
    role: "Repair Shop Owner",
    text: "I buy wholesale mobile displays and motherboards from PartDoc. Market prices are competitive, zero defect rate, and fast customer response.",
    rating: 5,
    avatar: "BA"
  }
];

const TRUST_BADGES = [
  { icon: ShieldCheck, title: "100% Genuine Guarantee", desc: "Sourced directly with official serial verification." },
  { icon: Truck, title: "Nationwide Express Delivery", desc: "Safely packaged & delivered in 24-48 hours across Pakistan." },
  { icon: Award, title: "Warranty Protected", desc: "Complete peace of mind with manufacturer warranty protection." },
  { icon: Headphones, title: "24/7 Expert Technical Support", desc: "Talk directly with technicians to check exact component compatibility." }
];

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: fetchedParts, loading } = useSelector((state) => state.parts);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [addedItem, setAddedItem] = useState(null);

  // Estimator Widget State
  const [calcDevice, setCalcDevice] = useState("Computer");
  const [calcPart, setCalcPart] = useState("GPU");

  useEffect(() => {
    dispatch(fetchParts());
  }, [dispatch]);

  const displayParts = (fetchedParts && fetchedParts.length > 0) ? fetchedParts : MOCK_PRODUCTS;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/computerparts?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAddToCart = (part) => {
    dispatch(addToCart({ ...part, qty: 1 }));
    setAddedItem(part._id);
    setToastMsg(`${part.name} added to cart!`);
    setShowToast(true);
    setTimeout(() => setAddedItem(null), 1800);
  };

  // Estimator Price Table
  const ESTIMATOR_DATA = {
    Computer: {
      GPU: { price: "PKR 45,000 - 450,000", time: "Same Day Dispatch", warranty: "1-3 Years Warranty" },
      CPU: { price: "PKR 22,000 - 180,000", time: "24h Express Ship", warranty: "3 Years Warranty" },
      RAM: { price: "PKR 6,500 - 48,000", time: "Instant Stock", warranty: "Lifetime Warranty" },
      Storage: { price: "PKR 8,000 - 65,000", time: "Same Day Ship", warranty: "5 Years Warranty" },
    },
    Laptop: {
      Display: { price: "PKR 12,500 - 55,000", time: "24-48h Delivery", warranty: "6 Months Warranty" },
      Battery: { price: "PKR 5,500 - 24,000", time: "In Stock", warranty: "6 Months Warranty" },
      Keyboard: { price: "PKR 3,200 - 12,000", time: "In Stock", warranty: "3 Months Warranty" },
      Charger: { price: "PKR 3,800 - 14,500", time: "Same Day Ship", warranty: "6 Months Warranty" },
    },
    Mobile: {
      Display: { price: "PKR 4,500 - 75,000", time: "Original OEM Grade", warranty: "Tested & Verified" },
      Battery: { price: "PKR 2,800 - 16,000", time: "100% Health Cell", warranty: "3 Months Warranty" },
      Motherboard: { price: "PKR 12,000 - 110,000", time: "Tested & Unlocked", warranty: "Tested Verified" },
      Camera: { price: "PKR 3,500 - 28,000", time: "Original Pulls", warranty: "7 Days Replacement" },
    }
  };

  const currentEst = ESTIMATOR_DATA[calcDevice]?.[calcPart] || { price: "PKR 5,000+", time: "24 Hours", warranty: "Warranty Included" };

  const filteredProducts = displayParts.filter((item) => {
    if (activeCategory === "all") return true;
    const cat = item.category?.toLowerCase() || '';
    const act = activeCategory.toLowerCase();
    return cat.includes(act) || act.includes(cat);
  });

  if (loading) {
    return <AestheticLoader text="Loading PartDoc Catalog..." />;
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-[#D8973C] selection:text-black overflow-x-hidden pt-20">
      
      <Toast message={toastMsg} isOpen={showToast} onClose={() => setShowToast(false)} />

      {/* Top Banner Announcement Strip */}
      <div className="bg-gradient-to-r from-[#0d131f] via-[#151d2c] to-[#0d131f] border-b border-white/5 text-xs py-2.5 px-4 text-center text-slate-300 font-medium flex items-center justify-center gap-3">
        <span className="bg-[#D8973C] text-black font-extrabold px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
          FAST DELIVERY
        </span>
        <span>Free Express Delivery Across Pakistan On Orders Above PKR 15,000 | 100% Genuine Guaranteed</span>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (QODIXERA SLEEK DARK THEME WITH GLOWING ACCENTS) */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-24 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-indigo-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold mb-6 backdrop-blur-md shadow-inner">
              <Zap className="w-4 h-4 text-[#D8973C]" />
              <span>Pakistan's Premier Tech Parts & Repair Portal</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-grotesk text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
              Empowering Tech With <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D8973C] via-amber-200 to-indigo-400">
                Original Spare Parts
              </span> & Priority Repair
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mb-8">
              Discover authentic GPUs, CPUs, SSDs, screens, batteries, and logic boards with official serial verification and nationwide fast delivery.
            </p>

            {/* Clean Quick Search Form */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-xl mb-8">
              <div className="relative flex items-center rounded-2xl bg-[#0f172a]/90 border border-white/10 p-2 focus-within:border-[#D8973C] focus-within:ring-2 focus-within:ring-[#D8973C]/20 transition-all shadow-2xl backdrop-blur-xl">
                <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 flex-shrink-0" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search e.g. 'RTX 4080', 'iPhone Display', 'MacBook Battery'..."
                  className="w-full bg-transparent text-white text-sm placeholder-slate-500 focus:outline-none py-2 pr-2"
                />
                <button 
                  type="submit"
                  className="bg-[#D8973C] hover:bg-amber-500 text-black text-xs font-extrabold uppercase tracking-wider px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg flex-shrink-0"
                >
                  Search
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Popular Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
                <span className="font-semibold text-slate-500">Trending:</span>
                {["RTX 4080", "MacBook Battery", "Samsung Display", "NVMe SSD"].map((tag) => (
                  <button 
                    key={tag}
                    type="button"
                    onClick={() => setSearchQuery(tag)}
                    className="bg-white/5 hover:bg-white/10 border border-white/5 px-2.5 py-1 rounded-md text-slate-300 transition-colors"
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
                className="bg-[#D8973C] hover:bg-amber-400 text-black font-extrabold px-8 py-4 rounded-xl text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(216,151,60,0.3)] hover:scale-[1.02] transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Catalog</span>
              </Link>

              <Link 
                to="/appointment" 
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-xl text-sm flex items-center gap-2 backdrop-blur-md transition-all"
              >
                <Wrench className="w-4 h-4 text-[#D8973C]" />
                <span>Book Appointment</span>
              </Link>
            </div>

          </motion.div>

          {/* Right Visual Product Feature Glass Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Main Featured Glass Card */}
            <div className="bg-[#0f172a]/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#D8973C]/10 rounded-full blur-2xl group-hover:bg-[#D8973C]/20 transition-all" />

              {/* Product Badge Header */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified OEM Genuine</span>
                </span>
                <span className="text-xs font-mono text-slate-500">SKU: #PD-4080S</span>
              </div>

              {/* Product Image */}
              <div className="w-full h-60 rounded-2xl bg-[#07090e] border border-white/5 overflow-hidden mb-5 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80" 
                  alt="RTX Graphics Card"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-amber-400 border border-white/10 shadow-md">
                  ⭐ 4.9 (48 Reviews)
                </div>
              </div>

              {/* Product Info */}
              <div className="flex items-center justify-between relative z-10 mb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#D8973C]">Computer Component</div>
                  <h3 className="font-grotesk font-extrabold text-white text-lg">RTX 4080 Super 16GB</h3>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Special Price</div>
                  <div className="font-grotesk text-xl font-extrabold text-[#D8973C]">PKR 345,000</div>
                </div>
              </div>

              {/* Trust Status Strip */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-white">Express Delivery</div>
                    <div className="text-[10px] text-slate-400">24-48 Hours</div>
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-white">Official Warranty</div>
                    <div className="text-[10px] text-slate-400">Verified Serial</div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CATEGORIES TILES (FUTURISTIC GLASS TILES) */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-grotesk">Browse By Category</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Explore our verified catalog of spare components.</p>
          </div>
          <Link to="/computerparts" className="text-xs font-bold text-[#D8973C] hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES_SUMMARY.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link 
                  to={cat.path}
                  className="bg-[#0f172a]/60 hover:bg-[#0f172a] rounded-2xl p-6 border border-white/10 hover:border-[#D8973C]/50 transition-all duration-300 group flex flex-col justify-between h-full backdrop-blur-xl hover:shadow-[0_0_30px_rgba(216,151,60,0.15)]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-[#D8973C]" />
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
                        {cat.itemCount}
                      </span>
                    </div>

                    <h3 className="font-grotesk font-extrabold text-white text-lg mb-1 group-hover:text-[#D8973C] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{cat.subtitle}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#D8973C]">
                    <span>Explore Products</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE HARDWARE REPAIR & COST ESTIMATOR WIDGET */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#0f172a] via-[#07090e] to-[#111827] rounded-3xl border border-white/10 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mb-8">
            <span className="bg-[#D8973C]/10 text-[#D8973C] border border-[#D8973C]/20 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3">
              INSTANT HARDWARE ESTIMATOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-grotesk">
              Estimate Component Costs & Repair Timeline
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Select your device and target component to view estimated price range, warranty period, and delivery window.
            </p>
          </div>

          {/* Device Switcher */}
          <div className="flex flex-wrap gap-3 mb-8">
            {["Computer", "Laptop", "Mobile"].map((dev) => (
              <button
                key={dev}
                onClick={() => {
                  setCalcDevice(dev);
                  setCalcPart(Object.keys(ESTIMATOR_DATA[dev])[0]);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                  calcDevice === dev
                    ? "bg-[#D8973C] text-black shadow-[0_0_20px_rgba(216,151,60,0.3)]"
                    : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                }`}
              >
                {dev}
              </button>
            ))}
          </div>

          {/* Component Switcher */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.keys(ESTIMATOR_DATA[calcDevice] || {}).map((partKey) => (
              <button
                key={partKey}
                onClick={() => setCalcPart(partKey)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  calcPart === partKey
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                {partKey}
              </button>
            ))}
          </div>

          {/* Estimator Display Output Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/40 border border-white/10 p-6 rounded-2xl mb-8 backdrop-blur-md">
            <div>
              <div className="text-xs text-slate-400 mb-1">Estimated Price Range</div>
              <div className="font-grotesk text-xl font-extrabold text-[#D8973C]">{currentEst.price}</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 mb-1">Dispatch / Repair Window</div>
              <div className="font-grotesk text-base font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                {currentEst.time}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400 mb-1">Warranty Period</div>
              <div className="font-grotesk text-base font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                {currentEst.warranty}
              </div>
            </div>
          </div>

          <Link
            to={`/appointment?device=${encodeURIComponent(calcDevice)}&part=${encodeURIComponent(calcPart)}`}
            className="inline-flex items-center gap-2 bg-[#D8973C] hover:bg-amber-400 text-black font-extrabold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
          >
            <span>Book Priority Slot For {calcDevice} ({calcPart})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED PRODUCTS CATALOG GRID */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-grotesk">Featured Catalog</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Verified components in stock and ready to ship.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
            {["all", "Computer", "Mobile", "Laptop"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#D8973C] text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat === "all" ? "All Parts" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((item, idx) => (
              <motion.div
                key={item._id || idx}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-[#0f172a]/70 hover:bg-[#0f172a] rounded-2xl border border-white/10 hover:border-[#D8973C]/50 p-5 transition-all group backdrop-blur-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-48 rounded-xl bg-black/40 border border-white/5 overflow-hidden mb-4 relative">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/300'}
                    />
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur text-amber-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border border-white/10">
                      {item.category || "Part"}
                    </span>
                  </div>

                  <h3 className="font-grotesk font-extrabold text-white text-base mb-2 group-hover:text-[#D8973C] transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {item.description || "Genuine high-performance replacement component."}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Stock: {item.countInStock || 10} units</div>
                    <div className="font-grotesk font-black text-lg text-[#D8973C]">
                      PKR {Number(item.price).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/product/${item._id}`}
                      className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors"
                      title="View Details"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                        addedItem === item._id
                          ? "bg-emerald-500 text-black shadow-md"
                          : "bg-[#D8973C] hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(216,151,60,0.2)]"
                      }`}
                    >
                      {addedItem === item._id ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                      <span>{addedItem === item._id ? "Added" : "Add"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TRUST BADGES / FEATURES */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <div 
                key={i}
                className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#D8973C]/10 border border-[#D8973C]/20 flex items-center justify-center text-[#D8973C] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-grotesk font-bold text-white text-base mb-1">{b.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TESTIMONIALS SECTION */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[#D8973C] text-xs font-bold uppercase tracking-widest">TESTIMONIALS</span>
          <h2 className="text-3xl font-extrabold text-white font-grotesk mt-1">Trusted By Tech Enthusiasts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div 
              key={t.id}
              className="bg-[#0f172a]/60 p-6 rounded-2xl border border-white/10 backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-[#D8973C] mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D8973C]" />
                  ))}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed mb-6">"{t.text}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-[#D8973C] text-black font-extrabold text-xs flex items-center justify-center">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-white text-xs">{t.name}</div>
                  <div className="text-[10px] text-slate-400">{t.role} · {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}