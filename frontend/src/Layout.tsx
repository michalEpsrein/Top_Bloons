import React from "react";

export default function Layout({ children }) {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50"
      dir="rtl"
    >
      {children}
    </div>
  );
}
