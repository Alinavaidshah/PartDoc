import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchParts } from '../features/parts/partsSlice';
import PartCard from "../components/PartCard";
import PageSkeleton from "../components/PageSkeleton";

export default function MobileParts() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.parts);
  
  // States for filtering & searching
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Default');

  useEffect(() => {
    dispatch(fetchParts('mobile')); // Sirf mobile parts fetch karega
  }, [dispatch]);

  // Filtering & Sorting Logic
  const filteredData = items.filter(part => {
    const search = searchTerm.toLowerCase().trim();
    const brandMatch = brandFilter === 'All' || part.brand === brandFilter;
    const nameMatch = part.name?.toLowerCase().includes(search);
    
    return brandMatch && nameMatch;
  }).sort((a, b) => {
    if (sortBy === 'priceLow') return a.price - b.price;
    if (sortBy === 'priceHigh') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#101e23] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Mobile Components</h1>
          <p className="text-gray-400 text-lg">Premium, authenticated replacement parts for high-end devices.</p>
        </div>

        {/* Filter Controls (Search + Filter + Sort) */}
        <div className="flex flex-wrap gap-4 mb-12">
          <input 
            type="text" 
            placeholder="Search mobile parts..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1a2d33] text-white px-6 py-3 rounded-xl border border-white/10 outline-none hover:border-[#ff9100] transition-colors flex-1 min-w-[250px]"
          />
          
          <select 
            onChange={(e) => setBrandFilter(e.target.value)} 
            className="bg-[#1a2d33] text-white px-6 py-3 rounded-xl border border-white/10 outline-none hover:border-[#ff9100] transition-colors cursor-pointer"
          >
            <option value="All">All Brands</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Xiaomi">Xiaomi</option>
          </select>

          <select 
            onChange={(e) => setSortBy(e.target.value)} 
            className="bg-[#1a2d33] text-white px-6 py-3 rounded-xl border border-white/10 outline-none hover:border-[#ff9100] transition-colors cursor-pointer"
          >
            <option value="Default">Sort by Price</option>
            <option value="priceLow">Low to High</option>
            <option value="priceHigh">High to Low</option>
          </select>
        </div>

        {/* Grid Container with Scroll Animation */}
        {loading ? (
          <PageSkeleton />
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {filteredData.length > 0 ? (
                filteredData.map((part) => (
                  <motion.div 
                    key={part._id} 
                    // Scroll Reveal Animation
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full flex justify-center"
                  >
                    <PartCard part={part} />
                  </motion.div>
                ))
              ) : (
                <div className="text-[#ff9100] w-full text-center mt-10">
                  <p>No mobile parts found matching your criteria.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}