// types/barber.ts
export interface Barber {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  status: "active" | "inactive";
}
