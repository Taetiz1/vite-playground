import React, { useState, useRef } from "react";
import { useSocketClient } from "../Login/SocketClient";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

const InformationButton = ({information}) => {
    const {
        showInformation,
        setShowInformation,
        setInformation
    } = useSocketClient();

    const handleClick = () => {
        setShowInformation(true)
        setInformation(information)
    };

    const position = information.pos
    const iconPos = new Vector3(position[0], position[1], position[2]); 
    const maxDistanceToShowText = 5;
    const [enabledClick, setEnabledClick] = useState(false);
    const buttonRef = useRef()
    
    useFrame(({ camera }) => {
        const distance = camera.position.distanceTo(iconPos);

        if(distance > maxDistanceToShowText) {
            setEnabledClick(false);
        } else {
            setEnabledClick(true);
        }

        if(buttonRef.current) {
            buttonRef.current.lookAt(camera.position);
        }
    })

    return (
        <group position={position} ref={buttonRef} scale={[0.4, 0.4, 0.4]} visible={showInformation ? false : true}>
            <mesh 
                onClick={() => {
                    if(enabledClick) {
                        handleClick()
                    }
                }}>
                <sphereGeometry args={[0.2, 30]} />
                <meshPhysicalMaterial color="white" transparent opacity={1} />
                {enabledClick && <Text
                    position={[0, 0.2, 1]}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                    fontSize={0.2}
                    outlineWidth={0.02}
                    outlineColor="white"
                >
                    information
                </Text>}
            </mesh>
        </group>
    );

}

export default InformationButton