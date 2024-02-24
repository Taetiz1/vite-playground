import React from "react";
import styles from './LoadingScene.module.css'

const ConnectionFailed = () => {

        return (
            <div className={styles.connectFailed_background}>

                <div className={styles.board}>

                    <div>
                        <h1 className={styles.boardTitle}>Connection failed</h1>  
                        <p>Please press exit and log in again.</p>
                    </div> 

                    <button 
                        onClick={() => {
                            window.location.reload()
                        }}
                    >
                        Exit
                    </button>
                </div>

            </div>
        )
}

export default ConnectionFailed