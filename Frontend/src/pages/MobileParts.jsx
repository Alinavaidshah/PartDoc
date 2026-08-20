import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchParts } from '../features/parts/partsSlice';
import PartCard from "../components/PartCard";
import PageSkeleton from "../components/PageSkeleton";
import { Search, Smartphone } from 'lucide-react';

export default function MobileParts() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.parts);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Default');

  useEffect(() => {
    dispatch(fetchParts('mobile'));
  }, [dispatch]);

  const filteredData = items.filter(part => {
    const search = searchTerm.toLowerCase().trim();
    const brandMatch = brandFilter === 'All' || part.brand === brandFilter;
    const nameMatch = part.name?.toLowerCase().includes(search);
    
    return brandMatch && nameMatch;
  }).sort((a, b) => {
    if (sortBy === 'priceLow') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'priceHigh') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 md:px-8 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-200">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Authenticated Mobile Spare Parts</span>
          </div>
          <h1 className="font-grotesk text-3xl md:text-5xl font-extrabold text-slate-900 mb-3">
            Mobile Replacement Parts
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Original AMOLED screens, batteries, motherboards & cameras for Apple, Samsung, Xiaomi & OnePlus.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-10 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search mobile parts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          
          <select 
            onChange={(e) => setBrandFilter(e.target.value)} 
            className="bg-slate-50 text-slate-800 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
          >
            <option value="All">All Brands</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Xiaomi">Xiaomi</option>
          </select>

          <select 
            onChange={(e) => setSortBy(e.target.value)} 
            className="bg-slate-50 text-slate-800 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
          >
            <option value="Default">Sort by Price</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>

        {/* Grid Container */}
        {loading ? (
          <PageSkeleton />
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
          >
            <AnimatePresence>
              {filteredData.length > 0 ? (
                filteredData.map((part) => (
                  <motion.div 
                    key={part._id || part.id} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex justify-center"
                  >
                    <PartCard part={part} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center text-slate-500 font-medium">
                  <p className="mb-2">No mobile parts found matching your criteria.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setBrandFilter('All'); }}
                    className="text-xs text-indigo-600 font-bold hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}