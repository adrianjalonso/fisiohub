import { createContext, useContext, type ReactNode } from "react";


interface UserContextType {
  titulo: string,
  sobrenome: string,
  IdUser: number
}

const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode,
  titulo: string,
  sobrenome: string,
  IdUser: number
}

export function UserProvider({ children,titulo,sobrenome,IdUser }: UserProviderProps) {
  return(
    <UserContext.Provider value={{titulo,sobrenome,IdUser}}>
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