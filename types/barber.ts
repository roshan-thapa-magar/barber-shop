export interface Barber {
  id: string;
  _id: string; // always the unique identifier
  name: string;
  email: string;
  phone: string;
  image?: string;
  status: "active" | "inactive";
}
