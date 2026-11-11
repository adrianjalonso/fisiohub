import api from "../api/api";
import { api as request } from "../lib/api";

export type Perfil = {
  user_id: number;
  user_nome: string;
  user_email: string;
  titulo: string | null;
  crefito: string | null;
};

export type DadosPerfil = {
  nome: string;
  titulo: string;
  email: string;
  crefito: string;
};

export async function register(userData:{
  nome: string,
  email: string,
  password: string,
  titulo:string,
}) {
  const response = await fetch(`${api}/auth/register`,{
    method: "POST",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData),
  })
  const data = await response.json()

  if(!response.ok){
    throw new Error(data.message);
  }

  return data;
}

export function getProfile() {
  return request<Perfil>("/auth/perfil");
}

export function updateProfile(userData: DadosPerfil) {
  return request<Perfil>("/auth/perfil", {
    method: "PATCH",
    body: JSON.stringify(userData),
  });
}
