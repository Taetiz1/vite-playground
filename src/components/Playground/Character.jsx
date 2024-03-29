import React, { useRef, useEffect, useState } from "react";
import { useInput, } from "../../hooks/useInput";
import { useAnimations, useGLTF, OrbitControls, } from "@react-three/drei";
import { useThree, useFrame,  } from "@react-three/fiber";
import { Quaternion, Vector3, } from "three";
import { RigidBody, CapsuleCollider } from "@micmania1/react-three-rapier";
import { useSocketClient } from "../Login/SocketClient";

let walkDirection = new Vector3();
let rotateAngle = new Vector3(0, 1, 0);
let rotateQuarternion = new Quaternion();
let cameraTarget = new Vector3()

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

const Character = ({ socket, onRespawn, setOnRespawn }) => {
    const { 
        avatarUrl,
        onLoading,
        setPosMinimap,
        currentRoom,
    } = useSocketClient();

    const [oldPos, setOldPos] = useState([])
    const [oldRot, setOldRot] = useState([])
    const [spawnPoint, setSpawnPoint] = useState()

    const { forward, backward, left, right, shift, } = useInput();
    const { scene } = useGLTF(avatarUrl);
    
    const modelRef = useRef();
    const controlsRef = useRef();

    const { animations: walkAnimation } = useGLTF("/models/animations/M_Walk_001.glb")
    const { animations: idleAnimation } = useGLTF("/models/animations/M_Standing_Idle_001.glb")
    const { animations: runAnimation } = useGLTF("/models/animations/F_Jog_001.glb")

    const { actions } = useAnimations([walkAnimation[0], idleAnimation[0], runAnimation[0]], scene)

    const bodyRef = useRef(null);
    const { id } = socket

    const arraysEqual = (array1, array2) => {

        if(array1.length !== array2.length) return false;
        
        for(let i = 0; i < array1.length; i++) {
          if(array1[i] !== array2[i]) return false;
        }
        
        return true;
    };

    useEffect(() => {
        if(onRespawn) {
            const body = bodyRef.current;
 
            body.setTranslation(spawnPoint, true)

            camera.position.x === body.translation().x;
            camera.position.y === body.translation().y + 1;
            camera.position.z === body.translation().z

            cameraTarget.x = body.translation().x;
            cameraTarget.y = body.translation().y + 0.6;
            cameraTarget.z = body.translation().z;
            if(controlsRef.current){ controlsRef.current.target = cameraTarget; }
            
            setOnRespawn()
        }
        
    }, [onRespawn])

    useEffect(() => {
        if(onLoading){
            bodyRef.current.setEnabledTranslations(false, false, false)
        } else {
        
            bodyRef.current.setEnabledTranslations(true, true, true)
        }
    }, [onLoading])
  
    scene.scale.set(0.56, 0.56, 0.56);
  
    const currentAction = useRef("");
    const camera = useThree(state => state.camera);
    const gl = useThree(state => state.gl);

    const minDistance = 2;

    const updateCameraTarget = (moveX, moveY, moveZ) => {
        const body = bodyRef.current;
        camera.position.x += moveX
        camera.position.y += moveY
        camera.position.z += moveZ

        cameraTarget.x = body.translation().x;
        cameraTarget.y = body.translation().y + 0.6;
        cameraTarget.z = body.translation().z;
        if(controlsRef.current){ controlsRef.current.target = cameraTarget; }
    }

    useEffect(() => {
        const body = bodyRef.current;
        const movement = new Vector3;

        movement.x =  currentRoom.spawnPos[0]
        movement.y =  currentRoom.spawnPos[1]
        movement.z =  currentRoom.spawnPos[2]    
        body.setTranslation(movement, true)
        setSpawnPoint(movement)

        camera.position.x === body.translation().x;
        camera.position.y === body.translation().y + 1;
        camera.position.z === body.translation().z

        cameraTarget.x = body.translation().x;
        cameraTarget.y = body.translation().y + 0.6;
        cameraTarget.z = body.translation().z;
        if(controlsRef.current){ controlsRef.current.target = cameraTarget; }
    }, [currentRoom])

    useEffect(() => {
        let action = "M_Standing_Idle_001"

        if(!onLoading){
            if(forward || backward || left || right) {
                action = "M_Walk_001"

                if(shift) {
                    action = "F_Jog_001"
                }

            } else {
                action = "M_Standing_Idle_001"
            }
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

            if(currentAction.current === 'F_Jog_001' || 
                currentAction.current === 'M_Walk_001')
            {
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
                
                if(forward) {
                    scene.quaternion.rotateTowards(rotateQuarternion, 0.5)
                } else {
                
                    if(newDirectionOffset !== 0) {
                        scene.quaternion.rotateTowards(rotateQuarternion, 0.5)
                    }
                }

                camera.getWorldDirection(walkDirection);
                walkDirection.normalize();
                walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset);

                const velocity = currentAction.current == "F_Jog_001" ? 3 : 2;

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
        posArray[1] -= 0.5
        
        rotation.toArray(rotArray) 

        if(!arraysEqual(oldPos, posArray) || !arraysEqual(oldRot, rotArray)) {

            socket.emit('move', {
                id,
                rotation: rotArray,
                position: posArray,
                action: currentAction.current
            })

            setOldPos(posArray)
            setOldRot(rotArray)
        }

        setPosMinimap(posArray)
    })
  
    return (
        <RigidBody
            ref={bodyRef}
            type="dynamic"
            colliders={false}
            enabledRotations={[false, false, false]} 
            linearDamping={0.5}
            angularDamping={0.5}
            restitution={0}
            friction={0}
            gravityScale={1}
        >
            <CapsuleCollider args={[0.3, 0.2]} />
              
            <group dispose={null} position={[0, -0.5, 0]} rotation={[0, -9.4, 0]}> 
                <primitive object={scene} ref={modelRef} />  
            </group> 

            <OrbitControls 
                enableRotate={true} 
                enablePan={false} 
                enableDamping={false} 
                enableZoom={false}
                dampingFactor={0.1}
                ref={controlsRef}
                args={[camera, gl.domElement]}
                minDistance={minDistance}
                maxDistance={minDistance}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
            />
        </RigidBody>
    )
}

export default Character

useGLTF.preload("/models/animations/M_Walk_001.glb");
useGLTF.preload("/models/animations/M_Standing_Idle_001.glb");
useGLTF.preload("/models/animations/M_Dances_001.glb");