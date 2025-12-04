import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import React, { useEffect, useState } from "react";
import { socket } from "../../socket";

const busIcon = L.icon({
  iconUrl: "/bus-icon.png",
  iconSize: [36, 36],
});

const BusTracking: React.FC<{ busId: string }> = ({ busId }) => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  useEffect(() => {
    socket.emit("joinBusRoom", busId);


    socket.on("busLocationUpdate", (data) => {
      setLat(data.lat);
      setLng(data.lng);
    });

    return () => {
      socket.emit("leaveBus", busId);
      socket.off("busLocationUpdate");
    };
  }, [busId]);

  return (
    <MapContainer center={[lat, lng]} zoom={15} style={{ height: "400px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[lat, lng]} icon={busIcon}>
        <Popup>Bus Live Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default BusTracking;
