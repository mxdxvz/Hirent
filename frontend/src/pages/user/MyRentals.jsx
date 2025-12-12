import React, { useState, useEffect, useMemo } from 'react';
import { makeAPICall, ENDPOINTS } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

const MyRentals = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const response = await makeAPICall(ENDPOINTS.BOOKINGS.GET_USER_BOOKINGS(user._id), {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.success) {
          setBookings(response.data);
        } else {
          setError(response.message || 'Failed to fetch bookings.');
        }
      } catch (err) {
        setError('An error occurred while fetching bookings.');
      }
      setLoading(false);
    };

    fetchBookings();

    const interval = setInterval(fetchBookings, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [user]);

  const filteredBookings = useMemo(() => {
    if (activeTab === 'All') return bookings;
    return bookings.filter(b => b.status.toLowerCase() === activeTab.toLowerCase());
  }, [bookings, activeTab]);

  const summary = useMemo(() => {
    const completed = bookings.filter(b => b.status === 'completed');
    return {
      totalItems: bookings.length,
      subtotalCompleted: completed.reduce((sum, b) => sum + b.subtotal, 0),
      totalDiscounts: bookings.reduce((sum, b) => sum + (b.discount || 0), 0),
      totalSecurityDeposit: bookings.reduce((sum, b) => sum + (b.securityDeposit || 0), 0),
      totalExpense: completed.reduce((sum, b) => sum + b.totalAmount, 0),
    };
  }, [bookings]);

  if (loading) return <div className="text-center p-8">Loading your rentals...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  const tabs = ['All', 'Approved', 'Pending', 'Cancelled', 'Completed'];

  return (
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
          filteredBookings.map(booking => (
            <div key={booking._id} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
              <img src={booking.itemId.images[0]} alt={booking.itemId.title} className="w-24 h-24 object-cover rounded-md mr-4"/>
              <div className="flex-grow">
                <h2 className="font-bold text-lg">{booking.itemId.title}</h2>
                <p className="text-sm text-gray-500">{format(new Date(booking.startDate), 'PPP')} - {format(new Date(booking.endDate), 'PPP')}</p>
                <p className="text-sm">Owner: {booking.ownerId.name}</p>
                <p className="text-sm">Booked on: {format(new Date(booking.createdAt), 'PPP')}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">₱{booking.totalAmount.toFixed(2)}</p>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${{
                  pending: 'bg-yellow-200 text-yellow-800',
                  approved: 'bg-green-200 text-green-800',
                  cancelled: 'bg-red-200 text-red-800',
                  completed: 'bg-blue-200 text-blue-800',
                }[booking.status.toLowerCase()]}`}>
                  {booking.status}
                </span>
                <p className="text-sm capitalize mt-1">{booking.deliveryMethod}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-8">No bookings found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default MyRentals;
