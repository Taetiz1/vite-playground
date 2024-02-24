import React, { Suspense } from "react";
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@micmania1/react-three-rapier';

const Scene = ({settings}) => {
    const { scene } = useGLTF(settings.url)

    scene.scale.set(settings.scale[0], settings.scale[1], settings.scale[2]);

    return(
        <group>
            <RigidBody type="fixed" colliders="trimesh" >
                <Suspense>
                    <primitive object={scene} position={settings.pos} />
                </Suspense>
            </RigidBody>
        </group>
    )
}

export default Scene