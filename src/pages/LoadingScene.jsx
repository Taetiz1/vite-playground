import React from "react";
import { useProgress } from "@react-three/drei"
import styles from './LoadingScene.module.css'
import { useSocketClient } from "../components/Login/SocketClient";

const LoadingScene = ({username, onLoading, setOnLoading }) => {
    const { progress } = useProgress();

    const { errorEmail } = useSocketClient();

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

                    {errorEmail ? <>
                        <div>
                            <h1 className={styles.boardTitle}>Sorry</h1>
                            <p>Sorry, This Gmail is already logged in, please return.</p>
                        </div>

                        <button 
                        onClick={() => {
                            window.location.reload();
                        }}
                        >
                            Return
                        </button>

                    </> : <>
                        <div>
                            <h1 className={styles.boardTitle}>Welcome to Wat Suan Kaew, <span>{username}</span>.</h1>  
                            <p>Let's create your avatar.</p>
                        </div> 

                        <button 
                            disabled={progress < 100}
                            onClick={() => {
                                setOnLoading()
                            }}
                        >
                            {progress < 100 ? `Loading...${progress.toFixed(0)}%` : 'OK'}
                        </button>

                    </>}
                </div>

            </div>)
        )
}

export default LoadingScene