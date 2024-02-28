import React, { Suspense } from "react";
import { useGLTF } from '@react-three/drei';
import { RigidBody, MeshCollider } from '@micmania1/react-three-rapier';

const Scene = ({settings}) => {
    const { scene } = useGLTF(settings.url)

    scene.scale.set(settings.scale[0], settings.scale[1], settings.scale[2]);

    return(
        <group position={settings.pos} rotation={settings.rot}>
            <RigidBody type="fixed">
                <MeshCollider type="trimesh">
                    <Suspense>
                        <primitive object={scene} />
                    </Suspense>
                </MeshCollider>
            </RigidBody>
        </group>
    )
}

export default Scene