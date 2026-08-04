import { supabase } from "../database/supabase.js";

 export async function registerService(name:string,email:string,password:string) {

  if(!name||!email||!password){
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
    user_nome:name,
    user_email:email,
    senha:password
  })
  .select()
  .single()

  if(insertError){
    throw new Error(insertError.message)
  }

  return newUser
} 