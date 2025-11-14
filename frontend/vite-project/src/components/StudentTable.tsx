import React from "react";
import type { Student } from "../types/student";

type Props = {
  data: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (id: string) => void;
};

const StudentTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Roll No</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Class</th>
            <th className="px-4 py-2 text-left">Section</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student) => (
            <tr key={student._id} className="border-b">
              <td className="px-4 py-2">{student.rollNo}</td>
              <td className="px-4 py-2">{student.name}</td>
              <td className="px-4 py-2">{student.email}</td>
              <td className="px-4 py-2">{student.class}</td>
              <td className="px-4 py-2">{student.section || "-"}</td>
              <td className="px-4 py-2 space-x-2">
                {onEdit && (
                  <button
                    className="px-2 py-1 text-sm text-white bg-blue-500 rounded"
                    onClick={() => onEdit(student)}
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    className="px-2 py-1 text-sm text-white bg-red-500 rounded"
                    onClick={() => onDelete(student._id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
