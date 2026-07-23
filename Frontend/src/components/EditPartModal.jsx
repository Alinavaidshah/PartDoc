import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const EditPartModal = ({ isOpen, onClose, part, onUpdate }) => {
  const [formData, setFormData] = useState({ name: '', price: '', category: '', countInStock: '', description: '' });

  useEffect(() => {
    if (part) setFormData(part);
  }, [part]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      await axios.put(`/api/parts/${part._id}`, formData, {
        headers: { Authorization: `Bearer ${adminInfo.token}` }
      });
      onUpdate();
      onClose();
    } catch (err) { console.error(err); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            style={{ background: '#1a1a1a', padding: 30, borderRadius: 24, width: '90%', maxWidth: 500, color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Edit Part</h2>
              <X onClick={onClose} style={{ cursor: 'pointer' }} />
            </div>
            
            <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: 12, borderRadius: 12, background: '#2a2a2a', border: 'none', color: 'white', marginBottom: 15 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: 12, borderRadius: 12, background: '#2a2a2a', border: 'none', color: 'white', marginBottom: 15 }} />
              <input type="number" placeholder="Stock" value={formData.countInStock} onChange={e => setFormData({...formData, countInStock: e.target.value})} style={{ width: '100%', padding: 12, borderRadius: 12, background: '#2a2a2a', border: 'none', color: 'white', marginBottom: 15 }} />
            </div>
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: 12, borderRadius: 12, background: '#2a2a2a', border: 'none', color: 'white', marginBottom: 15, height: 100 }} />
            
            <button type="submit" style={{ width: '100%', padding: 14, borderRadius: 12, background: '#D8973C', border: 'none', fontWeight: 700, color: '#000', cursor: 'pointer' }}>
              Update Part
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditPartModal;