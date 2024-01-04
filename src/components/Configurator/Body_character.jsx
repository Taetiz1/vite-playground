import React, { useEffect, useRef, useMemo, useState } from 'react'
import { useAnimations } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useLoader } from '@react-three/fiber'
import { useCharacterAnimations } from './CharacterAnimations'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils'
import { useCharacterCustomization, Hairstyles } from './CharacterCustomization'
import * as THREE from 'three'
import { useSocketClient } from '../Login/SocketClient'
const Body_character = ({
  ...props
}) => {
  // const { setAnimations, animationIndex } = useCharacterAnimations();
  // const { 
  //   Pupil,
  //   Iris,
  //   Sclera,
  //   Skin,
  //   Hair,
  //   HairColor,
  // } = useCharacterCustomization();

  const { 
    avatarUrl,
  } = useSocketClient();

  const cloneRef = useRef()

  const { scene } = useLoader(GLTFLoader, avatarUrl)
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])

  const { animations: waveAnimation } = useLoader(GLTFLoader, "/public/models/animations/M_Standing_Expressions_001.glb");
  
  const { animations: idleAnimation} = useLoader(GLTFLoader, "/public/models/animations/M_Standing_Idle_001.glb")

  const { actions } = useAnimations([waveAnimation[0], idleAnimation[0]], cloneRef)

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
    delayWave(12);
  }, []);


  // Hairstyles.forEach((hair) => {
  //   if(hair != Hair){
  //     const hairMesh = clone.getObjectByName(hair)
  //     hairMesh.visible = false;
  //   }
  // });

  clone.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  })
  
  // useEffect(() => {
  //   const hairMesh = clone.getObjectByName(Hair);
  //   const eyeBrowL = clone.getObjectByName('eyebrow_L')
  //   const eyeBrowR = clone.getObjectByName('eyebrow_R')

  //   hairMesh.visible = true;

  //   hairMesh.material = new THREE.MeshStandardMaterial({
  //     color: HairColor,
  //     roughness: 0.8,
  //     metalness: 0.2, 
  //   });

  //   eyeBrowL.material = new THREE.MeshStandardMaterial({
  //     color: HairColor,
  //     roughness: 0.8,
  //     metalness: 0.2, 
  //   });

  //   eyeBrowR.material = new THREE.MeshStandardMaterial({
  //     color: HairColor,
  //     roughness: 0.8,
  //     metalness: 0.2, 
  //   });

  //   return () => {
  //     hairMesh.visible = false;
  //   }
  // }, [Hair, HairColor])

  // const irisMeshL = clone.getObjectByName("pasted__Monta_L_eyeBall_iris_geo");
  // const irisMeshR = clone.getObjectByName("pasted__Monta_L_eyeBall_iris_geo002");
  // const pupilMeshL = clone.getObjectByName("pasted__Monta_L_eyeBall_pupil_geo");
  // const pupilMeshR = clone.getObjectByName("pasted__Monta_L_eyeBall_pupil_geo002");
  // const sceleraMeshL = clone.getObjectByName("pasted__Monta_L_eyeBall_sclera_geo");
  // const sceleraMeshR = clone.getObjectByName("pasted__Monta_L_eyeBall_sclera_geo001");
  // const skinMesh = clone.getObjectByName("uploads_files_2017656_body_1");

  // const irisMaterial = new THREE.MeshStandardMaterial({
  //   color: Iris,
  //   roughness: 0.5, // ความไม่เรียบ (0=เรียบ, 1=ไม่เรียบ)
  //   metalness: 0.4, // ความโลหะ (0=ไม่โลหะ, 1=โลหะ)
  // });

  // const pupilMaterial = new THREE.MeshStandardMaterial({
  //   color: Pupil,
  //   roughness: 0.1,
  //   metalness: 0.2,
  // });

  // const scleraMaterial = new THREE.MeshStandardMaterial({
  //   color: Sclera,
  //   roughness: 0,
  //   metalness: 0,
  // });
  
  // const skinMaterial = new THREE.MeshStandardMaterial({
  //   color: Skin,
  //   roughness: 0.6,
  //   metalness: 0.1,
  // });

  // irisMeshL.material = irisMaterial
  // irisMeshR.material = irisMaterial
  // pupilMeshL.material = pupilMaterial
  // pupilMeshR.material = pupilMaterial
  // sceleraMeshL.material = scleraMaterial
  // sceleraMeshR.material = scleraMaterial
  // skinMesh.material = skinMaterial

  // useEffect(() => {
  //   setAnimations(names);
  // }, [names])

  // useEffect(() => {
  //   actions[names[animationIndex]].reset().fadeIn(0.2).play();

  //   return () => {
  //     actions[names[animationIndex]].fadeOut(0.2).play()
  //   }
  // }, [animationIndex])

  return (
    <group>
      <primitive object={clone} position={props.position} rotation={props.rotation} ref={cloneRef} />
    </group>
  )
}

export default Body_character

// useGLTF.preload("/public/models/animations/M_Standing_Idle_001.glb");
// useGLTF.preload("/public/models/animations/M_Standing_Expressions_001.glb");
