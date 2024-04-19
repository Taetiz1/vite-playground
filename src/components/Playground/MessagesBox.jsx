import React from "react";
import interfacestyles from '../../pages/Interface.module.css'
import { useSocketClient } from "../Login/SocketClient";
import { Avatar, Flex, Text, HoverCard } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

const MessagesBox = ({message, msgIndex}) => {
    const { username } = useSocketClient();
    const suggestion = `@${username} `
    let onSuggestion;
    const date = new Date(message.time);

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
                <Flex
                    mih={50}
                    gap="xs"
                    justify="flex-start"
                    align="center"
                    direction="row"
                    wrap="wrap"
                >
                    <span 
                        style={{
                            backgroundColor: `#a648e5`,
                            color: '#eee',
                            fontWeight: '500',
                            fontSize: '16px',
                            fontFamily: `'kanit', sans-serif`,
                            borderRadius: `28px`,
                        }}
                    >
                        <Avatar radius="xl" src={message.image} alt="avatar" />
                    </span>
                    <Text
                        sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
                        ta="center"
                        fz="md"
                        fw={700}
                        color="wheat"
                    >
                        {message.username}
                    </Text>
                    <HoverCard>
                        <HoverCard.Target>
                            <IconInfoCircle
                                size={20}
                                strokeWidth={2}
                                color="white"
                            />
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            <Text size="sm" color="black">
                                {date.toLocaleString()}
                            </Text>
                        </HoverCard.Dropdown>
                    </HoverCard>
                </Flex>
                <div className={interfacestyles.message}><p>{highlightText(message.message)}</p></div>
            </div>
        </li> 
    )
}

export default MessagesBox