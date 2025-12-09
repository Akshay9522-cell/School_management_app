import React, { useState, useEffect } from "react";
import {
  getLowStockReport,
  getStockReport,
  getUsageReport,
  getReturnReport,
  getPOStatusReport
} from "../../../api/inventoryApi";

type ReportType = "lowStock" | "stock" | "usage" | "returns" | "poStatus";

export default function Reports() {
  const [reportType, setReportType] = useState<ReportType>("lowStock");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const fetchReport = async () => {
    try {
      let res;
      switch (reportType) {
        case "lowStock":
          res = await getLowStockReport();
          break;
        case "stock":
          res = await getStockReport();
          break;
        case "usage":
          res = await getUsageReport();
          break;
        case "returns":
          res = await getReturnReport();
          break;
        case "poStatus":
          res = await getPOStatusReport();
          break;
      }
      setData(res.data || res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      {/* Report Type Buttons */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setReportType("lowStock")} className="px-4 py-2 bg-blue-600 text-white rounded">Low Stock</button>
        <button onClick={() => setReportType("stock")} className="px-4 py-2 bg-blue-600 text-white rounded">Stock</button>
        <button onClick={() => setReportType("usage")} className="px-4 py-2 bg-blue-600 text-white rounded">Usage</button>
        <button onClick={() => setReportType("returns")} className="px-4 py-2 bg-blue-600 text-white rounded">Returns</button>
        <button onClick={() => setReportType("poStatus")} className="px-4 py-2 bg-blue-600 text-white rounded">PO Status</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              {data[0] && Object.keys(data[0]).map((key) => (
                <th key={key} className="border px-4 py-2 text-left">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, idx: number) => (
              <tr key={idx} className="even:bg-gray-50">
                {Object.values(row).map((val: any, i) => (
                  <td key={i} className="border px-4 py-2">
                    {typeof val === "object" && val !== null ? JSON.stringify(val) : val}
                  </td>
                ))}
              </tr>
            ))}
            {!data.length && (
              <tr>
                <td colSpan={10} className="text-center p-4">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
