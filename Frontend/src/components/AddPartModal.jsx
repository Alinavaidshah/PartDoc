import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, Loader2, ChevronDown, Layers, Palette, X } from 'lucide-react';
import api from "../api/axiosConfig";

const PRESET_COLORS = [
  'Space Black', 'Silver', 'Space Gray', 'Midnight Blue', 'Gold', 'Rose Gold', 'Alpine White', 'Titanium', 'Red'
];

const AddPartModal = ({ isOpen, onClose, onAdd }) => {
  const initialFormState = { 
    name: '', brand: '', category: 'Mobile', price: '', countInStock: '', image: null, description: '',
    hasGrades: true, refurbishedPrice: '', brandNewPrice: '',
    hasColors: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedColors, setSelectedColors] = useState(['Space Black', 'Silver']);
  const [customColorInput, setCustomColorInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedColors(['Space Black', 'Silver']);
    setCustomColorInput('');
    setShowSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
      await api.post('/parts', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        resetForm();
        if (onAdd) onAdd();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Upload error:", err.response || err);
      setLoading(false);
      alert(`Error adding part: ${err.response?.data?.message || err.message}`);
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: -1 }} />

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', sticky: 'top', background: '#fff' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a', fontFamily: 'sans-serif' }}>Add New Catalog Part</h2>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Configure pricing, grade options, and color variants.</p>
              </div>
              <button onClick={handleClose} style={{ border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} color="#64748b" />
              </button>
            </div>

            {showSuccess ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ textAlign: 'center', padding: '40px 0', color: '#10b981' }}>
                <CheckCircle size={60} style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Part Added Successfully!</h3>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* PART NAME & BRAND */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Part Name *</label>
                    <input placeholder="e.g. RTX 4080 Super 16GB" style={inputStyle} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Brand Manufacturer *</label>
                    <input placeholder="e.g. NVIDIA, Apple, Samsung" style={inputStyle} value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} required />
                  </div>
                </div>

                {/* CATEGORY & STOCK */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Category *</label>
                    <div style={{ position: 'relative' }}>
                      <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                        <option value="Mobile">Mobile Parts</option>
                        <option value="Computer">Computer Parts</option>
                        <option value="Laptop">Laptop Parts</option>
                      </select>
                      <ChevronDown style={{ position: 'absolute', right: '12px', top: '12px', pointerEvents: 'none', color: '#64748b' }} size={16} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Stock Quantity *</label>
                    <input type="number" placeholder="e.g. 15" style={inputStyle} value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: e.target.value})} required />
                  </div>
                </div>

                {/* IMAGE UPLOAD */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Product Image *</label>
                  <label style={{ ...inputStyle, border: '2px dashed #cbd5e1', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#f8fafc' }}>
                    <Upload size={16} color="#6366f1" />
                    <span style={{ fontSize: '12px', color: '#475569' }}>{formData.image ? formData.image.name : "Choose Part Image File"}</span>
                    <input type="file" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} hidden required />
                  </label>
                </div>

                {/* BASE PRICE & GRADE OPTIONS TOGGLE */}
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
                        <input type="number" placeholder="Base Refurbished Price" style={inputStyle} value={formData.refurbishedPrice || formData.price} onChange={(e) => setFormData({...formData, refurbishedPrice: e.target.value, price: e.target.value})} required />
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b' }}>Brand New (Sealed) Price (PKR)</span>
                        <input type="number" placeholder="Brand New Price" style={inputStyle} value={formData.brandNewPrice} onChange={(e) => setFormData({...formData, brandNewPrice: e.target.value})} required />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b' }}>Base Price (PKR)</span>
                      <input type="number" placeholder="Price in PKR" style={inputStyle} value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                    </div>
                  )}
                </div>

                {/* COLOR OPTIONS TOGGLE & PALETTE */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>
                      <Palette size={16} color="#6366f1" />
                      <span>Color Variants Selection</span>
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
                          placeholder="Add custom color variant..."
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
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Description *</label>
                  <textarea placeholder="Component technical details..." rows={2} style={{ ...inputStyle, resize: 'none' }} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                </div>

                {/* SUBMIT BUTTON */}
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                  style={{ background: '#6366f1', color: 'white', padding: '14px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyCenter: 'center', gap: '8px', boxShadow: '0 10px 15px -3px rgba(99,102,241,0.3)' }}>
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Publish Part To Catalog"}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddPartModal;