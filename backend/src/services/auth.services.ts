import { supabase } from "../database/supabase.js";

 export async function registerService(name:string,email:string,password:string) {

  if(!name||!email||!password){
    throw new Error("Todos os campos são obrigatorios")
  }

  const {data,error} = await supabase.from("users").insert({
    user_nome:name,
    user_email: email,
    senha:password
  }).select()

  if(error){
    throw new Error(error.message)
  }

  return data
} 