import type { Rol } from "./Rol";

export interface IUser {
  id?: number; // TPI: Agregué a esta interfaz los campos id, nombre, apellido y celular, que no estaban y que los va a retomar el backend. De momento quedaron con `?` como opcionales para evitar errores.
  nombre?: string;
  apellido?: string;
  email: string;
  celular?: string;
  rol: Rol;
}