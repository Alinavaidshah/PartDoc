import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, Loader2, ChevronDown } from 'lucide-react';
import api from "../api/axiosConfig";
import { TOKENS } from "../constants";

const AddPartModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({ 
    name: '', brand: '', category: 'Mobile', price: '', countInStock: '', image: null, description: '' 
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await api.post('/parts', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); onAdd(); onClose(); }, 2000);
  } catch (err) {
      console.error("Full Upload error details:", err.response || err);
      setLoading(false);
      alert(`Error adding part: ${err.response?.data?.message || err.message}`);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #eee',
    boxSizing: 'border-box', outline: 'none', fontSize: '15px', transition: 'all 0.3s ease'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} />

          <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }}
            style={{ background: 'white', padding: '35px', borderRadius: '24px', width: '450px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>

            {showSuccess ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ textAlign: 'center', padding: '40px 0', color: '#22c55e' }}>
                <CheckCircle size={70} /> <h3>Part Successfully Added!</h3>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <h2 style={{ margin: '0 0 10px', fontSize: '24px' }}>Add New Part</h2>

                <motion.input whileFocus={{ scale: 1.02, borderColor: TOKENS.rust }} placeholder="Part Name" style={inputStyle} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                
                <motion.input whileFocus={{ scale: 1.02, borderColor: TOKENS.rust }} placeholder="Description" style={inputStyle} onChange={(e) => setFormData({...formData, description: e.target.value})} required />

                <motion.label whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ ...inputStyle, border: '2px dashed #ccc', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Upload size={18} /> {formData.image ? formData.image.name : "Select Image"}
                  <input type="file" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} hidden required />
                </motion.label>

                <motion.input whileFocus={{ scale: 1.02, borderColor: TOKENS.rust }} placeholder="Brand" style={inputStyle} onChange={(e) => setFormData({...formData, brand: e.target.value})} required />

                <motion.div style={{ position: 'relative' }} whileTap={{ scale: 0.98 }}>
                  <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: '40px' }} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                    <option value="Mobile">Mobile Parts</option>
                    <option value="Computer">Computer Parts</option>
                    <option value="Laptop">Laptop Parts</option>
                  </select>
                  <ChevronDown style={{ position: 'absolute', right: '15px', top: '15px', pointerEvents: 'none', color: '#666' }} />
                </motion.div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <input type="number" placeholder="Price" style={{...inputStyle, flex: 1}} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                  <input type="number" placeholder="Stock" style={{...inputStyle, flex: 1}} onChange={(e) => setFormData({...formData, countInStock: e.target.value})} required />
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} type="submit" disabled={loading}
                  style={{ background: TOKENS.rust, color: 'white', padding: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '700', marginTop: '10px' }}>
                  {loading ? <Loader2 className="animate-spin" /> : "Submit Part"}
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