import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrthographicCamera, Box } from "@react-three/drei";
import { useSocketClient } from "../Login/SocketClient";

const Minimap = (props) => {

    const miniMapCameraRef = useRef();

    const { 
        posMinimap,
    } = useSocketClient();

    const frustumSize = 1000;
    const aspect = window.innerWidth / window.innerHeight;

    const miniMapLocationLeftPixels = window.innerWidth - 8 - window.innerWidth * 0.2;
    const miniMapLocationBottomPixels = 600;

    useFrame(({ gl, scene, camera }) => {
        gl.autoClear = true;
        gl.setViewport(0, 0, window.innerWidth, window.innerHeight);
        gl.setScissor(0, 0, window.innerWidth, window.innerHeight);
        // gl.setScissorTest(true);
        gl.render(scene, camera);
        gl.autoClear = false;
        // gl.clearDepth();

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
        gl.setScissorTest(true);
        miniMapCameraRef.current.position.x = posMinimap[0];
        miniMapCameraRef.current.position.y = 20;
        miniMapCameraRef.current.position.z = posMinimap[2];
        miniMapCameraRef.current.lookAt(posMinimap[0], 0, posMinimap[2])
        miniMapCameraRef.current.aspect = aspect;
        // miniMapCameraRef.current.updateMatrixWorld();
        // miniMapCameraRef.current.updateProjectionMatrix();
        gl.render(scene, miniMapCameraRef.current);

    }, 1);

    return (
        <group>
            <OrthographicCamera
                ref={miniMapCameraRef}
                makeDefault={false}
                zoom={25}
                position={[0, 50, 0]}
                left={(frustumSize * aspect) / 2}
                right={(frustumSize * aspect) / -2}
                top={frustumSize / -2}
                bottom={frustumSize / 2}
                far={500}
                near={0.1}
            > 
                
            
            </OrthographicCamera>
        </group>
    )
}

export default Minimap