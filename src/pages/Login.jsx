import React, { useState } from "react";
import InputControl from '../components/Login/InputControl';
import { useSocketClient } from "../components/Login/SocketClient";
import { pushNotification } from '../components/Playground/Notification';
import { containsTHBadWords } from "../components/handleTHBadwords";
import badWords from 'bad-words';
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Loader from "../components/Login/Loader";

import loginstyles from './Login.module.css'

function Login () {
  const {
    setEmail,
    username, 
    setUsername,  
    setConnectServer, 
  } = useSocketClient();

  const [onLoader, setOnLoader] = useState(false)

  const login = useGoogleLogin({
    onSuccess: async(response) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        )

        const sanitizedEmail = res.data.email.replace(/\./g, "_");
        const username = res.data.given_name;
        
        setOnLoader(true)
        setEmail(sanitizedEmail)
        setUsername(username)
        setConnectServer(true)
        
      } catch(err) {
        console.log(err)
      }
    }
  })

  const handleSubmission = () => {
    const filter = new badWords();

    let errorMsg
    if(!username) {
    
      errorMsg = "Please enter Nickname."
      pushNotification("ล้มเหลว", errorMsg, "error")
    
      return
          
    } else {
          
      if(containsTHBadWords(username) || filter.isProfane(username)) {
            
        errorMsg = "Please don't use any bad words in your nickname."
        pushNotification("ล้มเหลว", errorMsg, "error")
    
        return
    
      } else {
        errorMsg = ""
        setConnectServer(true)
        setOnLoader(true)
      }
    
    }
  }
      
  const keydownSubmission = (e) => {
    if (e.keyCode === 13 ) {
      handleSubmission()
    }
  }

  return (
    <div className={loginstyles.container}>
      <div className={loginstyles.innerBox}>
            
        <div className={loginstyles.logo}>
          <h3>Metaverse</h3>
          <p>Wat•suan•kaew</p>
        </div>
                
        <h2 className={loginstyles.header}>Guest Login</h2>
        <InputControl 
          label="Nickname" 
          placeholder="Enter Nickname" 
          type="text"
          onChange={(event) =>
            setUsername(event.target.value)
          }
          onKeyDown={keydownSubmission}
        />

        <div className={loginstyles.footer}>
          <button onClick={() => {
            handleSubmission()
          }}>Login</button>
        </div>

        <div className={loginstyles.bottom}>
          <p> Or login with </p>

          <button 
            type="button" 
            className={loginstyles.google_btn} 
            onClick={() => {
              login()
            }}
          >
            Google
          </button>
        </div>

      </div>
      
      {onLoader && <Loader />}
    </div>
  )
}

export default Login