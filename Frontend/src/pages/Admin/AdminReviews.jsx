import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { Star, Trash2, Loader2, AlertTriangle, MessageSquare, ExternalLink } from 'lucide-react';
import api, { getImageUrl } from '../../api/axiosConfig';
import { TOKENS, FONT_HEAD, FONT_BODY } from '../../constants';
import { Link } from 'react-router-dom';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sidebar collapse states
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Delete modal state
  const [showModal, setShowModal] = useState(false);
  const [targetReview, setTargetReview] = useState(null);
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
    <div style={{ display: "flex", minHeight: "100vh", background: TOKENS.bg, color: TOKENS.text, fontFamily: FONT_BODY }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar title="Reviews & Moderation" onMenuClick={() => setMobileOpen(true)} />

        <main style={{ padding: 24, maxWidth: 1280, width: "100%", margin: "0 auto" }}>
          
          {/* Header & Metrics */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h1 style={{ fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 700, margin: 0, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                <Star size={22} color={TOKENS.amber} fill={TOKENS.amber} />
                Customer Product Reviews
              </h1>
              <p style={{ fontSize: 12, color: TOKENS.textSub, margin: "4px 0 0 0" }}>Manage and moderate live reviews submitted across catalog products.</p>
            </div>
          </div>

          {/* Metric Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
            <div style={{ background: TOKENS.cardBg, border: `1px solid ${TOKENS.cardBorder}`, padding: 18, borderRadius: 12 }}>
              <div style={{ fontSize: 11, color: TOKENS.textSub, textTransform: "uppercase", fontWeight: 600 }}>Total Store Reviews</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginTop: 4, fontFamily: FONT_HEAD }}>{totalReviews}</div>
            </div>

            <div style={{ background: TOKENS.cardBg, border: `1px solid ${TOKENS.cardBorder}`, padding: 18, borderRadius: 12 }}>
              <div style={{ fontSize: 11, color: TOKENS.textSub, textTransform: "uppercase", fontWeight: 600 }}>5-Star Ratings</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: TOKENS.emerald, marginTop: 4, fontFamily: FONT_HEAD }}>{fiveStarCount}</div>
            </div>

            <div style={{ background: TOKENS.cardBg, border: `1px solid ${TOKENS.cardBorder}`, padding: 18, borderRadius: 12 }}>
              <div style={{ fontSize: 11, color: TOKENS.textSub, textTransform: "uppercase", fontWeight: 600 }}>Average Rating</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: TOKENS.amber, marginTop: 4, fontFamily: FONT_HEAD }}>{avgRating} / 5.0</div>
            </div>
          </div>

          {/* Table Container */}
          <div style={{ background: TOKENS.cardBg, border: `1px solid ${TOKENS.cardBorder}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, color: TOKENS.textSub, gap: 8, fontSize: 13 }}>
                <Loader2 className="animate-spin" size={18} />
                Loading Product Reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: TOKENS.textSub, fontSize: 13 }}>
                <MessageSquare style={{ margin: "0 auto 8px auto", opacity: 0.5 }} size={32} />
                No customer reviews submitted yet.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "rgba(0,0,0,0.3)", borderBottom: `1px solid ${TOKENS.cardBorder}`, color: TOKENS.textSub, fontSize: 11, textTransform: "uppercase", fontFamily: FONT_HEAD }}>
                      <th style={{ padding: "14px 16px" }}>Product</th>
                      <th style={{ padding: "14px 16px" }}>Customer Name</th>
                      <th style={{ padding: "14px 16px" }}>Rating</th>
                      <th style={{ padding: "14px 16px" }}>Review Comment</th>
                      <th style={{ padding: "14px 16px" }}>Date</th>
                      <th style={{ padding: "14px 16px", textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((rev) => (
                      <tr key={rev._id} style={{ borderBottom: `1px solid ${TOKENS.sidebarLine}` }}>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <img
                              src={getImageUrl(rev.partImage)}
                              alt={rev.partName}
                              style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover", background: "#000", border: `1px solid ${TOKENS.cardBorder}` }}
                              onError={(e) => e.target.src = 'https://via.placeholder.com/38'}
                            />
                            <div>
                              <Link to={`/product/${rev.partId}`} target="_blank" style={{ color: "#fff", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                                {rev.partName}
                                <ExternalLink size={12} style={{ opacity: 0.6 }} />
                              </Link>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: "14px 16px", color: "#fff", fontWeight: 600 }}>
                          {rev.name}
                        </td>

                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", color: TOKENS.amber, gap: 2 }}>
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={13} fill={s <= rev.rating ? TOKENS.amber : "none"} color={s <= rev.rating ? TOKENS.amber : "#4A4E58"} />
                            ))}
                          </div>
                        </td>

                        <td style={{ padding: "14px 16px", color: TOKENS.textSub, maxWidth: 300 }}>
                          "{rev.comment}"
                        </td>

                        <td style={{ padding: "14px 16px", color: TOKENS.textSub, fontSize: 11, fontFamily: "monospace" }}>
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'N/A'}
                        </td>

                        <td style={{ padding: "14px 16px", textAlign: "right" }}>
                          <button
                            onClick={() => openDeleteModal(rev.partId, rev._id)}
                            style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#EF4444", padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}
                            title="Delete Review"
                          >
                            <Trash2 size={14} />
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
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ position: "relative", zIndex: 10, background: TOKENS.cardBg, border: `1px solid ${TOKENS.cardBorder}`, padding: 24, borderRadius: 16, maxWidth: 360, width: "100%", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#EF4444", marginBottom: 12 }}>
                <AlertTriangle size={22} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: FONT_HEAD }}>Delete Review?</h3>
              </div>
              <p style={{ fontSize: 13, color: TOKENS.textSub, margin: "0 0 20px 0", lineHeight: 1.5 }}>Are you sure you want to delete this customer review? This action cannot be undone.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setShowModal(false)} style={{ background: TOKENS.sidebarSoft, border: "none", color: "#fff", padding: "9px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button onClick={confirmDelete} disabled={deleting} style={{ background: "#EF4444", border: "none", color: "#fff", padding: "9px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
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
