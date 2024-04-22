import React from 'react'
import Scene from './Scene';
import EnterSceneBT from './EnterSceneBT';
import { CuboidCollider } from '@micmania1/react-three-rapier';
import InteractiveButton from './InteractiveButton';
import InformationButton from '../Information/InfornationButton';

export const Ground = ({ currentRoom, setOnLoading }) => {
  const colliders = currentRoom.colliders;
  const enterBT = currentRoom.enterBT
  const InteractiveBT = currentRoom.interactive
  const InformationBT = currentRoom.information

    return (
      <>
        {currentRoom.id && <Scene key={currentRoom.id} settings={currentRoom} />}

        {enterBT && enterBT.map((bt, index) => (
          <EnterSceneBT 
            key={index} 
            position={bt.pos} 
            setOnLoading={setOnLoading} 
            roomID={bt.roomID} 
            atPos={bt.atPos} 
          />
        ))}

        {colliders && 
          <>
            {colliders.cuboid && colliders.cuboid.map((cube, index) => (
              <CuboidCollider key={index} position={cube.pos} rotation={cube.rot} args={cube.args} />
            ))}  
          </>
        }
        
        {InteractiveBT && InteractiveBT.map((bt, index) => (
          <InteractiveButton 
            key={index}
            emote={bt.emote} 
            pos={bt.pos} 
            rot={bt.rot} 
          />
        ))}

        {InformationBT && InformationBT.map((info, index) => (
          <InformationButton key={index} information={info} />
        ))}

        <group position={[0, -4, 0]}> 
          <mesh rotation-x={Math.PI * -0.5}>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color={"#458745"} />
          </mesh>
        </group>

      </>
    )

}