import React, { useRef, useState } from 'react'
import { Vector3, TextureLoader }from 'three'
import { useSocketClient } from '../Login/SocketClient';
import { useVideoChat } from '../voiceContext';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import EnterIcon from '/assets/enter.png'

const EnterSceneBT = ({position, setOnLoading, roomID}) => {
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
    // const textPosition = new Vector3(position.x, position.y, position.z); 
    // const maxDistanceToShowText = 5;
    // const [textVisible, setTextVisibility] = useState(true);
  
    const buttonRef = useRef()
    // useFrame(({ camera }) => {
    //   const distance = camera.position.distanceTo(textPosition);
    //   if(buttonRef.current) {
    //     buttonRef.current.lookAt(camera.position);
    //   }
  
    //   if(distance > maxDistanceToShowText) {
    //     setTextVisibility(false);
    //   } else {
    //     setTextVisibility(true);
    //   }
    // })
  
    return (
      <group 
        // ref={buttonRef}
        position={position}
        // visible={textVisible} 
        scale={[0.6, 0.6, 0.6]}
      >
        <sprite 
          onClick={JoinRoom} 
        >
          <spriteMaterial attach="material" map={texture} />
        </sprite>
      </group>
      
    );
}

export default EnterSceneBT