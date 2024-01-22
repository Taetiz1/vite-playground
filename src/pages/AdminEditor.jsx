import React, { useState } from "react";
import { useSocketClient } from "../components/Login/SocketClient";

import styles from './AdminEditor.module.css'
function AdminEditor ({id}) {

    const [page, setPage] = useState("") 

    function handleUsers() {
        setPage("Users")
    }

    function handleQuestions() {
    }

    return (

        <div className={styles.container}>
            <ul className={styles.navbar}>
                <li className={styles.navbar_li}> <img src="/src/assets/MetaverseLogo.png" alt="icon" width="150" height="58" style={{pointerEvents: 'none', userSelect: 'none'}}/></li>
                <li className={styles.navbar_li} >
                    <a onClick={handleUsers} > 
                        Users 
                    </a>
                </li>
                <li className={styles.navbar_li} >
                    <a onClick={handleQuestions}> 
                        Questions 
                    </a>
                </li>
            </ul>

            <div className={styles.dashboard}>
                <div className={styles.displayname}>Admin: {id}</div>
                {page === "Users" && <div className={styles.users}>
                    users
                </div>}

                {page === "Questions" && <div className={styles.users}>
                    Questions
                </div>}
            </div>
        </div>
    )
}

export default AdminEditor