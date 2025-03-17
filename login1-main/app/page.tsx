// "use client";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { Home } from "lucide-react";

// export default function HomePage() {
//   const router = useRouter();

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black">
//       {/* Main Container */}
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="w-full max-w-3xl bg-black border-4 border-[#4d000d] rounded-xl p-8 text-center shadow-2xl"
//       >
//         {/* Title */}
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, delay: 0.3 }}
//           className="text-4xl font-extrabold text-white"
//         >
//           Welcome to{" "}
//           <span className="text-[#ff4d4d]">Flex Zone Gym</span>
//         </motion.h1>

//         {/* Image */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, delay: 0.5 }}
//           className="mt-6 flex justify-center"
//         >
//           <Image
//             src="/assets/logo.png" // Ensure the image is inside the public folder
//             width={200}
//             height={250}
//             alt="Gym Image"
//             className="rounded-lg shadow-lg "
//           />
//         </motion.div>

//         {/* Buttons */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, delay: 0.7 }}
//           className="mt-8 flex justify-center gap-6"
//         >
//           {/* Login Button */}
//           <button
//             onClick={() => router.push("/login")}
//             className="px-6 py-3 bg-[#ff4d4d] text-white font-semibold rounded-lg shadow-md hover:bg-[#cc0000] transition-transform duration-300 transform hover:scale-105"
//           >
//             Login
//           </button>

//           {/* Register Button */}
//           <button
//             onClick={() => router.push("/register")}
//             className="px-6 py-3 bg-transparent border-2 border-[#ff4d4d] text-[#ff4d4d] font-semibold rounded-lg shadow-md hover:bg-[#ff4d4d] hover:text-white transition-transform duration-300 transform hover:scale-105"
//           >
//             Register
//           </button>
//         </motion.div>
//       </motion.div>
//       <div className="flex justify-center mt-4">
//       <Link href="https://flexzone-gym.vercel.app/" className="text-red-600 hover:text-red-800 transition-all duration-300 flex items-center justify-center">
//       <Home className="w-6 h-6 md:w-8 md:h-8 transition-transform transform hover:scale-110" />
      
//       </Link>

//     </div>
//     </div>
//   );
// }
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Home } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl bg-black border-4 border-[#4d000d] rounded-xl p-8 text-center shadow-2xl"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-4xl font-extrabold text-white"
        >
          Welcome to{" "}
          <span className="text-[#ff4d4d]">Flex Zone Gym</span>
        </motion.h1>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-6 flex justify-center"
        >
          <Image
            src="/assets/logo.png" // Ensure the image is inside the public folder
            width={200}
            height={250}
            alt="Gym Image"
            className="rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-8 flex justify-center gap-6"
        >
          {/* Login Button */}
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-[#ff4d4d] text-white font-semibold rounded-lg shadow-md hover:bg-[#cc0000] transition-transform duration-300 transform hover:scale-105"
          >
            Login
          </button>

          {/* Register Button */}
          <button
            onClick={() => router.push("/register")}
            className="px-6 py-3 bg-transparent border-2 border-[#ff4d4d] text-[#ff4d4d] font-semibold rounded-lg shadow-md hover:bg-[#ff4d4d] hover:text-white transition-transform duration-300 transform hover:scale-105"
          >
            Register
          </button>
        </motion.div>
      </motion.div>

      {/* Home Icon */}
      <div className="mt-8">
        <Link
          href="https://flexzone-gym.vercel.app/"
          className="text-red-600 hover:text-red-800 transition-all duration-300 flex items-center justify-center"
        >
          <Home className="w-6 h-6 md:w-8 md:h-8 transition-transform transform hover:scale-110" />
        </Link>
      </div>
    </div>
  );
}


