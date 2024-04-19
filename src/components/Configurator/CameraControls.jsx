import React, { useRef } from "react"
import { OrbitControls } from "@react-three/drei"
import { CameraModes, useCharacterCustomization } from "./CharacterCustomization"
import { useFrame } from "@react-three/fiber";
import * as THREE from "three"

const cameraPositions = {
    "Free": {
        minDistance: 2,
        maxDistance: 3,
    },
    [CameraModes.Top]: {
        position: new THREE.Vector3(0, 0.5, 1.5),
        target: new THREE.Vector3(0, 0.5, 0),
        minDistance: 1.2,
        maxDistance: 1.4,
    },
    [CameraModes.Bottom]: {
        position: new THREE.Vector3(0, -0.3, 2),
        target: new THREE.Vector3(0, -0.3, 0),
        minDistance: 1.5,
        maxDistance: 2,
    },
    [CameraModes.Full]: {
        position: new THREE.Vector3(1, 0.5, 3),
        target: new THREE.Vector3(0, 0, 0),
        minDistance: 2,
        maxDistance: 3,
    },
}

export const CameraControls = () => {
    const { cameraMode, setCameraMode } = useCharacterCustomization();
    const OrbitControlsRef = useRef();

    useFrame((state, delta) => {
        if(cameraMode === "Free") {
            OrbitControlsRef.current.minDistance = cameraPositions[cameraMode].minDistance;
            OrbitControlsRef.current.maxDistance = cameraPositions[cameraMode].maxDistance;
            return; 
        }
        state.camera.position.lerp(cameraPositions[cameraMode].position, 3*delta);
        OrbitControlsRef.current.target.lerp(cameraPositions[cameraMode].target, 3*delta);
        OrbitControlsRef.current.minDistance = cameraPositions[cameraMode].minDistance;
        OrbitControlsRef.current.maxDistance = cameraPositions[cameraMode].maxDistance;
        cameraPositions["Free"].minDistance = OrbitControlsRef.current.minDistance
        cameraPositions["Free"].maxDistance = OrbitControlsRef.current.maxDistance
    })

    return ( 
        <>
            <OrbitControls 
                ref={OrbitControlsRef}
                enablePan={false} 
                onStart={() => {
                    setCameraMode('Free')
                }} 
            />
        </>
    )
}