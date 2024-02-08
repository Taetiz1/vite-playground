import React, { useRef, useEffect } from "react"; 

const VideoTest = ({ p, Mute }) => {

    const ref = useRef();
    
    useEffect(() => {
        p.on("stream", (stream) => {
            ref.current.srcObject = stream;
        })

        // p.peer.on('close', () => {
        //     disconnectVoice()

        // });

    }, [p]);

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

export default VideoTest