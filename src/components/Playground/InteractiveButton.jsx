import React, { useState, useEffect, useRef } from "react";
import { useSocketClient } from "../Login/SocketClient";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

function InteractiveButton({emote, pos, rot}) {
    const {
        setDoEmote,
        setEmote,
        onInteractive,
        setOnInteractive,
        setInterractivePosition
    } = useSocketClient();

    const handleClick = () => {
      setDoEmote(true)
      setEmote(emote)
      setOnInteractive(true)
      setInterractivePosition({
        pos: pos,
        rot: rot
      })
    };

    const iconPos = new Vector3(pos[0], pos[1], pos[2]); 
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
        <group position={pos} ref={buttonRef} scale={[0.4, 0.4, 0.4]} visible={onInteractive ? false : true}>
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
                    click to {emote}
                </Text>}
            </mesh>
        </group>
    );
}

export default InteractiveButton