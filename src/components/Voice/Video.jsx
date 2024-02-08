import React, { useRef, useEffect } from "react"; 

const Video = ({ p, disconnectVoice, Mute, Peers }) => {

    const ref = useRef();
    
    useEffect(() => {

        if(p !== null && p !== undefined) {

            p.peer.on("stream", (stream) => {
                ref.current.srcObject = stream;

                console.log("set stream")
            })

            p.peer.on('close', () => {
                disconnectVoice()
            });
        }

    }, [Peers]);

    useEffect(() => {

        if(ref.current){
            ref.current.muted = Mute;
        }

    }, [Mute])
    
    return (
        <>
            <video 
                style={{ 
                    width: "100px",
                    height: "100px",
                }} 
                playsInline 
                autoPlay    
                ref={ref} 
            />
        </>
        
    );
}

export default Video