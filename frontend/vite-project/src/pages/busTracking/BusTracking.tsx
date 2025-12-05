import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import React, { useEffect, useState, useRef } from "react";
import { socket } from "../../socket";

const busIcon = L.icon({
  iconUrl: "/bus-icon.png",
  iconSize: [36, 36],
});

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);
  return null;
};

const BusTracking: React.FC<{ busId: string }> = ({ busId }) => {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    socket.emit("joinBus", busId);

    socket.on("busLocationUpdate", (data: { lat: number; lng: number }) => {
      setLat(data.lat);
      setLng(data.lng);
      console.log(data)

      if (markerRef.current) {
        markerRef.current.setLatLng([data.lat, data.lng]);
      }
    });

    return () => {
      socket.emit("leaveBus", busId);
      socket.off("busLocationUpdate");
    };
  }, [busId]);

  if (lat === null || lng === null) {
    return <p>Loading live bus location...</p>;
  }

  return (
    <div style={{ height: "80vh", width: "100%", overflow: "hidden" }}>
      <MapContainer center={[lat,lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
        <RecenterMap lat={lat} lng={lng} />
        <TileLayer url="http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}" />
        <Marker position={[lat, lng]} icon={busIcon} ref={markerRef}>
          <Popup>Bus Live Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default BusTracking;
