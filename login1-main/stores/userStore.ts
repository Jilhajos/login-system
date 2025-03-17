
// stores/userStore.ts
// import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'

// // Define user interface based on your API response
// interface User {
//   id: string;
//   email: string;
//   name?: string;
//   role: string;
//   // Add any other user properties returned by your API
// }

// interface UserState {
//   user: User | null;
//   isAuthenticated: boolean;
//   token: string | null;
  
//   // Simplified actions
//   setAuth: (token: string, user: User) => void;
//   logout: () => void;
// }

// const useUserStore = create<UserState>()(
//   persist(
//     (set) => ({
//       user: null,
//       isAuthenticated: false,
//       token: null,
      
//       setAuth: (token, user) => set({ 
//         user,
//         token,
//         isAuthenticated: true 
//       }),
      
//       logout: () => set({ 
//         user: null, 
//         isAuthenticated: false,
//         token: null
//       }),
//     }),
//     {
//       name: 'user-storage',
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({ 
//         user: state.user, 
//         isAuthenticated: state.isAuthenticated,
//         token: state.token
//       }),
//     }
//   )
// )

// export default useUserStore
// stores/userStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Define user interface based on your API response
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  age: number;
  gender: string;
  phone: string;
  emergency_contact: string;
  address: string;
  health_conditions: string;
  membership_plan: string;
  membership_status: string;
  trainer: string | null;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  
  // Simplified actions
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      
      setAuth: (token, user) => set({ 
        user,
        token,
        isAuthenticated: true 
      }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        token: null
      }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        token: state.token
      }),
    }
  )
)

export default useUserStore