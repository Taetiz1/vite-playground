import React from 'react'
import { RigidBody } from '@micmania1/react-three-rapier'
import Scene from './Scene';
import EnterSceneBT from './EnterSceneBT';
import { CuboidCollider } from '@micmania1/react-three-rapier';

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

            {currentRoom.enterBT && currentRoom.enterBT.map((bt, index) => (
                <EnterSceneBT key={index}  position={[28, 2, 21]} setOnLoading={setOnLoading} roomID={bt.roomID} />
            ))}

            <CuboidCollider position={[0, 0, 0]} args={[200, 0.4, 200]} />

            <group position={[0, -4, 0]}> 
              <mesh rotation-x={Math.PI * -0.5}>
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial color={"#458745"} />
              </mesh>
            </group>

          </>
        )
    }
}