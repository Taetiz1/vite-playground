import React, {useEffect} from "react";
import { useProgress } from "@react-three/drei"
import styles from './LoadingScene.module.css'
import { useSocketClient } from "../components/Login/SocketClient";
import { LoadingManager } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const LoadingScene2 = ({username, onLoading, setOnLoading }) => {
    const { progress } = useProgress();
    
    const loadingManager = new LoadingManager();
    const loader = new GLTFLoader(loadingManager)

    // loader.load(
    //     loadingManager.onProgress = (url, loaded, toal) => {
    //         console.log(`Start loading: ${url}`)
    //     }
    // )

    return (
        onLoading && (<div className={styles.loadingScene}>
            <div className={styles.progress}>
                <div
                    className={styles.progressValue}
                    style={{
                        width: `${progress}%`,
                    }} 
                />
            </div>
            <div className={styles.board}>
                <div>
                    <h1 className={styles.boardTitle}>Tutorial</h1>  
                </div>

                <button 
                    disabled={progress < 100}
                    onClick={setOnLoading}
                >
                   {progress < 100 ? 'Loading...' : 'OK'}
                </button>
            </div>

        </div>)
    )
}

export default LoadingScene2