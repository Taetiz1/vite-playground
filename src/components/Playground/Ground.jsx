import React, { useRef, useState } from 'react'
import { RigidBody } from '@micmania1/react-three-rapier'
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three'
import { useSocketClient } from '../Login/SocketClient';
import { useVideoChat } from '../voiceContext';
import { Text, Sky } from '@react-three/drei';
import { Suspense } from 'react';
import Cactus from './Cactus';
import Front from './Watsuankaew_front';

function EnterSceneBT ({position, setOnLoading, roomID}) {
  const {
    socketClient,  
    username,
    avatarUrl,
    email

  } = useSocketClient();

  const {
    connectPeer,
    setChannelName,
    setOnDisconnect,

  } = useVideoChat();

  function JoinRoom(roomID) {
    const setJoin = () => {

      socketClient.emit('joinroom', {
        id,
        name: username,
        avatarUrl: avatarUrl,
        email: email,
        roomID: roomID,
      })
      setChannelName(roomID)
      setOnLoading()
    }

    if(connectPeer) {
      setOnDisconnect(true)

      setJoin()
    } else {
      setJoin()
    }
  }
        
  
  const { id } = socketClient;
  const textPosition = new THREE.Vector3(position.x, position.y, position.z); 
  const maxDistanceToShowText = 5;
  const [textVisible, setTextVisibility] = useState(true);

  const buttonRef = useRef()
  useFrame(({ camera }) => {
    const distance = camera.position.distanceTo(textPosition);
    if(buttonRef.current) {
      buttonRef.current.lookAt(camera.position);
    }

    if(distance > maxDistanceToShowText) {
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
      <sprite onClick={() => {
        JoinRoom(roomID)
      }} >
      </sprite>
    </group>
    
  );
}
export const Ground = ({x, z, currentRoom, setOnLoading}) => {

  switch (currentRoom) {
    case "0": 
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
          {/* <Front /> */}

          <EnterSceneBT  position={[0, 1.5, 0]} setOnLoading={setOnLoading} roomID={"1"} />
        </>
      )
      case "1": 
        return (
          <>
            {/* <Cactus />
            
            <group position={[0, 0, 0]}>
              <mesh rotation-x={Math.PI * -0.5} receiveShadow  >
                <planeGeometry args={[x, z]}/>
                <meshStandardMaterial color={"#458745"}/>
              </mesh>
            </group> */}

            <RigidBody colliders="cuboid" type="fixed">
                <group position={[0, 0, 0]}>
                  <mesh rotation-x={Math.PI * -0.5} receiveShadow  >
                    <planeGeometry args={[x, z]}/>
                    <meshStandardMaterial color={"#458745"}/>
                  </mesh>
                </group>
            </RigidBody>
            <EnterSceneBT  position={[3, 3, 3]} setOnLoading={setOnLoading} roomID={"0"} />
          </>
        )
  }
}