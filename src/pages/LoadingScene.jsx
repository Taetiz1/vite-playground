import React from "react";
import { useProgress } from "@react-three/drei"
import styles from './LoadingScene.module.css'
import { useSocketClient } from "../components/Login/SocketClient";

const LoadingScene = ({username, onLoading, setOnLoading }) => {
    const { progress } = useProgress();

    const { errorEmail } = useSocketClient();

    return (
        onLoading && (<div className={styles.loadingScene}>
            {/* <div className={styles.progress}>
                <div
                    className={styles.progressValue}
                    style={{
                        width: `${progress}%`,
                    }} 
                />
            </div> */}
            <div className={styles.board}>
                {!errorEmail && (<div>
                    <h1 className={styles.boardTitle}>Welcome <span>{username}!</span> to Wat Suan Kaew.</h1>  
                    <p>Let's create your avatar.</p>
                </div>)}

                {errorEmail && (<div>
                    <h1 className={styles.boardTitle}>Sorry </h1>
                    <p>Sorry, This email is already logged in, please return.</p>
                </div>)}

                <button 
                    disabled={progress < 100}
                    onClick={() => {
                        if(errorEmail) {
                            window.location.reload();
                        } else {setOnLoading()}
                    }}
                >
                   {errorEmail ? 'Return' : (progress < 100 ? 'Loading...' : 'OK')}
                </button>
            </div>

        </div>)
    )
}

export default LoadingScene