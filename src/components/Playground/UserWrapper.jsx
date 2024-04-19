import React, { useState, useEffect, memo } from "react";
import { Html } from '@react-three/drei';
import OtherPlayers from "./OtherPlayers";
import styles from './UserWrapper.module.css';
import RotatingText from "./RotatingText";

const UserWrapper = ({ id, position, rotation, name, action, chathead, avatarUrl}) => {
  
  const [showChatBubble, setShowChatBubble] = useState(false);

  useEffect(() => {
    if(chathead !== ''){
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
}

export default memo(UserWrapper)