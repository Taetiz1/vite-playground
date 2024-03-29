import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from '@react-three/fiber'
import configuratorStyles from './Configurator.module.css'
import ConfiguratorInterface from '../components/Configurator/ConfuguratorInterface'
import LoadingScene from './LoadingScene'
import { CameraControls } from '../components/Configurator/CameraControls'
import Body_character from '../components/Configurator/Body_character'
import { Sky } from "@react-three/drei";
import { useSocketClient } from "../components/Login/SocketClient";
import { AvatarCreator } from "@readyplayerme/react-avatar-creator";
import Loader from "../components/Configurator/Loader";
import { useProgress } from "@react-three/drei"
import { useVideoChat } from "../components/voiceContext";

function Configurator() {
  const { 
    socketClient,
    username,
    setAvatarUrl,
    avatarUrl,
    setconfigChar,
    startPoint
  } = useSocketClient();

  const {
    setChannelName
  } = useVideoChat();

  const { progress } = useProgress();
  const [onLoading, setOnLoading] = useState(true);
  const [onLoader, setOnLoader] = useState(false);
  const [avatarMode, setAvatarMode] = useState(false);

  function enterPlaygroud() {

    if(startPoint) {
      const { id } = socketClient;
      
      setChannelName(startPoint.roomID)
      socketClient.emit('joinroom', {
        id,
        name: username,
        avatarUrl: avatarUrl,
        roomID: startPoint.roomID,
        atPos: startPoint.atPos,
      })
      setconfigChar(true)
      setOnLoading()
    } 
  }

  useEffect(() => {
    if(socketClient) {

    }
  }, [socketClient])

  useEffect(() => {
    if(progress < 100) {
      setOnLoader(true)
    } else {
      setOnLoader(false)
    }

  }, [progress])

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
                "meshlod=1&quality=high";
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

            <group>
              <Suspense>
                <Body_character rotation={[0, -18.5, 0]} position={[0, -1, 0]} />
              </Suspense>
            </group>

          <mesh rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -0.9, 0]} receiveShadow>
            <planeBufferGeometry args={[10, 10, 1, 1]} />
            <shadowMaterial transparent opacity={0.2} />
          </mesh>
            
        </Canvas>}

        <ConfiguratorInterface 
          onLoading={onLoading} 
          enterPlaygroud={enterPlaygroud}
          setCustomMode={() => setAvatarMode(true)} 
          avatarMode={avatarMode}
          setAvatarMode={setAvatarMode}
        />

        <LoadingScene username={username} onLoading={onLoading} setOnLoading={() => setOnLoading(false)}/>
        {onLoader && <Loader />}  
      </div>
    </>
  )
}

export default  Configurator
