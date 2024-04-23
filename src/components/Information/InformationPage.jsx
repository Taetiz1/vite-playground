import React, { useState } from "react"
import { Container, Text, Group, Button, SimpleGrid } from "@mantine/core"
import { useSocketClient } from "../Login/SocketClient"

const InformationPage = () => {
    
    const [Index, setIndex] = useState(0)
    const {
        information
    } = useSocketClient()

    return (
        <Container>
            <Group position="center" cols={1} >
                <SimpleGrid cols={3} spacing="xs" verticalSpacing="xs">
                    <Button 
                        variant="light" 
                        radius="md" 
                        onClick={() => {
                            if(Index > 0) {
                                setIndex(Index-1)
                            } else {
                                setIndex(information.image.length-1)
                            }
                        }}
                        uppercase 
                    >
                        Back
                    </Button>
                    <Text ta={"center"} fw={700}>
                        {Index+1}
                    </Text>
                    <Button 
                        variant="light" 
                        radius="md" 
                        onClick={() => {
                            if(Index < information.image.length-1) {
                                setIndex(Index+1)
                            } else {
                                setIndex(0)
                            }
                        }}
                        uppercase 
                    >
                        Next
                    </Button>
                </SimpleGrid>
                
            
                <div 
                    style={{ 
                        position: "relative", 
                        width: "800px", 
                        height: "400px" 
                    }}
                >
                    {information.image.map((img, index) => (
                        <img 
                            key={index}  
                            src={img} 
                            alt="image" 
                            style={{
                                position: "absolute", 
                                top: "50%", 
                                left: "50%", 
                                transform: "translate(-50%, -50%)",
                                opacity: Index === index ? 1 : 0 ,
                                maxHeight: "400px"
                            }}
                        />
                    ))}
                </div>
                
                <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
                <Text fz="xl" fw={700} ta={'center'}>
                    {information.header}
                </Text> 
                <Text ta={"left"}>
                    {information.content}
                </Text> 
                </SimpleGrid>
            </Group>
        </Container>
    )
}

export default InformationPage