import { useState, useEffect } from "react";
import { getPayments } from "../../api/inventoryApi";

const PaymentPage = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getPayments({ page: 1, limit: 50 });
      setPayments(data.payments);
    } catch (err) {
      console.error(err);3
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Currency</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Reference</th>
              <th className="px-4 py-2">Item</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="px-4 py-2">{p.amount}</td>
                  <td className="px-4 py-2">{p.currency}</td>
                  <td className="px-4 py-2">{new Date(p.paymentDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{p.reference || "-"}</td>
                  <td className="px-4 py-2">{p.relatedItem?.name || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentPage;
