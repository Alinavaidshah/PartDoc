import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchParts } from '../features/parts/partsSlice';
import PartCard from "../components/PartCard";
import PageSkeleton from "../components/PageSkeleton";

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

    const isComputerOrLaptop = (cat === 'computer' || cat === 'laptop');
    const matchesCategory = (filterCat === 'all') || (subCat === filterCat);
    const matchesSearch = part.name?.toLowerCase().includes(search);

    return isComputerOrLaptop && matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'Price') return a.price - b.price;
    if (sortBy === 'Name') return a.name.localeCompare(b.name);
    return 0;
  });

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#101e23] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Computer Components</h1>
          <p className="text-gray-400 text-lg">High-performance parts for your ultimate setup.</p>
        </motion.div>

        {/* Filter Controls with Smooth Hover & Focus */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          <input 
            type="text" 
            placeholder="Search components..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1a2d33] text-white px-6 py-3 rounded-xl border border-white/10 outline-none focus:border-[#D8973C] transition-all duration-300 flex-1 min-w-[250px] shadow-lg"
          />
          
          {['categoryFilter', 'sortBy'].map((filterType) => (
            <motion.select 
              key={filterType}
              whileHover={{ scale: 1.02 }}
              onChange={(e) => filterType === 'categoryFilter' ? setCategoryFilter(e.target.value) : setSortBy(e.target.value)} 
              className="bg-[#1a2d33] text-white px-6 py-3 rounded-xl border border-white/10 outline-none focus:border-[#D8973C] transition-all cursor-pointer shadow-lg hover:bg-[#20363d]"
            >
              {filterType === 'categoryFilter' ? (
                <>
                  <option value="All">All Categories</option>
                  <option value="Motherboard">Motherboard</option>
                  <option value="Casing">PC Casing</option>
                  <option value="Mouse">Mouse</option>
                  <option value="Keyboard">Keyboard</option>
                </>
              ) : (
                <>
                  <option value="Price">Sort by Price</option>
                  <option value="Name">Sort by Name</option>
                </>
              )}
            </motion.select>
          ))}
        </motion.div>

        {/* Grid Container */}
        {loading ? (
          <PageSkeleton />
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredData.length > 0 ? (
                filteredData.map((part) => (
                  <motion.div 
                    key={part._id} 
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-full flex justify-center"
                  >
                    <PartCard part={part} />
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#D8973C] w-full text-center mt-10">
                  <p>No components found matching your filters.</p>
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