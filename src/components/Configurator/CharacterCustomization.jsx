import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocketClient } from "../Login/SocketClient";

const CharacterCustomizationContext = createContext({});

export const CameraModes = {
    'Full': 'Full',
    'Top': 'Top',
    'Bottom': 'Bottom',
}

export const SwatchesColors = ['#25262b', '#868e96', '#FFFFFF', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#798ABC', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#E7C495', '#fd7e14']
export const Hairstyles = ['hair_01', 'hair_02', 'hair_03', 'hair_04', ]
export const shirts = ['shirt_01', ]

export const CharacterCustomizationProvider = ({children}) => {
    const [ isMode, SetIsMode] = useState(CameraModes.Full)
    const [ cameraMode, setCameraMode ] = useState(CameraModes.Full)
    const [ Skin, setSkin ] = useState('');
    const [ Pupil, setPupil ] = useState('');
    const [ Iris, setIris ] = useState('');
    const [ Sclera, setScelera ] = useState('');
    const [ Hair, setHair ] = useState('hair_01')
    const [ HairColor, setHairColor ] = useState('')

    // const { socketClient } = useSocketClient()

    // useEffect(() => {
    //     if (socketClient) {
    //       socketClient.on('configSetting', (config) => {
    //         setSkin(config.Skin)
    //         setPupil(config.Pupil)
    //         setIris(config.Iris)
    //         setScelera(config.Sclera)
    //         setHair(config.Hair)
    //         setHairColor(config.HairColor)
    //       })
    
    //     }
        
    //   }, [socketClient])

    return (
        <CharacterCustomizationContext.Provider 
            value={{
                isMode,
                SetIsMode,
                cameraMode,
                setCameraMode,
                Skin,
                setSkin,
                Pupil,
                setPupil,
                Iris,
                setIris,
                Sclera,
                setScelera,
                Hair,
                setHair,
                HairColor,
                setHairColor,
            }}
        >
            {children}
        </CharacterCustomizationContext.Provider>
    )
}   

export const useCharacterCustomization = () => {
    return useContext(CharacterCustomizationContext);
}