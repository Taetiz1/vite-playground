

import React, { Suspense } from 'react'
import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@micmania1/react-three-rapier'

const Cactus = (props) => {
  const { scene } = useGLTF('/public/models/scene/Wat_suankaew_front.gltf')

  scene.traverse((object) => {
    if(object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  })
  scene.scale.set(0.8, 0.8, 0.8);

  return (
    <RigidBody type="fixed" colliders="trimesh" >
      <Suspense>
        <primitive object={scene} position={[0, -3, 0]} />
      </Suspense>
    </RigidBody>
  )
}

export default Cactus
useGLTF.preload('/public/models/Wat_suankaew_front.gltf')
