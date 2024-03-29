import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useSocketClient } from "../Login/SocketClient";
import { TextureLoader } from "three";
import player from '/assets/mask.svg'
import gate from '/assets/enter.png'

const Minimap = (props) => {

    const miniMapCameraRef = useRef();
    const miniMapSymbolCameraRef = useRef();
    const texturePlayer = useLoader(TextureLoader, player)
    const textureGate = useLoader(TextureLoader, gate)

    const { 
        posMinimap,
        currentRoom
    } = useSocketClient();

    const enterBT = currentRoom.enterBT

    const frustumSize = 1000;
    const aspect = window.innerWidth / window.innerHeight;

    const miniMapLocationLeftPixels = 20;
    const miniMapLocationBottomPixels = 20;

    useFrame(({ gl, scene, camera }) => {
        const miniMap = miniMapCameraRef.current
        const miniMapSymbol = miniMapSymbolCameraRef.current

        gl.setViewport(0, 0, window.innerWidth, window.innerHeight);
        gl.setScissor(0, 0, window.innerWidth, window.innerHeight);
        gl.render(scene, camera);
        gl.autoClear = false;
        gl.clearDepth();

        // render minicamera
        gl.setViewport(
        miniMapLocationLeftPixels,
        miniMapLocationBottomPixels,
        window.innerWidth * 0.2,
        window.innerHeight * 0.25
        );
        gl.setScissor(
        miniMapLocationLeftPixels,
        miniMapLocationBottomPixels,
        window.innerWidth * 0.2,
        window.innerHeight * 0.25
        );

        miniMap.position.x = posMinimap[0];
        miniMap.position.z = posMinimap[2];

        miniMap.lookAt(posMinimap[0], 0, posMinimap[2])

        miniMap.aspect = aspect;
        miniMap.updateMatrixWorld();
        miniMap.updateProjectionMatrix();
        gl.render(scene, miniMap);

        miniMapSymbol.position.x = posMinimap[0];
        miniMapSymbol.position.z = posMinimap[2];

        miniMapSymbol.lookAt(posMinimap[0], 0, posMinimap[2])

        miniMapSymbol.aspect = aspect;
        miniMapSymbol.updateMatrixWorld();
        miniMapSymbol.updateProjectionMatrix();
        gl.render(scene, miniMapSymbol);

    }, 1);

    return (
        <group>
            <OrthographicCamera
                ref={miniMapCameraRef}
                makeDefault={false}
                zoom={25}
                left={(frustumSize * aspect) / -2}
                right={(frustumSize * aspect) / 2}
                top={frustumSize / 2}
                bottom={frustumSize / -2}
                far={500}
                near={0.1}
                position={[0, 10, 0]}
            /> 
            <OrthographicCamera
                ref={miniMapSymbolCameraRef}
                makeDefault={false}
                zoom={25}
                left={(frustumSize * aspect) / -2}
                right={(frustumSize * aspect) / 2}
                top={frustumSize / 2}
                bottom={frustumSize / -2}
                far={500}
                near={0.1}
                position={[0, 10, 0]}
                layers={[1]}
            /> 
             <sprite 
                position={[posMinimap[0], 9.9, posMinimap[2]]} 
                scale={[3, 3]}
                layers={[1]}
            >
                <spriteMaterial 
                    attach="material" 
                    map={texturePlayer} 
                    depthTest={false} 
                    depthWrite={false} 
                />
            </sprite>
            {enterBT && enterBT.map((bt, index) => (
                <sprite 
                    key={index} 
                    position={[bt.pos[0], 9.9, bt.pos[2]]} 
                    scale={[5, 5]} 
                    transparent 
                    alphaTest={0.5}
                    layers={[1]}
                >
                    <spriteMaterial 
                        attach="material" 
                        map={textureGate} 
                        depthTest={false} 
                        depthWrite={false} 
                    />
                </sprite>
            ))}
        </group>
    )
}

export default Minimap