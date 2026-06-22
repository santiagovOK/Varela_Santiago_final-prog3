import type { IUser } from "../types/IUser";
import type { Rol } from "../types/Rol";
import { getUSer, removeUser } from "./localStorage";
import { navigate } from "./navigate";

export const checkAuhtUser = (
  redireccion1: string,
  redireccion2: string,
  rol: Rol
): IUser | null => {
  const userStr = getUSer();

  // TPI: Si no se inicio se sión o la sesión expiro, envía al usuario a la página de login
  if (!userStr) {
    navigate(redireccion1);
    return null;
  }

  // TPI: Condición para evaluar si el rol del usuario es correcto. Si dice usuario, redirige al inicio del cliente (redirección 2)
  const parseUser: IUser = JSON.parse(userStr);
  if (parseUser.rol !== rol) {
    navigate(redireccion2);
    return null;
  }
  
  return parseUser;
};

export const logout = () => {
  removeUser();
  navigate("/src/pages/auth/login/login.html");
};