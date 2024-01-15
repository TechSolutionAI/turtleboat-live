import { ReactNode, createContext, useState } from 'react'

export const Context = createContext<any>(null);

const AppProvider = ({ children }: { children: ReactNode }) => {
    const [selectedVentureId, setSelectedVentureId] = useState('')

    const contextValue = {
        selectedVentureId,
        updateVentureId: (ventureId: string) => {
            setSelectedVentureId(ventureId);
        },
    }

    return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export default AppProvider;
