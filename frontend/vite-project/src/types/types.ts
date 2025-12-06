export type RouteType = {
  _id: string;
  name: string;
  description?: string;
};

export type BusType = {
  _id: string;
  busNumber: string;
  driverName: string;
  driverPhone?: string;
  routeId?: RouteType | null;
  isOnline?: boolean;
  createdAt?: string;
};
