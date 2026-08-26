import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Palette, Loader2, CheckCircle2, Upload, ChevronDown } from 'lucide-react';
import { playSuccessSound } from '../utils/soundUtils';

const PRESET_COLORS = [
  'Space Black', 'Silver', 'Space Gray', 'Midnight Blue', 'Gold', 'Rose Gold', 'Alpine White', 'Titanium', 'Red'
];

const EditPartModal = ({ isOpen, onClose, part, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '', brand: '', price: '', category: 'Mobile', countInStock: '', description: '',
    hasGrades: true, refurbishedPrice: '', brandNewPrice: '',
    hasColors: false, image: null
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
        image: null
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

    const data = new FormData();
    for (let key in formData) {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }
    data.append('colors', JSON.stringify(selectedColors));

    try {
      await api.put(`/parts/${part._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      setShowSuccess(true);
      playSuccessSound();
      setTimeout(() => {
        setShowSuccess(false);
        if (onUpdate) onUpdate();
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to update part: " + (err.response?.data?.message || err.message));
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
    boxSizing: 'border-box', outline: 'none', fontSize: '13px', background: '#f8fafc',
    color: '#0f172a', fontWeight: '500', transition: 'all 0.2s ease'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px' }}>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: -1 }} 
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            style={{ 
              background: '#ffffff', padding: '28px', borderRadius: '24px', width: '100%', maxWidth: '580px', 
              maxHeight: '88vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', 
              border: '1px solid #e2e8f0' 
            }}
            className="custom-admin-scroll"
          >
            <style>{`
              .custom-admin-scroll::-webkit-scrollbar {
                width: 6px;
              }
              .custom-admin-scroll::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 8px;
              }
              .custom-admin-scroll::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 8px;
              }
              .custom-admin-scroll::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
              }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0f172a', fontFamily: 'sans-serif' }}>Edit Part Details</h2>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Modify pricing, image, grade options, stock, and colors.</p>
              </div>
              <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} color="#64748b" />
              </button>
            </div>

            {showSuccess ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ textAlign: 'center', padding: '40px 0', color: '#10b981' }}>
                <CheckCircle2 size={60} style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Part Information Updated!</h3>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* NAME & BRAND */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Part Name</label>
                    <input placeholder="Part Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Brand</label>
                    <input placeholder="Brand" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} style={inputStyle} required />
                  </div>
                </div>

                {/* CATEGORY & STOCK */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Category</label>
                    <div style={{ position: 'relative' }}>
                      <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                        <option value="Mobile">Mobile Parts</option>
                        <option value="Computer">Computer Parts</option>
                        <option value="Laptop">Laptop Parts</option>
                      </select>
                      <ChevronDown style={{ position: 'absolute', right: '12px', top: '12px', pointerEvents: 'none', color: '#64748b' }} size={16} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Stock Quantity</label>
                    <input type="number" placeholder="Stock" value={formData.countInStock} onChange={e => setFormData({...formData, countInStock: e.target.value})} style={inputStyle} required />
                  </div>
                </div>

                {/* IMAGE UPLOAD & PREVIEW */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Update Part Image (Optional)</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {part?.image && (
                      <img 
                        src={getImageUrl(part.image)} 
                        alt={part.name} 
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1' }} 
                      />
                    )}
                    <label style={{ ...inputStyle, flex: 1, border: '2px dashed #cbd5e1', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#f8fafc' }}>
                      <Upload size={16} color="#6366f1" />
                      <span style={{ fontSize: '12px', color: '#475569' }}>
                        {formData.image ? formData.image.name : "Click to Replace Existing Image"}
                      </span>
                      <input type="file" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} hidden />
                    </label>
                  </div>
                </div>

                {/* GRADE OPTIONS TOGGLE */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>
                      <Layers size={16} color="#6366f1" />
                      <span>Grade Options (Refurbished vs Brand New)</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.hasGrades} 
                      onChange={(e) => setFormData({...formData, hasGrades: e.target.checked})}
                      style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#6366f1' }} 
                    />
                  </div>

                  {formData.hasGrades ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b' }}>Refurbished (Grade A) Price (PKR)</span>
                        <input type="number" placeholder="Refurbished Price" style={inputStyle} value={formData.refurbishedPrice || formData.price} onChange={(e) => setFormData({...formData, refurbishedPrice: e.target.value, price: e.target.value})} required />
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b' }}>Brand New (Sealed) Price (PKR)</span>
                        <input type="number" placeholder="Brand New Price" style={inputStyle} value={formData.brandNewPrice} onChange={(e) => setFormData({...formData, brandNewPrice: e.target.value})} required />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b' }}>Base Price (PKR)</span>
                      <input type="number" placeholder="Base Price" style={inputStyle} value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                    </div>
                  )}
                </div>

                {/* COLOR SELECTION PALETTE */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>
                      <Palette size={16} color="#6366f1" />
                      <span>Color Selection</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.hasColors} 
                      onChange={(e) => setFormData({...formData, hasColors: e.target.checked})}
                      style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#6366f1' }} 
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
                                border: isSelected ? '1.5px solid #6366f1' : '1px solid #cbd5e1',
                                background: isSelected ? '#e0e7ff' : '#ffffff',
                                color: isSelected ? '#4338ca' : '#475569',
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
                          style={{ ...inputStyle, padding: '8px 12px', fontSize: '11px' }}
                          value={customColorInput}
                          onChange={(e) => setCustomColorInput(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomColor}
                          style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '0 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Description</label>
                  <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ ...inputStyle, height: '70px', resize: 'none' }} required />
                </div>
                
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#6366f1', border: 'none', fontWeight: '800', color: '#fff', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 10px 15px -3px rgba(99,102,241,0.3)' }}>
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