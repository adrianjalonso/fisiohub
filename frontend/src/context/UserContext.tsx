import { createContext, useContext, type ReactNode } from "react";

export type DadosUsuario = {
  nome: string;
  email: string;
  titulo: string;
};

interface UserContextType {
  titulo: string;
  IdUser: number;
  nome: string;
  email: string;
  atualizarUsuario: (dados: DadosUsuario) => void;
}

const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
  titulo: string;
  IdUser: number;
  nome: string;
  email: string;
  atualizarUsuario: (dados: DadosUsuario) => void;
}

export function UserProvider({
  children,
  titulo,
  nome,
  IdUser,
  email,
  atualizarUsuario,
}: UserProviderProps) {
  return(
    <UserContext.Provider value={{ titulo, nome, IdUser, email, atualizarUsuario }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext);
   if (!context) {
    throw new Error(
      "useUser deve ser usado dentro de UserProvider"
    );
  }

  return context;
}
