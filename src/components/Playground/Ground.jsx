import React from 'react'
import { RigidBody } from '@micmania1/react-three-rapier'
import Scene from './Scene';
import EnterSceneBT from './EnterSceneBT';

export const Ground = ({ currentRoom, setOnLoading}) => {

    if(currentRoom.id === "0") {
      return (
        <>
          <RigidBody colliders="cuboid" type="fixed">
              <group position={currentRoom.pos}>
                <mesh rotation-x={Math.PI * -0.5}>
                  <planeGeometry args={currentRoom.scale}/>
                  <meshStandardMaterial color={"#458745"}/>
                </mesh>
              </group>
          </RigidBody>

          <EnterSceneBT  position={[0, 1.5, 0]} setOnLoading={setOnLoading} roomID={"1"} />
        </>
      )
    } else { 
        return (
          <>
            {currentRoom.id && <Scene settings={currentRoom} />}
            
            <group position={[0, -4, 0]}>
              <mesh rotation-x={Math.PI * -0.5}>
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial color={"#458745"} />
              </mesh>
            </group>
            {currentRoom.enterBT.length > 0  && 

              currentRoom.enterBT.map((bt, index) => (
                <EnterSceneBT key={index}  position={bt.pos} setOnLoading={setOnLoading} roomID={bt.roomID} />
              ))
              
            }
          </>
        )
    }
}