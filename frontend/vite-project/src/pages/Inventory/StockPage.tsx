import { useState } from "react";
import StockInForm from "../../components/StockInForm";
import StockOutForm from "../../components/StockOutForm";

const StockPage = () => {
  const [mode, setMode] = useState<"IN" | "OUT">("IN");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stock Management</h1>
      
      <div className="mb-4 flex space-x-2">
        <button
          className={`px-4 py-2 rounded ${mode === "IN" ? "bg-green-500 text-white" : "bg-gray-200"}`}
          onClick={() => setMode("IN")}
        >
          Stock In
        </button>
        <button
          className={`px-4 py-2 rounded ${mode === "OUT" ? "bg-red-500 text-white" : "bg-gray-200"}`}
          onClick={() => setMode("OUT")}
        >
          Stock Out
        </button>
      </div>

      <div>
        {mode === "IN" ? <StockInForm /> : <StockOutForm />}
      </div>
    </div>
  );
};

export default StockPage;
