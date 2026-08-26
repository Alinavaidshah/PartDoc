import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { Star, Trash2, Loader2, AlertTriangle, MessageSquare, ExternalLink } from 'lucide-react';
import api, { getImageUrl } from '../../api/axiosConfig';
import { Link } from 'react-router-dom';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [showModal, setShowModal] = useState(false);
  const [targetReview, setTargetReview] = useState(null); // { partId, reviewId }
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/parts/reviews/all');
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (partId, reviewId) => {
    setTargetReview({ partId, reviewId });
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!targetReview) return;
    setDeleting(true);
    try {
      await api.delete(`/parts/${targetReview.partId}/reviews/${targetReview.reviewId}`);
      setReviews(reviews.filter(r => r._id !== targetReview.reviewId));
      setShowModal(false);
      setTargetReview(null);
    } catch (err) {
      alert("Failed to delete review: " + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(false);
    }
  };

  const totalReviews = reviews.length;
  const fiveStarCount = reviews.filter(r => r.rating === 5).length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : '5.0';

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar title="Reviews & Moderation" />

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Header & Metrics */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Star className="text-amber-400 fill-amber-400" size={24} />
                Product Customer Reviews
              </h1>
              <p className="text-slate-400 text-xs mt-1">Manage and moderate reviews submitted across all catalog products.</p>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Total Store Reviews</div>
              <div className="text-2xl font-extrabold text-white mt-1">{totalReviews}</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">5-Star Positive Ratings</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{fiveStarCount}</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Average Store Rating</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">{avgRating} / 5.0</div>
            </div>
          </div>

          {/* Reviews Table */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-slate-400 gap-2 text-sm">
                <Loader2 className="animate-spin" size={20} />
                Loading Product Reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-sm">
                <MessageSquare className="mx-auto mb-2 text-slate-500" size={32} />
                No customer reviews submitted yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 uppercase font-mono">
                    <tr>
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Customer Name</th>
                      <th className="py-3.5 px-4">Rating</th>
                      <th className="py-3.5 px-4">Review Comment</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50 font-medium">
                    {reviews.map((rev) => (
                      <tr key={rev._id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getImageUrl(rev.partImage)}
                              alt={rev.partName}
                              className="w-10 h-10 rounded-lg bg-slate-900 object-cover border border-slate-700"
                              onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                            />
                            <div>
                              <Link to={`/product/${rev.partId}`} target="_blank" className="font-bold text-white hover:text-amber-400 flex items-center gap-1">
                                {rev.partName}
                                <ExternalLink size={12} className="text-slate-500" />
                              </Link>
                              <span className="text-[10px] text-slate-500 font-mono">ID: #{rev.partId?.slice(-6)}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-white">
                          {rev.name}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex text-amber-400 gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={12} className={s <= rev.rating ? "fill-amber-400" : "text-slate-600"} />
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs text-slate-300 leading-relaxed">
                          "{rev.comment}"
                        </td>

                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'N/A'}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => openDeleteModal(rev.partId, rev._id)}
                            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
              <div className="flex items-center gap-3 text-rose-400 mb-3">
                <AlertTriangle size={24} />
                <h3 className="font-bold text-white text-base">Delete Review?</h3>
              </div>
              <p className="text-slate-300 text-xs mb-6">Are you sure you want to delete this review? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-600">Cancel</button>
                <button onClick={confirmDelete} disabled={deleting} className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 flex items-center gap-1.5">
                  {deleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                  <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReviews;
