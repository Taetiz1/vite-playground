import React, { useRef} from 'react'
import { RigidBody } from '@micmania1/react-three-rapier'
import { useFrame } from '@react-three/fiber';
import { useSocketClient } from '../Login/SocketClient';
import { Text } from '@react-three/drei';
import Cactus from './Cactus';

function EnterScene ({position, setOnLoading}) {
  const {
          socketClient,  
          username,
          avatarUrl,
          email,
        } = useSocketClient();
  
  const { id } = socketClient;

  const buttonRef = useRef()
  useFrame(({ camera }) => {
    if (buttonRef.current) {
      buttonRef.current.lookAt(camera.position);
    }
  })

  return (
    <mesh ref={buttonRef} position={position} >
      <sphereGeometry args={[0.8, 15, 15]} />
      <meshPhysicalMaterial color="black" transparent opacity={0.2} />
      <Text 
        position={[0, 0, 1]} 
        fontSize={0.3} 
        color="white"  
        anchorX="center" 
        anchorY="middle"
        onClick={() => {
          socketClient.emit('joinroom', {
            id,
            name: username,
            avatarUrl: avatarUrl,
            email: email,
            roomID: 1,
          })
          setOnLoading()
        }}
      >
        Enter Zone1
      </Text>
    </mesh>
    
  );
}

function EnterScene0 ({position, setOnLoading}) {
  const {
          socketClient,  
          username,
          avatarUrl,
          email,

        } = useSocketClient();
  
  const { id } = socketClient;

  const buttonRef = useRef()
  useFrame(({ camera }) => {
    if (buttonRef.current) {
      buttonRef.current.lookAt(camera.position);
    }
  })

  return (
    <mesh ref={buttonRef} position={position} >
      <sphereGeometry args={[0.8, 15, 15]} />
      <meshPhysicalMaterial color="black" transparent opacity={0.2} />
      <Text 
        position={[0, 0, 1]} 
        fontSize={0.3} 
        color="white"  
        anchorX="center" 
        anchorY="middle"
        onClick={() => {
          socketClient.emit('joinroom', {
            id,
            name: username,
            avatarUrl: avatarUrl,
            email: email,
            roomID: 0,
          })
          setOnLoading()
        }}
      >
        Enter Zone0
      </Text>
    </mesh>
    
  );
}

export const Ground = ({x, z, currentRoom, setOnLoading}) => {

  switch (currentRoom) {
    case 0: 
      return (
        <>
          <RigidBody colliders="cuboid" type="fixed">
              <group position={[0, 0, 0]}>
                <mesh rotation-x={Math.PI * -0.5} receiveShadow  >
                  <planeGeometry args={[x, z]}/>
                  <meshStandardMaterial color={"#458745"}/>
                </mesh>
              </group>
          </RigidBody>

          <EnterScene  position={[0, 1.5, 0]} setOnLoading={setOnLoading} />
        </>
      )
      case 1: 
        return (
          <>
            <Cactus />
            <EnterScene0  position={[3, 3, 3]} setOnLoading={setOnLoading} />
          </>
        )
  }
}