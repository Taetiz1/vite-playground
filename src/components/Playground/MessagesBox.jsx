import React from "react";
import interfacestyles from '../../pages/Interface.module.css'
import { useSocketClient } from "../Login/SocketClient";

const MessagesBox = ({message, msgIndex}) => {
    const { username } = useSocketClient();
    const suggestion = `@${username} `
    let onSuggestion;

    const highlightText = (text) => {
        
        const parts = text.split(`${suggestion}`);
        return parts.map((part, index) => (
          <span key={index}>
            {index > 0 && <span style={{ color: '#f58216' , marginRight: '5px'}}>@{username}</span>}
            {part}
          </span>
        ));
    };

    if (message.message.includes(suggestion)) {
        onSuggestion = true
    } else {
        onSuggestion = false
    }
    
    
    return(
        <li key={msgIndex} className={interfacestyles.li_chatBox}>
            <div className={interfacestyles.chatBox} >
                <span style={{
                    backgroundColor: `#a648e5`,
                    color: '#eee',
                    fontWeight: '500',
                    fontSize: '16px',
                    fontFamily: `'kanit', sans-serif`,
                    borderRadius: `8px`,
                    padding: '2px 4px 2px 4px',
                }}>
                    {message.username} 
                </span>
                <p className={interfacestyles.message}>{highlightText(message.message)}</p>
            </div>
        </li> 
    )
}

export default MessagesBox