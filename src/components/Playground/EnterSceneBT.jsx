import React, { useRef, useState } from 'react'
import { Vector3, TextureLoader }from 'three'
import { useSocketClient } from '../Login/SocketClient';
import { useVideoChat } from '../voiceContext';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import EnterIcon from '/assets/enter.png'

const EnterSceneBT = ({position, setOnLoading, roomID, atPos, atRot}) => {
    const {
      socketClient,  
      username,
      avatarUrl,
      email
  
    } = useSocketClient();
  
    const {
      connectPeer,
      setChannelName,
      setOnDisconnect
  
    } = useVideoChat();

    const texture = useLoader(TextureLoader, EnterIcon)
  
    function JoinRoom() {
      const setJoin = () => {
        
        setChannelName(roomID)
        socketClient.emit('joinroom', {
          id,
          name: username,
          avatarUrl: avatarUrl,
          email: email,
          roomID: roomID,
          atPos: atPos,
          atRot: atRot
        })
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
    const iconPos = new Vector3(position[0], position[1], position[2]); 
    const maxDistanceToShowText = 5;
    const [enabledClick, setEnabledClick] = useState(false);

    useFrame(({ camera }) => {
      const distance = camera.position.distanceTo(iconPos);
  
      if(distance > maxDistanceToShowText) {
        setEnabledClick(false);
      } else {
        setEnabledClick(true);
      }
    })
  
    return (
      <group 
        position={position}
        scale={[0.7, 0.7, 0.7]}
        onClick={() => {
          if(enabledClick) {JoinRoom()}
        }} 
      >
        <sprite>
          <spriteMaterial attach="material" map={texture} />
        </sprite>
      </group>
      
    );
}

export default EnterSceneBT