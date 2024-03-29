import React, { useState, useEffect, useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html } from '@react-three/drei'
import OtherPlayers from "./OtherPlayers";
import styles from './UserWrapper.module.css'

function RotatingText(props) {
  const textRef = useRef()
  useFrame(({ camera }) => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position);
    }
  })

  return (
      <Text 
        ref={textRef} 
        {...props} 
      />
  )
}

const UserWrapper = memo(({ id, position, rotation, name, action, chathead, avatarUrl}) => {
  
  const [showChatBubble, setShowChatBubble] = useState(false);

  useEffect(() => {
    if(chathead != ''){
      setShowChatBubble(true)
      
    } else {
      setShowChatBubble(false) 
    }

  }, [chathead])

  return (
    <group
      position={position}
      rotation={rotation} 
      dispose={null}
    >
        
      <OtherPlayers action={action} avatarUrl={avatarUrl} />
        <Html 
          occlude 
          position-y={1.6} 
          zIndexRange={[1, 0]} 
          distanceFactor={5} 
          style={{
            transition: 'all 0.5s',
            opacity: showChatBubble ? 1 : 0,
            transform: `scale(${showChatBubble ?  1 : 0.5})`,
          }}
        >
            <div className={styles.ChatBubble}>
                
              <p className={styles.chatBubbleText}>
                {chathead}
              </p>

            </div>
        </Html>

        <RotatingText 
          position={[0, 1.1, 0]}
          color="black"
          anchorX="center"
          anchorY="middle"
          fontSize={0.2}
          font="/fonts/kanit/kanit-light.otf"
          outlineWidth={0.025}
          outlineColor="white"
        > 
          {name} 
        </RotatingText>
            
    </group>
  )
})

export default UserWrapper