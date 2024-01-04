import React, { Suspense, useState, } from "react";
import { Canvas } from '@react-three/fiber'
import configuratorStyles from './Configurator.module.css'
import ConfiguratorInterface from '../components/Configurator/ConfuguratorInterface'
import LoadingScene from './LoadingScene'
import { CameraControls } from '../components/Configurator/CameraControls'
import Body_character from '../components/Configurator/Body_character'
import { Sky } from "@react-three/drei";
import { useSocketClient } from "../components/Login/SocketClient";
import { AvatarCreator } from "@readyplayerme/react-avatar-creator";
import Cactus from "../components/Playground/Cactus";

function Configurator() {
    const { 
      socketClient,
      username,
      setAvatarUrl,
      avatarUrl,
    } = useSocketClient();

    const [onLoading, setOnLoading] = useState(true);
    const [avatarMode, setAvatarMode] = useState(false);

    return (
        <>
          <div className={configuratorStyles.container}>

            {avatarMode && (
              <AvatarCreator 
                subdomain="metaverse-wat-suan-kaew" 
                config={{
                  clearCache: true,
                  bodyType: 'fullbody',
                  quickStart: false,
                  language: 'th',
                }} 
                style={{
                  width: '100%', 
                  height: '100vh', 
                  border: 'none',
                  zIndex: 999999999,
                }} 
                onAvatarExported={(event) => {
                  let newAvatarUrl =
                  event.data.url === avatarUrl.split("?")[0]
                    ? event.data.url.split("?")[0] + "?" + new Date().getTime()
                    : event.data.url;
                  newAvatarUrl +=
                    (newAvatarUrl.includes("?") ? "&" : "?") +
                    "meshlod=1&quality=medium";
                  setAvatarUrl(newAvatarUrl)
                  setAvatarMode(false)
                }}

              />
            )}
            
            {!avatarMode && <Canvas 
              shadows 
              camera={{ 
                position: [1, 0.5, 2.5], 
                fov: 50,
              }}
            >
                <Sky sunPosition={[0, 10, 0]} />
                <CameraControls />
                <ambientLight />
                <directionalLight position={[4, 5, 4.5]} intensity={1}  castShadow shadow-mapSize={1024} />

                <Suspense>
                  <group>
                    <Body_character rotation={[0, -18.5, 0]} position={[0, -1, 0]} />
                  </group>
                </Suspense>
      
                <mesh rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -1, 0]} receiveShadow>
                  <planeBufferGeometry args={[10, 10, 1, 1]} />
                  <shadowMaterial transparent opacity={0.2} />
                </mesh>
                
            </Canvas>}

            {!avatarMode && <ConfiguratorInterface 
              onLoading={onLoading} 
              setOnLoading={() => setOnLoading(true)} 
              setCustomMode={() => setAvatarMode(true)} 
              socket={socketClient}
            />}

          <LoadingScene username={username} onLoading={onLoading} setOnLoading={() => setOnLoading(false)}/>  
        </div>
      </>
    )
}

export default  Configurator
