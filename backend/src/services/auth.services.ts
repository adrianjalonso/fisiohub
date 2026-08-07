import { supabase } from "../database/supabase.js";

 export async function registerService(nome:string,email:string,password:string,titulo:string,crefito:string) {

  if(!nome||!email||!password){
    throw new Error("Todos os campos são obrigatorios")
  }


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
    senha:password,
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