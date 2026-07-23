import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PartCard = ({ part }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);

  const trackWidth = 148; // total drag distance
  const arrowOpacity = useTransform(x, [0, trackWidth * 0.6], [1, 0]);
  const bgFill = useTransform(x, [0, trackWidth], ['0%', '100%']);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300';
    return imagePath.startsWith('http') ? imagePath : `http://localhost:5000${imagePath}`;
  };

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    if (info.offset.x > 120) {
      setIsLoading(true);
      x.set(trackWidth);
      setTimeout(() => {
        navigate(`/product/${part._id}`);
      }, 900);
    } else {
      x.set(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)' }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="w-64 bg-white rounded-[28px] p-5 flex flex-col shadow-md border border-black/5 h-[400px] select-none"
    >
      {/* Product Image */}
      <div className="relative h-36 flex justify-center items-center mb-4 rounded-2xl bg-[#f6f6f4] overflow-hidden">
        <motion.img
          key={part.image}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          src={getImageUrl(part.image)}
          alt={part.name}
          className="w-[80%] h-[80%] object-contain"
          onError={(e) => {
  if (e.target.src !== 'https://via.placeholder.com/300') {
    e.target.src = 'https://via.placeholder.com/300';
  }
}}
        />
        {part.category && (
          <span className="absolute top-2 left-2 text-[8px] font-bold tracking-widest uppercase bg-white/80 backdrop-blur px-2 py-1 rounded-full text-gray-600">
            {part.category}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-grow flex flex-col">
        <h2 className="text-lg font-semibold text-black mb-1 leading-tight line-clamp-2">
          {part.name}
        </h2>

        <div className="flex items-baseline gap-2 mt-1 mb-3">
          <span className="text-xl font-bold text-black">
            PKR {Number(part.price ?? 0).toFixed(2)}
          </span>
          {part.oldPrice && (
            <span className="text-xs text-gray-400 line-through">
             PKR {Number(part.oldPrice).toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex-grow" />
      </div>

      {/* Swipe to Buy Button */}
      <div className="relative bg-[#1f1f1f] rounded-full h-12 flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-[#D8973C]/25 rounded-full"
          style={{ width: bgFill }}
        />

        <motion.span
          style={{ opacity: arrowOpacity }}
          className="w-full text-center text-white/70 text-[9px] font-bold tracking-[0.15em] uppercase pointer-events-none"
        >
          Swipe to buy
        </motion.span>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: trackWidth }}
          dragElastic={0.08}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.08 }}
          animate={!isDragging && !isLoading ? { x: 0 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{ x }}
          className="w-10 h-10 ml-1 bg-[#D8973C] rounded-full absolute z-20 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
            ) : (
              <motion.span
                key="arrow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white font-bold"
              >
                →
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PartCard;