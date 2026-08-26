import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Palette, Loader2, CheckCircle2 } from 'lucide-react';

const PRESET_COLORS = [
  'Space Black', 'Silver', 'Space Gray', 'Midnight Blue', 'Gold', 'Rose Gold', 'Alpine White', 'Titanium', 'Red'
];

const EditPartModal = ({ isOpen, onClose, part, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '', brand: '', price: '', category: 'Mobile', countInStock: '', description: '',
    hasGrades: true, refurbishedPrice: '', brandNewPrice: '',
    hasColors: false, colors: []
  });

  const [selectedColors, setSelectedColors] = useState([]);
  const [customColorInput, setCustomColorInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (part) {
      setFormData({
        name: part.name || '',
        brand: part.brand || '',
        price: part.price || '',
        category: part.category || 'Mobile',
        countInStock: part.countInStock || '',
        description: part.description || '',
        hasGrades: part.hasGrades !== undefined ? part.hasGrades : true,
        refurbishedPrice: part.refurbishedPrice || part.price || '',
        brandNewPrice: part.brandNewPrice || (part.price ? Number(part.price) + 5000 : ''),
        hasColors: part.hasColors !== undefined ? part.hasColors : (part.colors && part.colors.length > 0),
      });

      setSelectedColors(Array.isArray(part.colors) ? part.colors : []);
    }
  }, [part]);

  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleAddCustomColor = (e) => {
    e.preventDefault();
    if (customColorInput.trim() && !selectedColors.includes(customColorInput.trim())) {
      setSelectedColors([...selectedColors, customColorInput.trim()]);
      setCustomColorInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      colors: selectedColors
    };

    try {
      await api.put(`/parts/${part._id}`, payload);
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onUpdate();
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to update part: " + (err.response?.data?.message || err.message));
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)',
    boxSizing: 'border-box', outline: 'none', fontSize: '13px', background: '#262626',
    color: '#ffffff', fontWeight: '500', transition: 'all 0.2s ease'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyCenter: 'center', padding: '16px', overflowY: 'auto' }}>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: -1 }} 
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            style={{ background: '#171717', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '580px', margin: 'auto', color: 'white', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#fff' }}>Edit Part Details</h2>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#a3a3a3' }}>Modify pricing, grade options, stock, and colors.</p>
              </div>
              <X onClick={onClose} style={{ cursor: 'pointer', color: '#a3a3a3' }} size={20} />
            </div>

            {showSuccess ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ textAlign: 'center', padding: '40px 0', color: '#10b981' }}>
                <CheckCircle2 size={60} style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>Part Updated Successfully!</h3>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* NAME & BRAND */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#a3a3a3', marginBottom: '4px', textTransform: 'uppercase' }}>Part Name</label>
                    <input placeholder="Part Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#a3a3a3', marginBottom: '4px', textTransform: 'uppercase' }}>Brand</label>
                    <input placeholder="Brand" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} style={inputStyle} required />
                  </div>
                </div>

                {/* CATEGORY & STOCK */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#a3a3a3', marginBottom: '4px', textTransform: 'uppercase' }}>Category</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                      <option value="Mobile">Mobile Parts</option>
                      <option value="Computer">Computer Parts</option>
                      <option value="Laptop">Laptop Parts</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#a3a3a3', marginBottom: '4px', textTransform: 'uppercase' }}>Stock Quantity</label>
                    <input type="number" placeholder="Stock" value={formData.countInStock} onChange={e => setFormData({...formData, countInStock: e.target.value})} style={inputStyle} required />
                  </div>
                </div>

                {/* GRADE OPTIONS TOGGLE */}
                <div style={{ background: '#262626', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#fff' }}>
                      <Layers size={16} color="#D8973C" />
                      <span>Grade Options (Refurbished vs Brand New)</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.hasGrades} 
                      onChange={(e) => setFormData({...formData, hasGrades: e.target.checked})}
                      style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#D8973C' }} 
                    />
                  </div>

                  {formData.hasGrades ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#a3a3a3' }}>Refurbished (Grade A) Price (PKR)</span>
                        <input type="number" placeholder="Refurbished Price" style={inputStyle} value={formData.refurbishedPrice || formData.price} onChange={(e) => setFormData({...formData, refurbishedPrice: e.target.value, price: e.target.value})} required />
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#a3a3a3' }}>Brand New (Sealed) Price (PKR)</span>
                        <input type="number" placeholder="Brand New Price" style={inputStyle} value={formData.brandNewPrice} onChange={(e) => setFormData({...formData, brandNewPrice: e.target.value})} required />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#a3a3a3' }}>Base Price (PKR)</span>
                      <input type="number" placeholder="Base Price" style={inputStyle} value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                    </div>
                  )}
                </div>

                {/* COLOR SELECTION PALETTE */}
                <div style={{ background: '#262626', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#fff' }}>
                      <Palette size={16} color="#D8973C" />
                      <span>Color Selection</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.hasColors} 
                      onChange={(e) => setFormData({...formData, hasColors: e.target.checked})}
                      style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#D8973C' }} 
                    />
                  </div>

                  {formData.hasColors && (
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                        {PRESET_COLORS.map(col => {
                          const isSelected = selectedColors.includes(col);
                          return (
                            <button
                              key={col}
                              type="button"
                              onClick={() => toggleColor(col)}
                              style={{
                                padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700',
                                border: isSelected ? '1.5px solid #D8973C' : '1px solid rgba(255,255,255,0.2)',
                                background: isSelected ? 'rgba(216,151,60,0.2)' : '#171717',
                                color: isSelected ? '#D8973C' : '#a3a3a3',
                                cursor: 'pointer', transition: 'all 0.15s ease'
                              }}
                            >
                              {isSelected ? `✓ ${col}` : col}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom color input */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          placeholder="Add custom color..."
                          style={{ ...inputStyle, padding: '8px 12px', fontSize: '11px', background: '#171717' }}
                          value={customColorInput}
                          onChange={(e) => setCustomColorInput(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomColor}
                          style={{ background: '#D8973C', color: '#000', border: 'none', padding: '0 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#a3a3a3', marginBottom: '4px', textTransform: 'uppercase' }}>Description</label>
                  <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ ...inputStyle, height: '80px', resize: 'none' }} required />
                </div>
                
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#D8973C', border: 'none', fontWeight: '800', color: '#000', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Update Part Information"}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditPartModal;