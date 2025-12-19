// QRScannerPage.tsx
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function QRScannerPage() {
  const [busy, setBusy] = useState(false);
  const [lastAction, setLastAction] =
    useState<"checked-in" | "checked-out" | null>(null);

  const scannerRef = useRef<any>(null);
  const navigate = useNavigate();

  const teacherId = Cookies.get("teacherId") || null;
  console.log(teacherId)
  const role = Cookies.get("role") || null;
  const token = Cookies.get("token") || null;

  // ---------- START SCANNER ----------
  useEffect(() => {
    // Only teachers with valid teacherId and token can use this page
    if (role !== "teacher" || !teacherId || !token) {
      toast.error("Only logged-in teachers can use QR scanner");
      navigate("/dashboard");
      return;
    }

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scannerRef.current = scanner;
    scanner.render(onScanSuccess, () => {});

    return () => {
      try {
        scanner.clear();
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, teacherId, token, navigate]);

  // ---------- SCAN SUCCESS ----------
 const onScanSuccess = async (qrText: string) => {
  if (busy) return;
  setBusy(true);

  try {
    console.log("QR Scanned:", qrText);

    let classroomCode: string | null = null;

    // 1) Try JSON first: {"classroomCode":"CLASS103"}
    try {
      const parsed = JSON.parse(qrText);
      if (parsed && typeof parsed === "object" && parsed.classroomCode) {
        classroomCode = String(parsed.classroomCode);
      }
    } catch {
      // not JSON, ignore
    }

    // 2) If still not found, fall back to URL or plain code
    if (!classroomCode) {
      try {
        const url = new URL(qrText, window.location.origin);
        classroomCode = url.searchParams.get("classroomCode");

        if (!classroomCode) {
          const parts = url.pathname.split("/");
          classroomCode = parts[parts.length - 1] || null;
        }
      } catch {
        classroomCode = qrText?.trim() || null;
      }
    }

    console.log("Extracted classroomCode:", classroomCode);

    if (!classroomCode) {
      toast.error("Invalid QR Code");
      setBusy(false);
      return;
    }

    if (!teacherId) {
      toast.error("Teacher ID missing. Please login again.");
      setBusy(false);
      return;
    }

    const coords = await getLocation();
    console.log(coords)

    const checkInRes = await callAttendanceApi(
      "http://localhost:4000/api/attendance/check-in", // ensure this matches your Postman URL
      {
        teacherId,
        classroomCode,
        lat: coords.lat,
        lng: coords.lng,
      }
    );

    // ... rest of your existing logic (same as before)


      if (checkInRes.success) {
        setLastAction("checked-in");
        toast.success("Check-in successful");
      } else {
        const msg = (checkInRes.message || "").toLowerCase();

        if (msg.includes("already checked in")) {
          const checkOutRes = await callAttendanceApi(
            "http://localhost:4000/api/attendance/check-out",
            {
              teacherId,
              classroomCode,
              lat: coords.lat,
              lng: coords.lng,
            }
          );

          if (checkOutRes.success) {
            setLastAction("checked-out");
            toast.success("Check-out successful");
          } else {
            toast.error(checkOutRes.message || "Check-out failed");
          }
        } else {
          toast.error(checkInRes.message || "Check-in failed");
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Scan error");
    } finally {
      setTimeout(() => setBusy(false), 1500);
    }
  };

  // ---------- API CALL HELPER ----------
  const callAttendanceApi = async (
    path: string,
    body: { teacherId: string; classroomCode: string; lat: number; lng: number }
  ): Promise<{ success: boolean; message?: string; data?: any }> => {
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        return { success: false, message: json?.message || "Server error" };
      }

      return { success: true, data: json };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  // ---------- GET LOCATION ----------
  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          toast.error("Location access denied");
          reject(err);
        }
      );
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>QR Scanner</h2>
      <div id="qr-reader" style={{ width: "100%" }}></div>

      {lastAction === "checked-in" && (
        <p style={{ color: "green" }}>Last Action: Checked In</p>
      )}
      {lastAction === "checked-out" && (
        <p style={{ color: "blue" }}>Last Action: Checked Out</p>
      )}
    </div>
  );
}
