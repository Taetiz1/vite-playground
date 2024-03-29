import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations } from "@react-three/drei";
import { clone as SkeletonUtils_clone } from 'three/examples/jsm/utils/SkeletonUtils'
import { useGLTF } from "@react-three/drei";

const OtherPlayers = ({action, avatarUrl}) => {
    const cloneRef = useRef()
  
    const { scene } = useGLTF(avatarUrl)
    const clone = useMemo(() => SkeletonUtils_clone(scene), [scene])
  
    const { animations: walkAnimation} = useGLTF("/models/animations/M_Walk_001.glb")
    const { animations: idleAnimation} = useGLTF("/models/animations/M_Standing_Idle_001.glb")
    const { animations: runAnimation } = useGLTF("/models/animations/F_Jog_001.glb")
  
    const { actions } = useAnimations([walkAnimation[0], idleAnimation[0], runAnimation[0]], cloneRef)
    
    const currentAction = useRef("");
    
    useEffect(() => {
      
      if(currentAction.current !== action) {
        const nextActionToplay = actions[action];
        const current = actions[currentAction.current];
        current?.fadeOut(0.32);
        nextActionToplay?.reset().fadeIn(0.32).play();
        currentAction.current = action;
      }
      
    }, [action])
  
    useFrame(() => {
      const hips = cloneRef.current.getObjectByName("Hips");
      hips.position.set(0, hips.position.y, 0);
    })
  
    return (
        <group ref={cloneRef} >
            <primitive object={clone} scale={[0.56, 0.56, 0.56]} rotation={[0, 9.4, 0]}/>
        </group>
    )
}

export default OtherPlayers

useGLTF.preload("/models/animations/M_Walk_001.glb");
useGLTF.preload("/models/animations/M_Standing_Idle_001.glb");
useGLTF.preload("/models/animations/M_Dances_001.glb");
useGLTF.preload("/models/animations/F_Jog_001.glb");
