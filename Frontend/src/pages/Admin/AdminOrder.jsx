import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import api, { getImageUrl } from '../../api/axiosConfig'; 
import { Package, User, Phone, MapPin, Landmark, CreditCard, X, Eye, ClipboardList, CheckCircle2, Truck, XCircle, Clock3, Image as ImageIcon } from 'lucide-react';

const STATUS_CONFIG = {
  'Order Received & Being Prepared': { color: '#b45309', bg: '#fef3c7', icon: Clock3 },
  'Shipped': { color: '#1d4ed8', bg: '#dbeafe', icon: Truck },
  'Delivered': { color: '#15803d', bg: '#dcfce7', icon: CheckCircle2 },
  'Cancelled': { color: '#b91c1c', bg: '#fee2e2', icon: XCircle },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/orders/${id}`, { orderStatus: newStatus });
      alert("Status updated & notifications sent!");
      window.location.reload();
    } catch (err) {
      alert("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = (status) => STATUS_CONFIG[status] || { color: '#4b5563', bg: '#f3f4f6', icon: Clock3 };

  return (
    <div className="flex h-screen bg-gray-50">
      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalPop { from { opacity: 0; transform: scale(0.94) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes shimmer { 0% { background-position: -300px 0; } 100% { background-position: calc(300px + 100%) 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .order-row { animation: fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; transition: background 0.2s ease, transform 0.15s ease; }
        .order-row:hover { background: #fafafa; }
        .view-btn { transition: gap 0.2s ease, color 0.2s ease; display: inline-flex; align-items: center; gap: 4px; }
        .view-btn:hover { gap: 7px; }
        .modal-backdrop { animation: fadeIn 0.2s ease both; }
        .modal-card { animation: modalPop 0.28s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .close-btn { transition: background 0.2s ease, transform 0.15s ease; }
        .close-btn:hover { background: #262626; transform: translateY(-1px); }
        .detail-item { transition: background 0.2s ease; }
        .detail-item:hover { background: #f3f4f6; }
        .status-select { transition: border-color 0.2s ease, box-shadow 0.2s ease; }
        .status-select:focus { border-color: #111827; box-shadow: 0 0 0 3px rgba(17,24,39,0.08); outline: none; }
        .skeleton-row { background: linear-gradient(90deg, #f0f0f0 0px, #f8f8f8 60px, #f0f0f0 120px); background-size: 300px 100%; animation: shimmer 1.4s infinite linear; border-radius: 8px; }
        .spinner { animation: spin 0.7s linear infinite; }
        .status-badge { display: inline-flex; align-items: center; gap: 5px; transition: transform 0.2s ease; }
        .order-row:hover .status-badge { transform: scale(1.03); }
      `}</style>

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6" style={{ animation: 'fadeSlideUp 0.45s ease both' }}>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                <Package size={24} className="text-amber-600" />
                Manage Orders
              </h1>
              <p className="text-sm text-gray-500 mt-1">Track, review and update every order in one place.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-sm font-semibold text-gray-700 flex items-center gap-2">
              <ClipboardList size={16} className="text-amber-600" />
              {orders.length} total orders
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4" style={{ animation: 'fadeSlideUp 0.5s ease 0.05s both' }}>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-gray-500 uppercase">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-3"><div className="skeleton-row h-4 w-16" /></td>
                      <td className="p-3"><div className="skeleton-row h-4 w-32" /></td>
                      <td className="p-3"><div className="skeleton-row h-4 w-20" /></td>
                      <td className="p-3"><div className="skeleton-row h-4 w-24" /></td>
                      <td className="p-3"><div className="skeleton-row h-4 w-28" /></td>
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400">No orders found yet.</td>
                  </tr>
                ) : (
                  (orders || []).map((order, idx) => {
                    const statusStyle = getStatusStyle(order.orderStatus);
                    const StatusIcon = statusStyle.icon;
                    return (
                      <tr key={order._id} className="order-row border-b" style={{ animationDelay: `${idx * 0.04}s` }}>
                        <td className="p-3 font-mono text-gray-700">#{order._id.slice(-6)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-xs font-bold text-amber-700">{order.shippingAddress.fullName ? order.shippingAddress.fullName[0].toUpperCase() : 'U'}</div>
                            {order.shippingAddress.fullName}
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-gray-800">Rs. {order.totalPrice}</td>
                        <td className="p-3">
                          <span className="status-badge px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                            <StatusIcon size={12} /> {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <button onClick={() => setSelectedOrder(order)} className="view-btn text-blue-600 font-semibold"><Eye size={15} /> View Details</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* A-Z Details Modal */}
      {selectedOrder && (
        <div className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="modal-card bg-white p-8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><ClipboardList size={20} className="text-amber-600" /> Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="close-btn text-gray-400 hover:text-white p-1.5 rounded-full"><X size={18} /></button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-6">
              <div className="detail-item flex items-start gap-2 p-2 rounded-lg"> <User size={15} className="text-gray-400 mt-0.5" /> <p><strong>Name:</strong><br />{selectedOrder.shippingAddress.fullName}</p> </div>
              <div className="detail-item flex items-start gap-2 p-2 rounded-lg"> <Phone size={15} className="text-gray-400 mt-0.5" /> <p><strong>Phone:</strong><br />{selectedOrder.shippingAddress.phone}</p> </div>
              <div className="detail-item flex items-start gap-2 p-2 rounded-lg"> <MapPin size={15} className="text-gray-400 mt-0.5" /> <p><strong>City:</strong><br />{selectedOrder.shippingAddress.city}</p> </div>
              <div className="detail-item flex items-start gap-2 p-2 rounded-lg"> <MapPin size={15} className="text-gray-400 mt-0.5" /> <p><strong>Address:</strong><br />{selectedOrder.shippingAddress.address}</p> </div>
              <div className="detail-item flex items-start gap-2 p-2 rounded-lg"> <Landmark size={15} className="text-gray-400 mt-0.5" /> <p><strong>Landmark:</strong><br />{selectedOrder.shippingAddress.nearestLandmark || 'N/A'}</p> </div>
              <div className="detail-item flex items-start gap-2 p-2 rounded-lg"> <CreditCard size={15} className="text-gray-400 mt-0.5" /> <p><strong>Payment:</strong><br />{selectedOrder.paymentMethod}</p> </div>
            </div>

            {/* UPDATED PAYMENT RECEIPT SECTION */}
            {selectedOrder.receiptImage && (
              <div className="mt-6 border-t pt-4">
                <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><ImageIcon size={16} /> Payment Receipt:</p>
                <a href={getImageUrl(selectedOrder.receiptImage)} target="_blank" rel="noopener noreferrer" className="block">
                  <img src={getImageUrl(selectedOrder.receiptImage)} alt="Payment Proof" className="w-full h-48 object-contain rounded-lg border shadow-sm hover:opacity-90 transition-opacity bg-gray-50" />
                  <p className="text-xs text-blue-600 mt-2 text-center underline">Click to view full image</p>
                </a>
              </div>
            )}
            
            <div className="border-t pt-4 mt-4">
              <label className="block font-semibold mb-2 text-gray-700">Change Order Status:</label>
              <select defaultValue={selectedOrder.orderStatus} onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)} disabled={updating} className="status-select w-full p-2.5 border rounded-lg bg-gray-50 font-medium">
                <option value="Order Received & Being Prepared">Order Received</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <button onClick={() => setSelectedOrder(null)} className="close-btn mt-6 w-full bg-black text-white py-2.5 rounded-lg font-medium">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;