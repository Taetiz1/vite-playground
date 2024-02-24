import React from "react";
import { useProgress } from "@react-three/drei"
import styles from './LoadingScene.module.css'

const LoadingScene2 = ({onLoading, setOnLoading }) => {
    const { progress } = useProgress();

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