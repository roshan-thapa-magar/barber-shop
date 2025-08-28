import React from "react";
import ShopStatusForm from "@/components/ShopStatusForm"; // adjust path if needed
export default function page() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Shop Status</h1>
      <ShopStatusForm />
    </div>
  );
}
