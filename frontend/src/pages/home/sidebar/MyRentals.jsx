import React, { useState, useEffect, useMemo, useContext } from 'react';
import { makeAPICall, ENDPOINTS } from '../../../config/api';
import { AuthContext } from '../../../context/AuthContext';
import { format } from 'date-fns';
import MainLayout from '../../../components/layouts/MainLayout';

const MyRentals = () => {
  const { user } = useContext(AuthContext);
  console.log("User from AuthContext:", user);
  console.log("User ID:", user?.userId || user?._id);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        console.log("No user found, skipping fetch");
        return;
      }

      console.log("Fetching bookings for user:", user.userId || user._id);
      setLoading(true);

      try {
        const response = await makeAPICall(ENDPOINTS.BOOKINGS.GET_MY);
        
        // LOG EVERYTHING
        console.log("=== FULL API RESPONSE ===");
        console.log("Response:", response);
        console.log("Response type:", typeof response);
        console.log("Is array?", Array.isArray(response));
        console.log("Response.data:", response?.data);
        console.log("Response.success:", response?.success);
        
        // Handle different response structures
        let bookingsData = [];
        
        if (Array.isArray(response)) {
          bookingsData = response;
        } else if (response?.success && Array.isArray(response.data)) {
          bookingsData = response.data;
        } else if (response?.data && Array.isArray(response.data)) {
          bookingsData = response.data;
        } else if (response?.bookings && Array.isArray(response.bookings)) {
          bookingsData = response.bookings;
        }
        
        console.log("Extracted bookings data:", bookingsData);
        console.log("Number of bookings:", bookingsData.length);
        
        if (bookingsData.length > 0) {
          console.log("First booking sample:", bookingsData[0]);
          console.log("First booking itemId:", bookingsData[0]?.itemId);
          console.log("First booking ownerId:", bookingsData[0]?.ownerId);
        }
        
        setBookings(bookingsData);
        setError(null);
        
      } catch (err) {
        console.error("=== ERROR FETCHING BOOKINGS ===");
        console.error("Error object:", err);
        console.error("Error message:", err.message);
        console.error("Error response:", err.response);
        setError('Failed to fetch bookings. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const filteredBookings = useMemo(() => {
    if (activeTab === 'All') return bookings;
    return bookings.filter(b => b.status.toLowerCase() === activeTab.toLowerCase());
  }, [bookings, activeTab]);

  const summary = useMemo(() => {
    const completed = bookings.filter(b => b.status === 'completed');
    return {
      totalItems: bookings.length,
      subtotalCompleted: completed.reduce((sum, b) => sum + (b.subtotal || 0), 0),
      totalDiscounts: bookings.reduce((sum, b) => sum + (b.discount || 0), 0),
      totalSecurityDeposit: bookings.reduce((sum, b) => sum + (b.securityDeposit || 0), 0),
      totalExpense: completed.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    };
  }, [bookings]);

  if (loading) return <MainLayout><div className="text-center p-8">Loading your rentals...</div></MainLayout>;
  if (error) return <MainLayout><div className="text-center p-8 text-red-500">{error}</div></MainLayout>;

  const tabs = ['All', 'Approved', 'Pending', 'Cancelled', 'Completed'];

  return (
    <MainLayout>
      <div className="p-4 sm:ml-64">
        <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Rentals</h1>
      
      {/* Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-2xl font-bold">{summary.totalItems}</p>
          <p className="text-gray-500">Total Items Rented</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-2xl font-bold">₱{summary.subtotalCompleted.toFixed(2)}</p>
          <p className="text-gray-500">Subtotal of Completed</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-2xl font-bold">₱{summary.totalDiscounts.toFixed(2)}</p>
          <p className="text-gray-500">Total Discounts</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-2xl font-bold">₱{summary.totalSecurityDeposit.toFixed(2)}</p>
          <p className="text-gray-500">Security Deposits</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-2xl font-bold">₱{summary.totalExpense.toFixed(2)}</p>
          <p className="text-gray-500">Total Expense</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 ${activeTab === tab ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}>
            {tab} ({tab === 'All' ? bookings.length : bookings.filter(b => b.status.toLowerCase() === tab.toLowerCase()).length})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => {
            console.log("Rendering booking:", booking._id, booking);

            // Check if data exists
            if (!booking) {
              console.warn("Booking is null/undefined");
              return null;
            }

            if (!booking.itemId) {
              console.warn("Booking missing itemId:", booking._id);
              return (
                <div key={booking._id} className="bg-red-50 p-4 rounded">
                  Booking {booking._id}: Item data not found
                </div>
              );
            }

            if (!booking.ownerId) {
              console.warn("Booking missing ownerId:", booking._id);
            }

            const imageUrl = booking.itemId?.images?.[0] || 'https://via.placeholder.com/150';
            const itemTitle = booking.itemId?.title || 'Unknown Item';
            const ownerName = booking.ownerId?.name || 'Unknown Owner';

            return (
              <div key={booking._id} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <img src={imageUrl} alt={itemTitle} className="w-24 h-24 object-cover rounded-md mr-4"/>
                <div className="flex-grow">
                  <h2 className="font-bold text-lg">{itemTitle}</h2>
                  <p className="text-sm text-gray-500">
                    {booking.startDate ? format(new Date(booking.startDate), 'PPP') : 'N/A'} - 
                    {booking.endDate ? format(new Date(booking.endDate), 'PPP') : 'N/A'}
                  </p>
                  <p className="text-sm">Owner: {ownerName}</p>
                  <p className="text-sm">Booked on: {booking.createdAt ? format(new Date(booking.createdAt), 'PPP') : 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₱{(booking.totalAmount || 0).toFixed(2)}</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                    booking.status === 'approved' ? 'bg-green-200 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                    booking.status === 'completed' ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {booking.status || 'unknown'}
                  </span>
                  <p className="text-sm capitalize mt-1">{booking.deliveryMethod || 'N/A'}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8"> <p className="mb-2">No bookings found for this category.</p> <p className="text-sm text-gray-500">Total bookings loaded: {bookings.length}</p> </div>
        )}
      </div>
      </div>
    </div>
    </MainLayout>
  );
};

export default MyRentals;
