import React from "react";
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@micmania1/react-three-rapier';

const Scene = ({settings}) => {
    const { scene } = useGLTF(settings.url)

    scene.scale.set(settings.scale[0], settings.scale[1], settings.scale[2]);

    return(
        <group position={settings.pos} rotation={settings.rot}>
            <RigidBody type="fixed" colliders="trimesh">
                <primitive object={scene} />
            </RigidBody>
        </group>
    )
}

export default Scene