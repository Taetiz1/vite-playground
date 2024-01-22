import React, { useRef, useState } from 'react'
import { RigidBody } from '@micmania1/react-three-rapier'
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three'
import { useSocketClient } from '../Login/SocketClient';
import { Text } from '@react-three/drei';
import { Suspense } from 'react';
import Cactus from './Cactus';

function EnterScene ({position, setOnLoading}) {
  const {
          socketClient,  
          username,
          avatarUrl,
          email,
        } = useSocketClient();
  
  const { id } = socketClient;
  const textPosition = new THREE.Vector3(position.x, position.y, position.z); 
  const maxDistanceToShowText = 5;
  const [textVisible, setTextVisibility] = useState(true);

  const buttonRef = useRef()
  useFrame(({ camera }) => {
    const distance = camera.position.distanceTo(textPosition);
    if (buttonRef.current) {
      buttonRef.current.lookAt(camera.position);
    }

    if (distance > maxDistanceToShowText) {
      setTextVisibility(false);
    } else {
      setTextVisibility(true);
    }
  })

  return (
    <group 
      ref={buttonRef}
      position={position}
      visible={textVisible} 
    >
      <mesh>
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
          Enter
        </Text>
      </mesh>
    </group>
    
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
  const textPosition = new THREE.Vector3(position.x, position.y, position.z); 
  const maxDistanceToShowText = 5;
  const [textVisible, setTextVisibility] = useState(true);

  const buttonRef = useRef()
  useFrame(({ camera }) => {
    const distance = camera.position.distanceTo(textPosition);
    if (buttonRef.current) {
      buttonRef.current.lookAt(camera.position);
    }

    if (distance > maxDistanceToShowText) {
      setTextVisibility(false);
    } else {
      setTextVisibility(true);
    }
  })

  return (
    <group
      ref={buttonRef} 
      position={position}
      visible={textVisible}
    >
      <mesh>
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
          Enter
        </Text>
      </mesh>
    </group>
    
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