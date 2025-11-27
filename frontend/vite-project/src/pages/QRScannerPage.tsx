import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "react-hot-toast";

export default function QRScannerPage() {
  const [busy, setBusy] = useState(false);
  const [lastAction, setLastAction] = useState<"checked-in" | "checked-out" | null>(null);

  const scannerRef = useRef<any>(null);
  const teacherId = Cookies.get("teacherId");
  const token = Cookies.get("token");

  if (!teacherId) {
    toast.error("Teacher ID missing. Please login again.");
  }

  // ---------- START SCANNER ----------
  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scannerRef.current.render(onScanSuccess, () => {});
    return () => {
      try {
        scannerRef.current?.clear();
      } catch {}
    };
  }, []);

  // ---------- SCAN SUCCESS ----------
  const onScanSuccess = async (qrText: string) => {
    if (busy) return;
    setBusy(true);

    try {
      console.log("QR Scanned:", qrText);

      const url = new URL(qrText);
     let classroomCode = url.searchParams.get("classroomCode");

     if (!classroomCode) {
  const parts = url.pathname.split("/");
  classroomCode = parts[parts.length - 1] || null;
}

console.log("Extracted classroomCode:", classroomCode);

      if (!classroomCode) {
        toast.error("Invalid QR Code");
        setBusy(false);
        return;
      }

      // Get location
      const coords = await getLocation();

      // ------------- CALL CHECK-IN -------------
      const checkInRes = await callAttendanceApi(
        "http://localhost:4000/api/attendance/check-in",
        {
          teacherId,
          classroomCode:classroomCode,
          lat: coords.lat,
          lng: coords.lng,
        }
      );
      console.log(checkInRes)

      if (checkInRes.success) {
        setLastAction("checked-in");
        toast.success("Check-in successful");
      } else {
        const msg = (checkInRes.message || "").toLowerCase();

        if (msg.includes("already checked in")) {
          // -------- TRY CHECK-OUT --------
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
    body: { teacherId: string | undefined; classroomCode: string; lat: number; lng: number }
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
        pos => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        err => {
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
