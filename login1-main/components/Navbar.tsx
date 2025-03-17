
// "use client";
// import { useRouter } from "next/navigation";
// import { Menu } from "lucide-react";
// import axios, { AxiosError } from "axios";

// interface NavbarProps {
//   toggleSidebar: () => void;
// }

// export default function Navbar({ toggleSidebar }: NavbarProps) {
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
  
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     router.replace("/login");
//   };
  

//   return (
//     <nav className="w-full bg-gray-900 px-6 py-4 flex justify-between items-center shadow-md">
//       {/* Menu Button (Visible on Small Screens) */}
//       <button onClick={toggleSidebar} className="md:hidden text-white hover:text-gray-300 transition">
//         <Menu size={26} />
//       </button>

//       {/* Logo */}
//       <h1 className="text-white text-xl font-bold tracking-wide">FLEX ZONE GYM</h1>

//       {/* Logout Button */}
//       <button
//         onClick={handleLogout}
//         className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-sm"
//       >
//         Logout
//       </button>
//     </nav>
//   );
// }

"use client";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import axios from "axios";

import useUserStore from "@/stores/userStore";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const router = useRouter();
  const logout = useUserStore(state => state.logout);
  
  const handleLogout = async () => {
    try {
      // Call your logout API if needed
      await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/api/logout`,  { withCredentials: true });
      
      // Clear authorization header
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear user state from Zustand store
      logout();
      
      // Show success message
      alert("Logged out successfully");
      
      // Redirect to login page
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      
      // Even if API call fails, we should still logout the user locally
      delete axios.defaults.headers.common['Authorization'];
      logout();
      router.replace("/login");
    }
  };
  
  return (
    <nav className="w-full bg-gray-900 px-6 py-4 flex justify-between items-center shadow-md">
      {/* Menu Button (Visible on Small Screens) */}
      <button onClick={toggleSidebar} className="md:hidden text-white hover:text-gray-300 transition">
        <Menu size={26} />
      </button>
      {/* Logo */}
      <h1 className="text-white text-xl font-bold tracking-wide">FLEX ZONE GYM</h1>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-sm"
      >
        Logout
      </button>
    </nav>
  );
}