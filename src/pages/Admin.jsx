import React, { useState } from "react";

import loginstyles from './Login.module.css'
import InputControl from "../components/Login/InputControl";
import { useSocketClient } from "../components/Login/SocketClient";
import { pushNotification } from "../components/Playground/Notification";
import AdminEditor from "./AdminEditor";

function Admin_login () {
    const {
        socketClient,
        adminLogedIn,

    } = useSocketClient();

    const [id, setID] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmission = () => {
        let errorMsg, IDEncoded, passwordEncoded;

            try {
                IDEncoded = btoa(`${id}`);
                passwordEncoded = btoa(`${password}`);

                if(id != '' && password != ''){

                    socketClient.emit("Admin_check", { id: IDEncoded, password: passwordEncoded})
                    
                } else {
                    errorMsg = "กรุณากรอก ID และ Password ให้ครบท่วน"
                    pushNotification("ล้มเหลว", errorMsg, "error")
                }

            } catch (error) {
                    
                errorMsg = "ID และ Password ต้องเป็นภาษาอังกฤษเท่านั้น"
                pushNotification("ล้มเหลว", errorMsg, "error")
            }
    }

    const keydownSubmission = (e) => {
        if (e.keyCode === 13 ) {
            handleSubmission()
        }
    }

    if(!adminLogedIn) {
        return (
            <div className={loginstyles.container}>
        
            <div className={loginstyles.innerBox}>
                    
                <div className={loginstyles.logo}>
                    <h3>Metaverse</h3>
                    <p>Wat•suan•kaew</p>
                </div>
                        
                <h2 className={loginstyles.header}>Admin Login</h2>
                <InputControl 
                    label="ID" 
                    placeholder="Enter ID" 
                    onChange={(event) =>
                        setID(event.target.value)
                    }
                    onKeyDown={keydownSubmission}
                />

                <InputControl 
                    label="Password" 
                    placeholder="Enter Password" 
                    
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    onKeyDown={keydownSubmission}
                />  

                <div className={loginstyles.footer}>
                    <button onClick={handleSubmission}>Login</button>
                </div>

            </div>

            </div>
        )
    } else {
        return(
            <AdminEditor id={id} />
        )
    }
}

export default Admin_login