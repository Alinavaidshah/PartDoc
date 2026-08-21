import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchParts } from '../features/parts/partsSlice';
import PartCard from "../components/PartCard";
import PageSkeleton from "../components/PageSkeleton";
import { Search, Filter, Monitor } from 'lucide-react';

function ComputerParts() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.parts);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Price');

  useEffect(() => {
    dispatch(fetchParts());
  }, [dispatch]);

  const filteredData = items.filter(part => {
    const cat = part.category?.toLowerCase().trim();
    const subCat = part.subCategory?.toLowerCase().trim();
    const filterCat = categoryFilter.toLowerCase().trim();
    const search = searchTerm.toLowerCase().trim();

    const isComputerOrLaptop = (!cat || cat.includes('computer') || cat.includes('laptop') || cat !== 'mobile');
    const matchesCategory = (filterCat === 'all') || (subCat === filterCat) || (cat === filterCat);
    const matchesSearch = part.name?.toLowerCase().includes(search);

    return isComputerOrLaptop && matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'Price') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'Name') return (a.name || '').localeCompare(b.name || '');
    return 0;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 md:px-8 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-10 text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-200">
            <Monitor className="w-3.5 h-3.5" />
            <span>High-Performance Computer Hardware</span>
          </div>
          <h1 className="font-grotesk text-3xl md:text-5xl font-extrabold text-slate-900 mb-3">
            Computer Components & Parts
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Browse verified GPUs, CPUs, Motherboards, RAM, and Storage with official serial warranty across Pakistan.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 mb-10 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search computer components..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          
          <select 
            onChange={(e) => setCategoryFilter(e.target.value)} 
            className="bg-slate-50 text-slate-800 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
          >
            <option value="All">All Categories</option>
            <option value="Motherboard">Motherboard</option>
            <option value="Casing">PC Casing</option>
            <option value="Mouse">Mouse</option>
            <option value="Keyboard">Keyboard</option>
          </select>

          <select 
            onChange={(e) => setSortBy(e.target.value)} 
            className="bg-slate-50 text-slate-800 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
          >
            <option value="Price">Sort by Price</option>
            <option value="Name">Sort by Name</option>
          </select>
        </motion.div>

        {/* Grid Container */}
        {loading ? (
          <PageSkeleton />
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
          >
            <AnimatePresence mode="popLayout">
              {filteredData.length > 0 ? (
                filteredData.map((part) => (
                  <motion.div 
                    key={part._id || part.id} 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full flex justify-center"
                  >
                    <PartCard part={part} />
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-16 text-center">
                  <p className="text-slate-500 font-medium text-base mb-2">No computer parts found matching your filter criteria.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
                    className="text-xs text-indigo-600 font-bold hover:underline"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ComputerParts;