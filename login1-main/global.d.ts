export {};

declare global {
  interface Window {
    otpless: (otplessUser: { token: string }) => void;
  }
}