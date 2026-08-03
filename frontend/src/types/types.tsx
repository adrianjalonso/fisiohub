export interface Users {
  user_id: number,
  user_nome: string,
  user_email: string,
  genero:string
}

export type Agendamento = {
  id: number,
  paciente_id: number,
  data_hora: string,
  tipo:string,
  status: string,
  observacao:string;
  pacientes?: {
    nome_paciente: string;
    sobrenome_paciente:string
  }
}