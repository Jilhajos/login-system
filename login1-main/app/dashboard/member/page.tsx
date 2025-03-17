// "use client";

// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { Loader, CheckCircle, XCircle } from "lucide-react";
// import useUserStore from "../../../stores/userStore";
// import { useSearchParams, useRouter } from "next/navigation";

// // Move constants outside component to avoid re-creation on render
// const MEMBERSHIP_PLANS = [
//   { name: "Monthly", price: 1000 },
//   { name: "Quarterly", price: 2500 },
//   { name: "Annual", price: 5000 },
// ];

// export default function DashboardHome() {
//   const { user, isAuthenticated } = useUserStore();
//   const [loading, setLoading] = useState(true);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [paymentStatus, setPaymentStatus] = useState({
//     isChecking: false,
//     message: "",
//     success: false,
//   });

//   // Handle authentication redirect in a separate useEffect
//   useEffect(() => {
//     if (loading) return; // Don't redirect while still loading
    
//     if (!isAuthenticated || !user) {
//       router.push("/login");
//     }
//   }, [isAuthenticated, user, loading, router]);

//   // Check payment status when transactionId is present
//   useEffect(() => {
//     const transactionId = searchParams.get("transactionId");
    
//     if (!transactionId || !isAuthenticated) {
//       setLoading(false);
//       return;
//     }
    
//     const checkPaymentStatus = async () => {
//       setPaymentStatus({ isChecking: true, message: "Checking payment status...", success: false });
      
//       try {
//         const { data } = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/api/payment-status?transactionId=${transactionId}`,
//           { withCredentials: true }
//         );

//         setPaymentStatus({
//           isChecking: false,
//           message: data.status === "Active" 
//             ? `Your ${data.plan} membership is now active! Valid until ${new Date(data.expiryDate).toLocaleDateString()}`
//             : "Payment was not successful. Please try again.",
//           success: data.status === "Active"
//         });
//         setLoading(false);
//       } catch (err) {
//         console.error("Payment error:", err);
//         setPaymentStatus({
//           isChecking: false,
//           message: "Error checking payment status",
//           success: false,
//         });
//         alert("Error checking payment status");
//         setLoading(false);
//       }
//     };

//     checkPaymentStatus();
//   }, [searchParams, isAuthenticated]);

//   // Simplified initialization - only set loading to false if no transaction ID to check
//   useEffect(() => {
//     if (!searchParams.get("transactionId")) {
//       setLoading(false);
//     }
//   }, [searchParams]);

//   // Memoize event handlers
//   const handleSelectPlan = useCallback((plan) => {
//     setSelectedPlan(plan);
//   }, []);

//   const handlePayment = useCallback(async () => {
//     if (!selectedPlan) {
//       alert("Please select a membership plan");
//       return;
//     }

//     try {
//       const { data } = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/api/pay`,
//         { plan: selectedPlan.name, amount: selectedPlan.price },
//         { withCredentials: true }
//       );

//       if (data.paymentUrl) {
//         window.location.href = data.paymentUrl;
//       } else {
//         alert("Payment initialization failed. Try again");
//       }
//     } catch (err) {
//       console.error("Payment error:", err);
//       alert("Error processing payment");
//     }
//   }, [selectedPlan]);

//   // Show loader when loading
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
//         <Loader className="animate-spin h-12 w-12 text-red-500" />
//       </div>
//     );
//   }

//   // Show skeleton UI when not authenticated instead of redirecting in render phase
//   if (!isAuthenticated || !user) {
//     return (
//       <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
//         <div className="animate-pulse">
//           <div className="h-8 w-64 bg-gray-700 rounded mb-4"></div>
//           <div className="h-4 w-48 bg-gray-700 rounded mb-8"></div>
//           <div className="h-32 bg-gray-800 rounded-lg"></div>
//         </div>
//       </div>
//     );
//   }

//   // Derive these values to avoid storing them in state
//   const isActive = user.membership_status === "active";
//   const isButtonDisabled = isActive || paymentStatus.isChecking;
//   const buttonText = isActive
//     ? "Membership Active"
//     : paymentStatus.isChecking
//     ? "Checking Payment..."
//     : "Proceed to Payment";

//   return (
//     <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
//       <h1 className="text-3xl font-bold">Welcome, {user.name || user.email.split('@')[0]}</h1>
//       <p className="text-gray-400">{user.email}</p>

//       {user.role && <p className="text-gray-400 mt-1">Account Type: {user.role}</p>}

//       {paymentStatus.message && (
//         <div className={`mt-4 p-4 rounded-lg ${paymentStatus.success ? "bg-green-800" : "bg-red-800"}`}>
//           <p className="flex items-center">
//             {paymentStatus.success ? (
//               <CheckCircle className="h-5 w-5 mr-2" />
//             ) : (
//               <XCircle className="h-5 w-5 mr-2" />
//             )}
//             {paymentStatus.message}
//           </p>
//         </div>
//       )}

//       <p className="mt-4 flex items-center space-x-2">
//         <strong className="text-lg">Membership Status:</strong>
//         {isActive ? (
//           <span className="text-green-400 flex items-center">
//             <CheckCircle className="h-5 w-5 mr-1" /> Active
//           </span>
//         ) : (
//           <span className="text-red-400 flex items-center">
//             <XCircle className="h-5 w-5 mr-1" /> Inactive
//           </span>
//         )}
//       </p>

//       <h2 className="text-2xl font-bold my-6 text-center">Choose a Membership Plan</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {MEMBERSHIP_PLANS.map((plan) => (
//           <div
//             key={plan.name}
//             className={`p-6 rounded-lg cursor-pointer ${
//               selectedPlan?.name === plan.name ? "border-2 border-red-500 bg-gray-700" : "border border-gray-600 bg-gray-800 hover:border-red-400"
//             }`}
//             onClick={() => handleSelectPlan(plan)}
//           >
//             <h3 className="text-xl font-semibold text-center">{plan.name}</h3>
//             <p className="text-gray-300 text-center mt-2 text-lg">₹{plan.price}</p>
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={handlePayment}
//         disabled={isButtonDisabled}
//         className={`w-full mt-8 py-3 rounded-lg font-semibold text-lg ${
//           isButtonDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
//         }`}
//       >
//         {buttonText}
//       </button>
//     </div>
//   );
// }
//233333333333
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { Loader, CheckCircle, XCircle } from "lucide-react";
// import useUserStore from "../../../stores/userStore";
// import { useSearchParams, useRouter } from "next/navigation";

// export default function DashboardHome() {
//   const { user, isAuthenticated } = useUserStore();
//   const [loading, setLoading] = useState(true);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [membershipPlans, setMembershipPlans] = useState([]);
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [paymentStatus, setPaymentStatus] = useState({
//     isChecking: false,
//     message: "",
//     success: false,
//   });

//   // Fetch membership plans
//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/api/membership-plans`);
//         setMembershipPlans(data);
//       } catch (err) {
//         console.error("Error fetching plans:", err);
//       }
//     };

//     fetchPlans();
//   }, []);

//   // Handle authentication redirect
//   useEffect(() => {
//     if (loading) return;

//     if (!isAuthenticated || !user) {
//       router.push("/login");
//     }
//   }, [isAuthenticated, user, loading, router]);

//   // Check payment status when transactionId is present
//   useEffect(() => {
//     const transactionId = searchParams.get("transactionId");

//     if (!transactionId || !isAuthenticated) {
//       setLoading(false);
//       return;
//     }

//     const checkPaymentStatus = async () => {
//       setPaymentStatus({ isChecking: true, message: "Checking payment status...", success: false });

//       try {
//         const { data } = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/api/payment-status?transactionId=${transactionId}`,
//           { withCredentials: true }
//         );

//         setPaymentStatus({
//           isChecking: false,
//           message: data.status === "Active"
//             ? `Your ${data.plan} membership is now active! Valid until ${new Date(data.expiryDate).toLocaleDateString()}`
//             : "Payment was not successful. Please try again.",
//           success: data.status === "Active",
//         });
//         setLoading(false);
//       } catch (err) {
//         console.error("Payment error:", err);
//         setPaymentStatus({
//           isChecking: false,
//           message: "Error checking payment status",
//           success: false,
//         });
//         alert("Error checking payment status");
//         setLoading(false);
//       }
//     };

//     checkPaymentStatus();
//   }, [searchParams, isAuthenticated]);

//   // Simplified initialization
//   useEffect(() => {
//     if (!searchParams.get("transactionId")) {
//       setLoading(false);
//     }
//   }, [searchParams]);

//   // Memoize event handlers
//   const handleSelectPlan = useCallback((plan) => {
//     setSelectedPlan(plan);
//   }, []);

//   const handlePayment = useCallback(async () => {
//     if (!selectedPlan) {
//       alert("Please select a membership plan");
//       return;
//     }

//     try {
//       const { data } = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/api/pay`,
//         { plan: selectedPlan.name, amount: selectedPlan.price },
//         { withCredentials: true }
//       );

//       if (data.paymentUrl) {
//         window.location.href = data.paymentUrl;
//       } else {
//         alert("Payment initialization failed. Try again");
//       }
//     } catch (err) {
//       console.error("Payment error:", err);
//       alert("Error processing payment");
//     }
//   }, [selectedPlan]);

//   // Show loader when loading
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
//         <Loader className="animate-spin h-12 w-12 text-red-500" />
//       </div>
//     );
//   }

//   // Show skeleton UI when not authenticated
//   if (!isAuthenticated || !user) {
//     return (
//       <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
//         <div className="animate-pulse">
//           <div className="h-8 w-64 bg-gray-700 rounded mb-4"></div>
//           <div className="h-4 w-48 bg-gray-700 rounded mb-8"></div>
//           <div className="h-32 bg-gray-800 rounded-lg"></div>
//         </div>
//       </div>
//     );
//   }

//   // Derive these values to avoid storing them in state
//   const isActive = user.membership_status === "active";
//   const isButtonDisabled = isActive || paymentStatus.isChecking;
//   const buttonText = isActive
//     ? "Membership Active"
//     : paymentStatus.isChecking
//     ? "Checking Payment..."
//     : "Proceed to Payment";

//   return (
//     <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
//       <h1 className="text-3xl font-bold">Welcome, {user.name || user.email.split('@')[0]}</h1>
//       <p className="text-gray-400">{user.email}</p>

//       {user.role && <p className="text-gray-400 mt-1">Account Type: {user.role}</p>}

//       {paymentStatus.message && (
//         <div className={`mt-4 p-4 rounded-lg ${paymentStatus.success ? "bg-green-800" : "bg-red-800"}`}>
//           <p className="flex items-center">
//             {paymentStatus.success ? (
//               <CheckCircle className="h-5 w-5 mr-2" />
//             ) : (
//               <XCircle className="h-5 w-5 mr-2" />
//             )}
//             {paymentStatus.message}
//           </p>
//         </div>
//       )}

//       <p className="mt-4 flex items-center space-x-2">
//         <strong className="text-lg">Membership Status:</strong>
//         {isActive ? (
//           <span className="text-green-400 flex items-center">
//             <CheckCircle className="h-5 w-5 mr-1" /> Active
//           </span>
//         ) : (
//           <span className="text-red-400 flex items-center">
//             <XCircle className="h-5 w-5 mr-1" /> Inactive
//           </span>
//         )}
//       </p>

//       <h2 className="text-2xl font-bold my-6 text-center">Choose a Membership Plan</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {membershipPlans.map((plan) => (
//           <div
//             key={plan.name}
//             className={`p-6 rounded-lg cursor-pointer ${
//               selectedPlan?.name === plan.name ? "border-2 border-red-500 bg-gray-700" : "border border-gray-600 bg-gray-800 hover:border-red-400"
//             }`}
//             onClick={() => handleSelectPlan(plan)}
//           >
//             <h3 className="text-xl font-semibold text-center">{plan.name}</h3>
//             <p className="text-gray-300 text-center mt-2 text-lg">₹{plan.price}</p>
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={handlePayment}
//         disabled={isButtonDisabled}
//         className={`w-full mt-8 py-3 rounded-lg font-semibold text-lg ${
//           isButtonDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
//         }`}
//       >
//         {buttonText}
//       </button>
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setLoading(false);
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Error loading your profile");
        // If authentication fails, redirect to login
        if ((err as Error).message.includes('401')) {
          localStorage.removeItem('authToken');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    router.push('/login');
  }, [router]);

  // Show loader when loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <Loader className="animate-spin h-12 w-12 text-red-500" />
      </div>
    );
  }

  // Show login redirect if no user
  if (!user) {
    return (
      <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
        <div className="text-center">
          <p className="mb-4">Please log in to view your dashboard</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-sm"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
      {error && (
        <div className="mb-6 p-4 bg-red-800 rounded-lg">
          <p className="flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            {error}
          </p>
        </div>
      )}

      <div className="mb-8 p-6 rounded-lg border border-gray-700 bg-gray-800">
        <h1 className="text-3xl font-bold">Welcome, {user.full_name}</h1>
        <p className="text-gray-400 mt-2">{user.email}</p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Membership Details</h3>
            <p className="flex items-center space-x-2">
              <strong>Status:</strong>
              {user.membership_status === "Active" ? (
                <span className="text-green-400 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-1" /> Active
                </span>
              ) : (
                <span className="text-red-400 flex items-center">
                  <XCircle className="h-5 w-5 mr-1" /> Inactive
                </span>
              )}
            </p>
            <p><strong>ID:</strong> {user.membershipID}</p>
            {user.membership_plan && <p><strong>Plan:</strong> {user.membership_plan}</p>}
            {user.payment_status && <p><strong>Payment:</strong> {user.payment_status}</p>}
          </div>

          <div className="p-4 bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Phone:</strong> {user.phone_number}</p>
            <p><strong>Address:</strong> {user.address}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}