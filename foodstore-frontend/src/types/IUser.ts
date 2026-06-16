import type { Rol } from "./Rol";

export interface IUser {
  id?: number; // TPI: Agregué a esta interfaz los campos id y nombre, que no estaban y que los va a retomar el backend. De momento quedaron con `?` como opcionales para evitar errores.
  nombre?: string;
  email: string;
  rol: Rol;
}