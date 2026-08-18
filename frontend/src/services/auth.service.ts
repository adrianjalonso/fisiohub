import api from "../api/api";

export async function register(userData:{
  nome: string,
  email: string,
  password: string,
  titulo:string,
}) {
  const response = await fetch(`${api}auth/register`,{
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