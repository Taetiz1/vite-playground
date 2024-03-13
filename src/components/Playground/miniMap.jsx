import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useSocketClient } from "../Login/SocketClient";
import * as THREE from "three"

const Minimap = (props) => {

    const miniMapCameraRef = useRef();

    const { 
        posMinimap,
    } = useSocketClient();

    const frustumSize = 1000;
    const aspect = 16 / 9;

    const miniMapLocationLeftPixels = window.innerWidth - 8 - window.innerWidth * 0.2;
    const miniMapLocationBottomPixels = 600;

    useFrame(({ gl, scene, camera }) => {
        const miniMap = miniMapCameraRef.current

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
        window.innerHeight * 0.2
        );
        gl.setScissor(
        miniMapLocationLeftPixels,
        miniMapLocationBottomPixels,
        window.innerWidth * 0.2,
        window.innerHeight * 0.2
        );

        miniMap.position.x = posMinimap[0];
        miniMap.position.z = posMinimap[2];

        miniMap.lookAt(posMinimap[0], 0, posMinimap[2])

        miniMap.aspect = aspect;
        miniMap.updateMatrixWorld();
        miniMap.updateProjectionMatrix();
        gl.render(scene, miniMap);

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
        </group>
    )
}

export default Minimap