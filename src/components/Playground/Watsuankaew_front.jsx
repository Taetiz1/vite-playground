import React, { Suspense, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@micmania1/react-three-rapier'

const Front = (props) => {
  
  const { scene } = useGLTF('https://www.googleapis.com/drive/v3/files/1E3-1hBQDd3iNrPgmeTHfeeF_vYcZCI3J?alt=media&key=AIzaSyD7xq_I3NdTPkBKZ4AKMuivcmcpQv5x0xg')

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
        <primitive object={scene} position={[0, -5, 0]} />
      </Suspense>
    </RigidBody>
  )
}

export default Front