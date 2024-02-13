import React, { useEffect } from "react";
import { useProgress } from "@react-three/drei"
import styles from './LoadingScene.module.css'
import { useSocketClient } from "../components/Login/SocketClient";

const LoadingScene = ({username, onLoading, setOnLoading }) => {
    const { progress } = useProgress();

    const { errorEmail } = useSocketClient();

    // if(errorEmail === null) {
        
    //     return (
    //         onLoading && (<div className={styles.board}>
    //                 <div>
    //                     <h1 className={styles.boardTitle}>Error</h1>
    //                     <p>The server may not be running or is unreachable, please try again later.</p>
    //                 </div>

    //                     <button 
    //                     onClick={() => {
    //                         window.location.reload();
    //                     }}
    //                     >
    //                         Return
    //                     </button>
    //         </div>)
    //     )

    // } else {

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
                            {progress < 100 ? 'Loading...' : 'OK'}
                        </button>

                    </>}
                </div>

            </div>)
        )
    // }
}

export default LoadingScene