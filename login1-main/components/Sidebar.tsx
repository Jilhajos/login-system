
// import Link from "next/link";

// export default function Sidebar() {
//   return (
//     <div className="w-64 bg-gray-800 text-white h-screen p-4">
//       <div className="text-center mb-6">
//         <h2 className="text-xl font-semibold">FLEX ZONE GYM</h2>
//       </div>
//       <nav>
//         <ul className="space-y-2">
//           <li>
//             <Link href="/dashboard/member" className="block p-2 hover:bg-gray-700 rounded">
//               Home
//             </Link>
//           </li>
          
//           <li>
//             <Link href="/dashboard/member/payment-history" className="block p-2 hover:bg-gray-700 rounded">
//               Payment History
//             </Link>
//           </li>
//           <li>
//             <Link  href="/dashboard/member/assigned-trainer" className="block p-2 hover:bg-gray-700 rounded">
//               Assigned Trainer
//             </Link>
//           </li>
//           <li>
//             <Link href="/dashboard/member/notifications" className="block p-2 hover:bg-gray-700 rounded">
//               Notifications
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, Dumbbell, Bell } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", path: "/dashboard/member", icon: <Home size={18} /> },
    { name: "Payment History", path: "/dashboard/member/payment-history", icon: <CreditCard size={18} /> },
    { name: "Assigned Trainer", path: "/dashboard/member/assigned-trainer", icon: <Dumbbell size={18} /> },
    { name: "Notifications", path: "/dashboard/member/notifications", icon: <Bell size={18} /> },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-6 flex flex-col">
      {/* Logo Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-wide">FLEX ZONE GYM</h2>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-3">
          {menuItems.map(({ name, path, icon }) => (
            <li key={path}>
              <Link
                href={path}
                className={`flex items-center gap-3 p-3 rounded-md transition-all 
                ${
                  pathname === path
                    ? "bg-red-600 text-white shadow-md border-l-4 border-red-500"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                {icon}
                <span className="text-sm font-medium">{name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
