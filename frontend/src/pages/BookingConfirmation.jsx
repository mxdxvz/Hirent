import React from 'react';
import { Link, useParams } from 'react-router-dom';

const BookingConfirmation = () => {
  const { bookingId } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>
      <p className="text-lg text-gray-700 mb-2">Your booking ID is: <strong>{bookingId}</strong></p>
      <p className="text-gray-600 mb-8">You can view your booking details in your rentals page.</p>
      <Link to="/my-rentals" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
        Go to My Rentals
      </Link>
    </div>
  );
};

export default BookingConfirmation;
