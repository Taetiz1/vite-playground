import React, { createContext, useContext, useState } from "react";

const CharacterCustomizationContext = createContext({});

export const CameraModes = {
    'Full': 'Full',
    'Top': 'Top',
    'Bottom': 'Bottom',
}

export const CharacterCustomizationProvider = ({children}) => {
    const [ isMode, SetIsMode] = useState(CameraModes.Full)
    const [ cameraMode, setCameraMode ] = useState(CameraModes.Full)

    return (
        <CharacterCustomizationContext.Provider 
            value={{
                isMode,
                SetIsMode,
                cameraMode,
                setCameraMode,
            }}
        >
            {children}
        </CharacterCustomizationContext.Provider>
    )
}   

export const useCharacterCustomization = () => {
    return useContext(CharacterCustomizationContext);
}