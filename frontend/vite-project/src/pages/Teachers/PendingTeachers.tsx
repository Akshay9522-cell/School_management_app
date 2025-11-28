import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PendingTeachers() {
  const [pending, setPending] = useState([]);

  const fetchPending = async () => {
    const res = await axios.get("http://localhost:4000/api/teachers/user?role=teacher");
    

    setPending(res.data.data);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Teachers</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {pending.map((t: any) => (
            <tr key={t._id}>
              <td className="p-2 border">{t.name}</td>
              <td className="p-2 border">{t.email}</td>

              <td className="p-2 border">
                <Link
                  to={`/dashboard/add-teacher/?userId=${t._id}&name=${t.name}&email=${t.email}`}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Complete Profile
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
