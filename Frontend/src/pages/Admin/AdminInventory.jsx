import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from "../../api/axiosConfig";
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, ChevronDown } from 'lucide-react';
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { TOKENS } from "../../constants";
import AddPartModal from "../../components/AddPartModal";
import EditPartModal from "../../components/EditPartModal";

const CustomDropdown = ({ options, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ position: 'relative', width: '200px' }}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ background: '#f8f8f8', padding: '12px 15px', borderRadius: 12, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #eee', fontSize: 14 }}>
        <span>{value === 'All' ? label : value}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown size={16} /></motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.ul initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#fff', borderRadius: 12, listStyle: 'none', padding: '5px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, border: '1px solid #eee' }}>
            {options.map(opt => (
              <li key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} style={{ padding: '10px 15px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>{opt}</li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminInventory = () => {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Name");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Edit State
  const [editPart, setEditPart] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => { fetchParts(); }, []);

  const fetchParts = async () => {
    try {
      const response = await api.get('/parts');
      const data = response.data;
      if (Array.isArray(data)) {
        setParts(data);
      } else if (data && Array.isArray(data.parts)) {
        setParts(data.parts);
      } else {
        setParts([]);
      }
    } catch (err) { 
      console.error("Error fetching:", err); 
      setParts([]);
    }
  };

  const deletePart = async (id) => {
    if (window.confirm("Are you sure you want to delete this part?")) {
      try {
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
        await api.delete(`/parts/${id}`, { headers: { Authorization: `Bearer ${adminInfo?.token}` } });
        fetchParts();
      } catch (err) { console.error(err); }
    }
  };

  const openEditModal = (part) => {
    setEditPart(part);
    setIsEditModalOpen(true);
  };

  // Safe processing check so it never throws .filter is not a function
  const safeParts = Array.isArray(parts) ? parts : [];
  const processedParts = safeParts
    .filter(p => (filter === "All" ? true : p?.category === filter))
    .filter(p => (p?.name || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "Price" ? (a?.price || 0) - (b?.price || 0) : (a?.name || '').localeCompare(b?.name || ''));

  return (
    <div style={{ display: 'flex', background: TOKENS.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar title="Inventory Manager" />
        <main style={{ padding: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>Manage Inventory ({processedParts.length})</h2>
            <button onClick={() => setIsModalOpen(true)} style={{ background: TOKENS.rust, color: 'white', padding: '12px 24px', borderRadius: 12, border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
              <Plus size={18} /> Add New Part
            </button>
          </div>

          <div style={{ display: 'flex', gap: 15, marginBottom: 30, background: TOKENS.panel, padding: 20, borderRadius: 20, border: '1px solid #e5e5e5' }}>
            <div style={{ flex: 2, display: 'flex', alignItems: 'center', background: '#f8f8f8', padding: '12px 15px', borderRadius: 12, border: '1px solid #eee' }}>
              <Search size={20} color="#999" />
              <input placeholder="Search..." onChange={(e) => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', marginLeft: 10, outline: 'none', width: '100%' }} />
            </div>
            <CustomDropdown options={['All', 'Mobile', 'Computer', 'Laptop']} value={filter} onChange={setFilter} label="Category" />
            <CustomDropdown options={['Name', 'Price']} value={sortBy} onChange={setSortBy} label="Sort By" />
          </div>

          <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            <AnimatePresence>
              {processedParts.map(part => (
                <motion.div key={part?._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} style={{ background: TOKENS.panel, padding: 20, borderRadius: 20, border: '1px solid #e5e5e5', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                  <img 
                    src={getImageUrl(part?.image)} 
                    alt={part?.name} 
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, marginBottom: 15 }} 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/160'}
                  />
                  <h3 style={{ fontSize: 17, marginBottom: 5 }}>{part?.name}</h3>
                  <p style={{ fontSize: 13, color: '#666', marginBottom: 15 }}>{part?.category} • ${part?.price}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700 }}>Stock: {part?.countInStock}</span>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => openEditModal(part)} style={{ background: '#f0f4f8', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer', color: TOKENS.blueish }}><Edit2 size={16} /></button>
                      <button onClick={() => deletePart(part?._id)} style={{ background: '#fff0f0', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer', color: '#d32f2f' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
      <AddPartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={fetchParts} />
      <EditPartModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} part={editPart} onUpdate={fetchParts} />
    </div>
  );
};

export default AdminInventory;