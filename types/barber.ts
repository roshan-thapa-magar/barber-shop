// types/barber.ts
export interface Barber {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  status: "active" | "inactive";
}
