const sampleUserCart = [
  {
    id: 1,
    days: 3,
    shipping: 20,
    status: "approved",
    bookedFrom: "2025-11-12",
    bookedTo: "2025-11-15",
    dateBooked: "2025-11-10 7:14 AM",
    paymentMethod: "Credit Card (Visa ****1234)",
    location: "Naga City, Camarines Sur",

    couponDiscount: 10,

    delivery: {
      deliveryType: "shipping",
      current: "in-transit",
      estimatedDate: "2025-11-12 9:00 AM",
      trackingNumber: "TRK123456789",
      currentLocation: "Warehouse",
      courier: "Tricycle",
      confirmedAt: "2025-11-10 10:00 PM",
      preparingAt: "2025-11-11 09:30 AM"
    }
  },

  {
    id: 2,
    days: 2,
    shipping: 0,
    status: "pending",
    bookedFrom: "2025-11-20",
    bookedTo: "2025-11-22",
    dateBooked: "2025-11-18",
    paymentMethod: "GCash (0917****567)",
    location: "Naga City, Camarines Sur",

    couponDiscount: 0,

    delivery: {
      deliveryType: "shipping",
      current: "pending",
      estimatedDate: "2025-11-21",
      trackingNumber: null,
      currentLocation: "Processing",
      courier: null,
      confirmedAt: null,
      preparingAt: null
    }
  },
  {
    id: 5, // DJI Mini Drone
    days: 4,
    shipping: 10,
    status: "approved",
    bookedFrom: "2025-11-18",
    bookedTo: "2025-11-22",
    dateBooked: "2025-11-17",
    paymentMethod: "Credit Card (MasterCard ****5678)",
    location: "Naga City, Camarines Sur",

    couponDiscount: 5,

    delivery: {
      deliveryType: "shipping",
      current: "preparing",
      estimatedDate: "2025-11-20",
      trackingNumber: "TRK987654321",
      currentLocation: "Packing Station",
      courier: "LBC Express",
      confirmedAt: "2025-11-17 15:00",
      preparingAt: "2025-11-18 08:00"
    }
  },
  {
    id: 3, // Electric Bike
    days: 2,
    shipping: 50,
    status: "completed",
    bookedFrom: null,
    bookedTo: null,
    dateBooked: null,
    paymentMethod: "Paypal (user@example.com)",
    location: "Naga City, Camarines Sur",
    couponDiscount: 0,
    delivery: null
  },
  {
    id: 4, // Drill Set
    days: 1,
    shipping: 30,
    status: "cancelled",
    bookedFrom: null,
    bookedTo: null,
    dateBooked: null,
    paymentMethod: "Credit Card (Visa ****4321)",
    location: "Naga City, Camarines Sur",
    couponDiscount: 0,
    delivery: null
  },
  {
    id: 6, // Yamaha Keyboard
    days: 3,
    shipping: 50,
    status: "approved",
    bookedFrom: "2025-11-15",
    bookedTo: "2025-11-18",
    dateBooked: "2025-11-14",
    paymentMethod: "GCash (0922****890)",
    location: "Naga City, Camarines Sur",
    couponDiscount: 0,
    delivery: {
      deliveryType: "shipping",
      current: "in-transit",
      estimatedDate: "2025-11-17",
      trackingNumber: "TRK112233445",
      currentLocation: "Warehouse",
      courier: "J&T Express",
      confirmedAt: "2025-11-14 11:30",
      preparingAt: "2025-11-15 09:00"
    }
  },
  {
    id: 7, // Projector Set
    days: 2,
    shipping: 50,
    status: "pending",
    bookedFrom: "2025-11-19",
    bookedTo: "2025-11-21",
    dateBooked: "2025-11-16",
    paymentMethod: "Credit Card (Visa ****9876)",
    location: "Naga City, Camarines Sur",
    couponDiscount: 5,
    delivery: {
      deliveryType: "shipping",
      current: "pending",
      estimatedDate: "2025-11-20",
      trackingNumber: null,
      currentLocation: "Processing",
      courier: null,
      confirmedAt: null,
      preparingAt: null
    }
  },
  {
    id: 8, // Camping Tent
    days: 1,
    shipping: 30,
    status: "cancelled",
    bookedFrom: null,
    bookedTo: null,
    dateBooked: null,
    paymentMethod: "Paypal (user2@example.com)",
    location: "Naga City, Camarines Sur",
    couponDiscount: 0,
    delivery: null
  },
];

export default sampleUserCart;
