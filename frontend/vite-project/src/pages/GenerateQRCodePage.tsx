import { useEffect, useState } from "react";
import QRCode from "qrcode";
import axios from "axios";

import { getClassRoom } from "../api/qrApi";

type Classroom = {
  _id: string;
  name: string;
  code: string;
};

export default function GenerateQRCodePage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Fetch classrooms from backend
  const fetchClassrooms = async () => {
    try {
      const res = await getClassRoom(); // replace with your endpoint
      setClassrooms(res.data.data);
      console.log(res.data.data)
     
    } catch (err) {
      console.error(err);
    } 
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  // Generate QR code
  const generateQRCode = async (classroom: Classroom) => {
  try {
    setSelectedClassroom(classroom);

    const res = await axios.get(`http://localhost:4000/api/qr/${classroom._id}`);
    const qr = res.data.qrCode;
    console.log(res.data.qrCode)

    setQrDataUrl(qr);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Generate Classroom QR Code</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Select Classroom:</label>
        <select
          className="border rounded p-2 w-full"
          onChange={(e) => {
            const classroom = classrooms.find(c => c._id === e.target.value);
            if (classroom) generateQRCode(classroom);
          }}
          value={selectedClassroom?._id || ""}
        >
          <option value="">-- Select Classroom --</option>
          {classrooms.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name} ({cls.code})
            </option>
          ))}
        </select>
      </div>

      {qrDataUrl && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold mb-2">
            QR Code for {selectedClassroom?.name}
          </h2>
          <img src={qrDataUrl} alt="QR Code" className="mx-auto border p-2 bg-white" />
          <p className="mt-2 text-sm text-gray-600">
            Scan this QR to mark attendance
          </p>
        </div>
      )}
    </div>
  );
}
