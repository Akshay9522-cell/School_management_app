// BusTrackingWrapper.tsx
import { useParams } from "react-router-dom";
import BusTracking from "./BusTracking";

const BusTrackingWrapper = () => {
  const { busId } = useParams<{ busId: string }>();

  console.log("Bus ID from URL:", busId); // <-- check here

  if (!busId) return <p>No Bus ID provided</p>;

  return <BusTracking busId={busId} />;
};

export default BusTrackingWrapper;
