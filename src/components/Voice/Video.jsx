import React, { useRef, useEffect } from "react"; 

const Video = ({ peer, peerIndex, Mute, disconnectVoice }) => {

    const ref = useRef();
    
    useEffect(() => {

        peer.on("stream", stream => {
            ref.current.srcObject = stream;

            console.log('setStreaam')
        })

        peer.on('close', () => {
            disconnectVoice(peerIndex)
        });

    }, []);

    useEffect(() => {

        if(ref.current){
            ref.current.muted = Mute;
        }

    }, [Mute])
    
    return (
        <>
            <video 
                style={{ 
                    width: "135px",
                    height: "101.65px",
                    border: "1px solid #ccc",
                    backgroundColor: "rgba(0, 0, 0, .25)",
                }} 
                playsInline 
                autoPlay    
                ref={ref} 
            />
        </>
        
    );
}

export default Video