import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import { getImageUrl } from '../api/axiosConfig';

const PartCard = ({ part }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ ...part, quantity: 1 }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/product/${part._id}`)}
      className="w-full max-w-[280px] bg-white rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-xl border border-slate-200 hover:border-indigo-300 transition-all duration-300 cursor-pointer group"
    >
      <div>
        {/* Product Image Box */}
        <div className="relative h-44 w-full flex justify-center items-center mb-4 rounded-xl bg-slate-100 overflow-hidden border border-slate-100">
          <img
            src={getImageUrl(part.image)}
            alt={part.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80';
            }}
          />
          {part.category && (
            <span className="absolute top-2.5 left-2.5 text-[9px] font-extrabold tracking-wider uppercase bg-slate-900/80 backdrop-blur text-white px-2 py-0.5 rounded-md">
              {part.category}
            </span>
          )}
          <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-md shadow-sm">
            In Stock
          </span>
        </div>

        {/* Product Info */}
        <div className="flex items-center gap-1 mb-1.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-[11px] text-slate-500 font-semibold ml-1">(4.9)</span>
        </div>

        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-3 leading-snug">
          {part.name}
        </h3>
      </div>

      <div>
        {/* Price Tag */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium block">Price</span>
            <span className="text-base font-extrabold text-slate-900">
              PKR {Number(part.price ?? 0).toLocaleString()}
            </span>
          </div>
          {part.oldPrice && (
            <span className="text-xs text-slate-400 line-through">
              PKR {Number(part.oldPrice).toLocaleString()}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm ${
              added 
                ? "bg-emerald-600 text-white" 
                : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
            }`}
          >
            {added ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add Cart</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/product/${part._id}`)}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PartCard;