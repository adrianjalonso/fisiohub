import { supabase } from "../database/supabase.js";
import bcrypt from "bcrypt"

 export async function registerService(nome:string,email:string,password:string,titulo:string,crefito:string) {

  if(!nome||!email||!password){
    throw new Error("Todos os campos são obrigatorios")
  }

  const passwordHash = await bcrypt.hash(password,10)


  const {data,error} = await supabase.from("users").select().eq("user_email",email).maybeSingle()

  if (error){
    throw new Error(error.message)
  }

  if (data){
    throw new Error("Usuário ja cadastrado!")
  } 

  const {data:newUser,error:insertError} = await supabase.from("users").insert({
    user_nome:nome,
    user_email:email,
    senha:passwordHash,
    genero:titulo,
    crefito:crefito
  })
  .select()
  .single()

  if(insertError){
    throw new Error(insertError.message)
  }

  return newUser
} 