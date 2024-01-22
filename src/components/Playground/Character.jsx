import React, { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { useInput, } from "../../hooks/useInput";
import { useAnimations, useGLTF, OrbitControls, } from "@react-three/drei";
import { useThree, useFrame,  } from "@react-three/fiber";
import { Quaternion, Vector3, } from "three";
import { RigidBody, CapsuleCollider, } from "@micmania1/react-three-rapier";
import { useCharacterCustomization, Hairstyles, } from "../Configurator/CharacterCustomization";
import * as THREE from 'three'
import { useSocketClient } from "../Login/SocketClient";

let walkDirection = new Vector3();
let rotateAngle = new Vector3(0, 1, 0);
let rotateQuarternion = new Quaternion();
let cameraTarget = new Vector3()
// const [path, setPath] = useState();

const directionOffset = ({ forward, backward, left, right}) => {
    var directionOffset = 0;

    if(forward) {
        if(left) {
            directionOffset = Math.PI / 4;
        }
        else if(right) {
            directionOffset = -Math.PI / 4;
        }
    } else if (backward) {
        if(left) {
            directionOffset = Math.PI / 4 + Math.PI / 2;
        }
        else if(right){
            directionOffset = -Math.PI / 4 - Math.PI / 2;
        }
        else {
            directionOffset = Math.PI
        }
    } 
    else if(left) {
        directionOffset = Math.PI / 2;
    }
    else if(right) {
        directionOffset = -Math.PI / 2;
    }

    return directionOffset;
}

export const Character = ({socket, inventory, pos}) => {
    const { 
        avatarUrl,
        socketClient,
        onLoading
    } = useSocketClient();

    const { forward, backward, left, right, shift, } = useInput();
    const { scene } = useGLTF(avatarUrl);
    
    const modelRef = useRef();

    const { animations: walkAnimation} = useGLTF("/models/animations/M_Walk_001.glb")
    const { animations: idleAnimation} = useGLTF("/models/animations/M_Standing_Idle_001.glb")

    const { actions } = useAnimations([walkAnimation[0], idleAnimation[0]], scene)

    const bodyRef = useRef(null);
    const { id } = socket

    useEffect(() => {
        if(socketClient){
            socketClient.on('respawn', (pos) => {
                const body = bodyRef.current;
                const movement = new Vector3;

                movement.x =  pos[0]
                movement.y =  pos[1]
                movement.z =  pos[2]
                
                body.setTranslation(movement, true)
                updateCameraTarget(pos[0], pos[1], pos[2]);
            })
        }
    }, [socketClient])

    useEffect(() => {
        if(onLoading){
            bodyRef.current.setEnabledTranslations(false, false, false)
        } else {
        
            bodyRef.current.setEnabledTranslations(true, true, true)
        }
    }, [onLoading])

    // const { 
    //     Pupil,
    //     Iris,
    //     Sclera,
    //     Skin,
    //     Hair,
    //     HairColor,
    // } = useCharacterCustomization();

    // Hairstyles.forEach((hair) => {
    //     if(hair != Hair){
    //       const hairMesh = scene.getObjectByName(hair)
    //       hairMesh.visible = false;
    //     }
    // });

    // useEffect(() => {
    //     const hairMesh = scene.getObjectByName(Hair);
    //     const eyeBrowL = scene.getObjectByName('eyebrow_L')
    //     const eyeBrowR = scene.getObjectByName('eyebrow_R')
    
    //     hairMesh.visible = true;
    
    //     hairMesh.material = new THREE.MeshStandardMaterial({
    //       color: HairColor,
    //       roughness: 0.8,
    //       metalness: 0.0, 
    //     });

    //     eyeBrowL.material = new THREE.MeshStandardMaterial({
    //     color: HairColor,
    //     roughness: 0.8,
    //     metalness: 0.0, 
    //     });

    //     eyeBrowR.material = new THREE.MeshStandardMaterial({
    //     color: HairColor,
    //     roughness: 0.8,
    //     metalness: 0.0, 
    //     });
    
    //     return () => {
    //       hairMesh.visible = false;
    //     }
    //   }, [Hair, HairColor])
  
    scene.scale.set(0.5, 0.5, 0.5);

    // const irisMeshL = scene.getObjectByName("pasted__Monta_L_eyeBall_iris_geo");
    // const irisMeshR = scene.getObjectByName("pasted__Monta_L_eyeBall_iris_geo002");
    // const pupilMeshL = scene.getObjectByName("pasted__Monta_L_eyeBall_pupil_geo");
    // const pupilMeshR = scene.getObjectByName("pasted__Monta_L_eyeBall_pupil_geo002");
    // const sceleraMeshL = scene.getObjectByName("pasted__Monta_L_eyeBall_sclera_geo");
    // const sceleraMeshR = scene.getObjectByName("pasted__Monta_L_eyeBall_sclera_geo001");
    // const skinMesh = scene.getObjectByName("uploads_files_2017656_body_1");

    // const irisMaterial = new THREE.MeshStandardMaterial({
    //     color: Iris,
    //     roughness: 0.5, // ความไม่เรียบ (0=เรียบ, 1=ไม่เรียบ)
    //     metalness: 0.4, // ความโลหะ (0=ไม่โลหะ, 1=โลหะ)
    // });
    
    // const pupilMaterial = new THREE.MeshStandardMaterial({
    //     color: Pupil,
    //     roughness: 0.1,
    //     metalness: 0.2,
    // });
    
    // const scleraMaterial = new THREE.MeshStandardMaterial({
    //     color: Sclera,
    //     roughness: 0,
    //     metalness: 0,
    // });

    // const skinMaterial = new THREE.MeshStandardMaterial({
    //     color: Skin,
    //     roughness: 0.6,
    //     metalness: 0.1,
    // });

    // irisMeshL.material = irisMaterial
    // irisMeshR.material = irisMaterial
    // pupilMeshL.material = pupilMaterial
    // pupilMeshR.material = pupilMaterial
    // sceleraMeshL.material = scleraMaterial
    // sceleraMeshR.material = scleraMaterial
    // skinMesh.material = skinMaterial
    
    // const { nodes: {Octopus}, } = useGLTF('/public/models/Octopus.glb')
    // const banana = useGLTF('/public/models/banana.glb')
    // const bananaModel = banana.nodes.Cube

    // scene.traverse((object) => {
    //     if(object.isMesh) {
    //         object.castShadow = true;
    //         object.receiveShadow = true;
    //     }
    // })

    // useEffect(() => {
    //     if(inventory["Item_1"]){
    //         if(inventory["Item_1"].equipped){
    //             nodes.mixamorigLeftHand.add(bananaModel); 
    //             bananaModel.scale.set(0.03, 0.03, 0.03)
    //             bananaModel.position.y = 0.2;
    //             bananaModel.position.x = -0.1;
    //             bananaModel.position.z = 0.05;
    //         }
                
    //         return () => {
    //             nodes.mixamorigLeftHand.remove(bananaModel);
    //         };
    //     } 

    // },  [inventory])

    // useEffect(() => {
    
    //     if(inventory["Item_2"]){
    //         if(inventory["Item_2"].equipped){
    //             nodes.mixamorigHead.add(Octopus); 
    //             Octopus.scale.set(0.15, 0.15, 0.15)
    //             Octopus.position.y = 0.8;
    //         }
      
    //         return () => {
    //             nodes.mixamorigHead.remove(Octopus);
    //         };
    //     } 

    // },  [inventory])
  
    const currentAction = useRef("");
    const controlsRef = useRef()
    const camera = useThree(state => state.camera);
    const gl = useThree(state => state.gl);

    const minDistance = 2;

    const updateCameraTarget = (moveX, moveY, moveZ) => {
        const body = bodyRef.current;
        camera.position.x += moveX
        camera.position.y += moveY
        camera.position.z += moveZ

        cameraTarget.x = body.translation().x;
        cameraTarget.y = body.translation().y + 0.5;
        cameraTarget.z = body.translation().z;
        if(controlsRef.current){ controlsRef.current.target = cameraTarget; }
    }

    useEffect(() => {
        let action = ""
        // actions?.idle?.play();

        if(forward || backward || left || right) {
            action = "M_Walk_001"

            // if(shift) {
            //     action = "running"
            // }

        } else {
            action = "M_Standing_Idle_001"
        }
    
        if(currentAction.current != action) {
            const nextActionToplay = actions[action];
            const current = actions[currentAction.current];
            current?.fadeOut(0.2);
            nextActionToplay?.reset().fadeIn(0.2).play();
            currentAction.current = action;
        }
  
    }, [forward, backward, left, right, shift])

    useFrame((state, delta) => {
        const body = bodyRef.current;
        const movement = new Vector3;
        const translation = body.translation();
        
        const hips = modelRef.current.getObjectByName("Hips");
        hips.position.set(0, hips.position.y, 0);

            if(currentAction.current === 'running' || 
            currentAction.current === 'M_Walk_001'){
                let angleYCameraDirection = Math.atan2(
                    camera.position.x - body.translation().x,
                    camera.position.z - body.translation().z
                );

                let newDirectionOffset = directionOffset({
                    forward,
                    backward,
                    left,
                    right
                });

                rotateQuarternion.setFromAxisAngle(
                    rotateAngle,
                    angleYCameraDirection + newDirectionOffset
                );
                
                scene.quaternion.rotateTowards(rotateQuarternion, 0.2)

                camera.getWorldDirection(walkDirection);
                walkDirection.normalize();
                walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset);

                const velocity = currentAction.current == "running" ? 3 : 2;

                const moveX = walkDirection.x * velocity * delta;
                const moveY = walkDirection.y * velocity * delta;
                const moveZ = walkDirection.z * velocity * delta;

                movement.x =  moveX
                movement.y =  moveY
                movement.z =  moveZ
                
                body.setTranslation(translation.add(movement), true)
                
                
                updateCameraTarget(moveX, moveY, moveZ);
            } 
        
        const { rotation } = modelRef.current
        
        const posArray = []
        const rotArray = []

        body.translation().toArray(posArray)
        posArray[1] -= 0.4
        
        rotation.toArray(rotArray)

        socket.emit('move', {
            id,
            rotation: rotArray,
            position: posArray,
            action: currentAction.current,
        })

    })
  
    return (
        <RigidBody
            ref={bodyRef}
            type="dynamic"
            colliders={false}
            enabledRotations={[false, false, false]} 
            position={pos}
        >
            <CapsuleCollider args={[0.25, 0.18]} />
            
            <Suspense>   
                <group dispose={null} position={[0, -0.40, 0]} rotation={[0, -9.4, 0]}> 
                    <primitive object={scene} ref={modelRef} />  
                </group>

            </Suspense>  

            <OrbitControls 
                enablePan={false} 
                enableRotate={true} 
                enableDamping={true} 
                enableZoom={false}
                dampingFactor={0.1}
                ref={controlsRef}
                args={[camera, gl.domElement]}
                minDistance={minDistance}
                maxDistance={minDistance}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 4}
            />
        </RigidBody>
    )
}

useGLTF.preload("/public/models/animations/M_Walk_001.glb");
useGLTF.preload("/public/models/animations/M_Standing_Idle_001.glb");
useGLTF.preload("/public/models/animations/M_Dances_001.glb");