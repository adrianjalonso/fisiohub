import { createContext, useContext, type ReactNode } from "react";


interface UserContextType {
  titulo: string,
  sobrenome: string,
  IdUser: number,
  nome: string
}

const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode,
  titulo: string,
  sobrenome: string,
  IdUser: number,
  nome: string
}

export function UserProvider({ children,titulo,nome,sobrenome,IdUser }: UserProviderProps) {
  return(
    <UserContext.Provider value={{titulo,nome,sobrenome,IdUser}}>
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