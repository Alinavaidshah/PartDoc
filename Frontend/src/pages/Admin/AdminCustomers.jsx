import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { Users, Trash2, Loader2, AlertTriangle, Mail, ShieldCheck } from 'lucide-react';
import api from '../../api/axiosConfig';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setCustomers(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setUserIdToDelete(id);
    setShowModal(true);
  };

  const closeModal = () => {
    if (deleting) return;
    setShowModal(false);
    setUserIdToDelete(null);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/users/${userIdToDelete}`);
      setCustomers(customers.filter(c => c._id !== userIdToDelete));
      setShowModal(false);
      setUserIdToDelete(null);
    } catch (err) {
      alert("Something went wrong while deleting the user.");
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-8"
            >
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="text-blue-500" size={24} /> Customer Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">View and manage all registered users.</p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-600 font-medium"
              >
                Total Users: <span className="text-gray-900 font-semibold">{customers.length}</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {loading ? (
                <div className="p-16 flex flex-col items-center justify-center gap-3 text-gray-500">
                  <Loader2 className="animate-spin text-blue-500" size={28} />
                  <span className="text-sm">Loading customers...</span>
                </div>
              ) : customers.length === 0 ? (
                <div className="p-16 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <Users size={32} />
                  <span className="text-sm">No customers found yet.</span>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="divide-y divide-gray-50"
                  >
                    <AnimatePresence mode="popLayout">
                      {customers.map((user) => {
                        const isAdmin = user.role?.toLowerCase() === 'admin' || user.isAdmin === true;
                        const isDeletingThisUser = deleting && userIdToDelete === user._id;

                        return (
                          <motion.tr
                            key={user._id}
                            layout
                            variants={rowVariants}
                            exit="exit"
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                                  {getInitials(user.name)}
                                </div>
                                <span className="font-medium text-gray-900">{user.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail size={14} className="text-gray-400" />
                                {user.email}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                isAdmin
                                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}>
                                {isAdmin && <ShieldCheck size={12} />}
                                {isAdmin ? 'Administrator' : 'Customer'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openDeleteModal(user._id)}
                                disabled={isDeletingThisUser}
                                className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-all font-medium text-sm disabled:opacity-50"
                              >
                                {isDeletingThisUser ? (
                                  <>
                                    <Loader2 className="animate-spin" size={14} /> Deleting...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 size={14} /> Delete
                                  </>
                                )}
                              </motion.button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </motion.tbody>
                </table>
              )}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-6 rounded-2xl shadow-xl w-96 border border-gray-100"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-500" size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete this user?</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Are you sure? This action cannot be undone and the user will be permanently removed.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeModal}
                  disabled={deleting}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-sm flex items-center gap-2 disabled:opacity-70"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Deleting...
                    </>
                  ) : (
                    "Yes, Delete"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCustomers;