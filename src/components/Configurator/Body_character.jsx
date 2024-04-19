import React, { useEffect, useRef, useMemo, useState } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils'
import { useSocketClient } from '../Login/SocketClient'
const Body_character = ({
  ...props
}) => {

  const { 
    avatarUrl
  } = useSocketClient();

  const cloneRef = useRef()

  const { scene } = useGLTF(avatarUrl)
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])

  const { animations: waveAnimation } = useGLTF("/models/animations/M_Standing_Expressions_001.glb");
  
  const { animations: idleAnimation} = useGLTF("/models/animations/M_Standing_Idle_001.glb")

  const { actions } = useAnimations([idleAnimation[0], waveAnimation[0]], cloneRef)

  const [animation, setAnimation] = useState("M_Standing_Idle_001");
  const [init, setInit] = useState(avatarUrl);

  useEffect(() => {

    actions[animation]
      .reset()
      .fadeIn(init === avatarUrl ? 0.32 : 0)
      .play();
    setInit(avatarUrl);
    
    return () => actions[animation]?.fadeOut(0.32);

  }, [animation, avatarUrl]);

  const delayWave = (delay) => {
    setTimeout(() => {
      setAnimation("M_Standing_Expressions_001");
      setTimeout(() => {
        setAnimation("M_Standing_Idle_001");
        delayWave(3000);
      }, 6000);
    }, delay);
  };

  useEffect(() => {
    delayWave(0);
  }, []);

  clone.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  })

  return (
    <primitive object={clone} position={props.position} rotation={props.rotation} ref={cloneRef} />
  )
}

export default Body_character

useGLTF.preload("/models/animations/M_Standing_Idle_001.glb");
useGLTF.preload("/models/animations/M_Standing_Expressions_001.glb");
