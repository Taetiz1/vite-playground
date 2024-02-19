import React, { useRef, useEffect } from "react"; 

const Video = ({ user }) => {

    const ref = useRef();
    
    useEffect(() => {

        if(user) {
            ref.current.srcObject =  MediaStream(user.videoTrack, user.audioTrack)
        }

    }, [user]);
    
    return (
        <>
            <video 
                style={{ 
                    width: "135px",
                    height: "101.65px",
                    objectFit: "cover",
                }} 
                playsInline 
                autoPlay    
                ref={ref} 
            />
        </>
        
    );
}

export default Video