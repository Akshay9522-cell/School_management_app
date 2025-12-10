import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStudentById } from '../../api/studentApi';

interface Marks {
  id?: string;
  subject: string;
  totalMarks: number;
  practicalMarks: number;
  theoryMarks: number;
}

interface Student {
  _id: string;
  name: string;
  classId: {
    name: string;
    section: string;
  };
  rollNo?: string;
}

const ReportCard = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [marks, setMarks] = useState<Marks[]>([
    { subject: 'Mathematics', totalMarks: 100, practicalMarks: 0, theoryMarks: 0 },
    { subject: 'Science', totalMarks: 100, practicalMarks: 0, theoryMarks: 0 },
    { subject: 'English', totalMarks: 100, practicalMarks: 0, theoryMarks: 0 },
    { subject: 'Hindi', totalMarks: 100, practicalMarks: 0, theoryMarks: 0 },
    { subject: 'Social Science', totalMarks: 100, practicalMarks: 0, theoryMarks: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const loadStudent = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getStudentById(id);
      setStudent(res.data.data);
    } catch (error) {
      console.error('Failed to load student:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateObtained = (index: number) => {
    const practical = Number(marks[index].practicalMarks) || 0;
    const theory = Number(marks[index].theoryMarks) || 0;
    return practical + theory;
  };

  const calculatePercentage = (index: number) => {
    const obtained = calculateObtained(index);
    const total = marks[index].totalMarks;
    return ((obtained / total) * 100).toFixed(1);
  };

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const calculateStatus = (percentage: number): string => {
    return percentage >= 50 ? 'PASS' : 'FAIL';
  };

  const updateMarks = (index: number, field: keyof Marks, value: string) => {
    const newMarks = [...marks];
    newMarks[index] = { ...newMarks[index], [field]: Number(value) || 0 };
    setMarks(newMarks);
  };

  const addSubject = () => {
    setMarks([...marks, { 
      subject: '', 
      totalMarks: 100, 
      practicalMarks: 0, 
      theoryMarks: 0 
    }]);
  };

  const deleteSubject = (index: number) => {
    setMarks(marks.filter((_, i) => i !== index));
  };

  const saveReport = () => {
    console.log('Saving report:', { studentId: id, marks });
    // Save to API here
    alert('Report saved successfully!');
    setEditing(false);
  };

  useEffect(() => {
    loadStudent();
  }, [id]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!student) return <div className="text-center p-8 text-red-600">Student not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border-4 border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 text-center">
          <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-wide mb-2">Green Valley Academy</h1>
          <p className="text-blue-100 text-lg font-medium">CBSE Affiliated | Est. 1985</p>
        </div>

        {/* Student Details & Controls */}
        <div className="p-8 border-b-2 border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Card</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-gray-700">Name:</span> {student.name}</p>
                <p><span className="font-semibold text-gray-700">Class:</span> {student.classId.name} - {student.classId.section}</p>
                <p><span className="font-semibold text-gray-700">Roll No:</span> {student.rollNo || 'N/A'}</p>
              </div>
            </div>
            <div className="text-center lg:col-span-2">
              <div className="inline-flex gap-2">
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-all"
                >
                  {editing ? 'Preview' : 'Edit Marks'}
                </button>
                {editing && (
                  <>
                    <button
                      onClick={addSubject}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-all"
                    >
                      Add Subject
                    </button>
                    <button
                      onClick={saveReport}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold transition-all"
                    >
                      Save Report
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Subject-wise Performance</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-slate-300 bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-slate-200">
                  <th className="border border-slate-300 px-4 py-4 text-left font-semibold text-gray-800">Subject</th>
                  <th className="border border-slate-300 px-4 py-4 text-center font-semibold text-gray-800 w-24">Total</th>
                  <th className="border border-slate-300 px-4 py-4 text-center font-semibold text-gray-800 w-28">Practical</th>
                  <th className="border border-slate-300 px-4 py-4 text-center font-semibold text-gray-800 w-28">Theory</th>
                  <th className="border border-slate-300 px-4 py-4 text-center font-semibold text-gray-800 w-28">Obtained</th>
                  <th className="border border-slate-300 px-4 py-4 text-center font-semibold text-gray-800 w-24">%</th>
                  <th className="border border-slate-300 px-4 py-4 text-center font-semibold text-gray-800 w-20">Grade</th>
                  <th className="border border-slate-300 px-4 py-4 text-center font-semibold text-gray-800 w-20">Status</th>
                  {editing && <th className="border border-slate-300 px-4 py-4 text-center font-semibold text-gray-800 w-16">Action</th>}
                </tr>
              </thead>
              <tbody>
                {marks.map((mark, index) => {
                  const percentage = Number(calculatePercentage(index));
                  const grade = calculateGrade(percentage);
                  const status = calculateStatus(percentage);
                  const obtained = calculateObtained(index);

                  return (
                    <tr key={mark.id || index} className="hover:bg-slate-50 transition-colors">
                      <td className="border border-slate-300 px-4 py-3">
                        {editing ? (
                          <input
                            type="text"
                            value={mark.subject}
                            onChange={(e) => updateMarks(index, 'subject', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Subject name"
                          />
                        ) : (
                          <span className="font-medium text-gray-900">{mark.subject}</span>
                        )}
                      </td>
                      <td className="border border-slate-300 px-2 py-3 text-center font-semibold text-gray-800">
                        {mark.totalMarks}
                      </td>
                      <td className="border border-slate-300 px-2 py-3 text-center">
                        {editing ? (
                          <input
                            type="number"
                            value={mark.practicalMarks}
                            onChange={(e) => updateMarks(index, 'practicalMarks', e.target.value)}
                            className="w-20 px-2 py-1 border border-slate-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-200"
                            min="0"
                          />
                        ) : (
                          <span className="font-semibold text-blue-600">{mark.practicalMarks}</span>
                        )}
                      </td>
                      <td className="border border-slate-300 px-2 py-3 text-center">
                        {editing ? (
                          <input
                            type="number"
                            value={mark.theoryMarks}
                            onChange={(e) => updateMarks(index, 'theoryMarks', e.target.value)}
                            className="w-20 px-2 py-1 border border-slate-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-200"
                            min="0"
                          />
                        ) : (
                          <span className="font-semibold text-blue-600">{mark.theoryMarks}</span>
                        )}
                      </td>
                      <td className="border border-slate-300 px-2 py-3 text-center font-bold text-green-600">
                        {obtained}/{mark.totalMarks}
                      </td>
                      <td className="border border-slate-300 px-2 py-3 text-center font-semibold text-green-700">
                        {percentage}%
                      </td>
                      <td className="border border-slate-300 px-2 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          grade === 'A+' ? 'bg-green-100 text-green-800' :
                          grade === 'A' ? 'bg-blue-100 text-blue-800' :
                          grade === 'B' ? 'bg-yellow-100 text-yellow-800' :
                          grade === 'C' ? 'bg-indigo-100 text-indigo-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {grade}
                        </span>
                      </td>
                      <td className="border border-slate-300 px-2 py-3 text-center font-bold">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          status === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {status}
                        </span>
                      </td>
                      {editing && (
                        <td className="border border-slate-300 px-2 py-3 text-center">
                          <button
                            onClick={() => deleteSubject(index)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="p-8 bg-gradient-to-r from-emerald-50 to-green-50 border-t-4 border-emerald-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-700 mb-2">
                {marks.reduce((sum, mark, i) => sum + Number(calculatePercentage(i)), 0) / marks.length || 0}%
              </div>
              <div className="text-sm text-gray-600 font-medium">Overall Average</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-700 mb-2">
                {calculateGrade(marks.reduce((sum, mark, i) => sum + Number(calculatePercentage(i)), 0) / marks.length || 0)}
              </div>
              <div className="text-sm text-gray-600 font-medium">Overall Grade</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-700 mb-2">
                {marks.filter((_, i) => calculateStatus(Number(calculatePercentage(i))) === 'PASS').length}/{marks.length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Pass Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
