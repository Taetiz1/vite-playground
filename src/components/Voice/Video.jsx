import React, { useRef, useEffect } from "react";    

const Video = ({peer}) => {
    const ref = useRef();
    
    useEffect(() => {
        
        peer.on("stream", (stream) => {
            ref.current.srcObject = stream;

            console.log("set stream")
        })

    }, []);
    
    return (
        <>
            <video style={{height: '40%', width: '50%'}} playsInline autoPlay ref={ref} />
        </>
        
    );
}

export default Video