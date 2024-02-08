import React, { useRef, useEffect } from "react"; 

const Video = ({ Peer, Mute }) => {

    const ref = useRef();
    
    useEffect(() => {

            console.log("got peer")

            Peer.on("stream", (stream) => {
                ref.current.srcObject = stream;

                console.log("set stream")
            })

            // Peer.on('close', () => {
            //     disconnectVoice()
            // });

    }, [Peer]);

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