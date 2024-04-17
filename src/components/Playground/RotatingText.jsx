import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from '@react-three/drei';

function RotatingText(props) {
    const textRef = useRef()
    useFrame(({ camera }) => {
      if(textRef.current) {
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

export default RotatingText