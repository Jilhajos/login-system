// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// // Define the Payment type
// interface Payment {
//   date: Date;
//   amount: number;
//   plan: string;
// }

// export default function PaymentHistoryPage() {
//   const [payments, setPayments] = useState<Payment[]>([]);

//   useEffect(() => {
//     const fetchPaymentHistory = async () => {
//       try {
//         const { data } = await axios.get<Payment[]>("http://localhost:5000/api/auth/payment-history");
//         setPayments(data);
//       } catch (error) {
//         toast.error("Failed to fetch payment history");
//       }
//     };

//     fetchPaymentHistory();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold">Payment History</h1>

//       <div className="mt-4 space-y-4">
//         {payments.map((payment: Payment, index: number) => (
//           <div key={index} className="p-4 border border-gray-600 rounded-lg">
//             <p>Date: {new Date(payment.date).toLocaleDateString()}</p>
//             <p>Amount: ₹{payment.amount}</p>
//             <p>Plan: {payment.plan}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// Define the Payment type
interface Payment {
  date: Date;
  amount: number;
  plan: string;
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const { data } = await axios.get<Payment[]>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/payment-history`, 
          { withCredentials: true } // Ensures session cookies are sent
        );
        setPayments(data);
      } catch  {
        toast.error("Failed to fetch payment history");
      }
    };

    fetchPaymentHistory();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Payment History</h1>

      <div className="mt-4 space-y-4">
        {payments.map((payment: Payment, index: number) => (
          <div key={index} className="p-4 border border-gray-600 rounded-lg">
            <p>Date: {new Date(payment.date).toLocaleDateString()}</p>
            <p>Amount: ₹{payment.amount}</p>
            <p>Plan: {payment.plan}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
