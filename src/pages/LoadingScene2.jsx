import React from "react";
import { useProgress } from "@react-three/drei"
import { useSocketClient } from "../components/Login/SocketClient";
import styles from './LoadingScene.module.css'

const LoadingScene2 = ({ onLoading, setOnLoading }) => {
    const { progress } = useProgress();

    const {
        currentRoom
    } = useSocketClient();
    const {name} = currentRoom

    return (
        onLoading && (<div className={styles.loadingScene}>
            <div className={styles.progress}>
                <div
                    className={styles.progressValue}
                    style={{
                        width: `${progress.toFixed(0)}%`,
                    }} 
                />
            </div>
            
            <div className={styles.board}>
                <div>
                    <h1 className={styles.boardTitle}><p><span style={{fontWeight: "200"}}>เรากำลังจะพาท่านไปสู่</span> "{name}"</p></h1>  
                </div>

                <button 
                    disabled={progress < 100}
                    onClick={setOnLoading}
                >
                   {progress < 100 ? `Loading...${progress.toFixed(0)}%` : 'OK'}
                </button>
            </div>

        </div>)
    )
}

export default LoadingScene2