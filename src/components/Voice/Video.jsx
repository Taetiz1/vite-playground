import React from "react"; 

const Video = () => {
    
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
            />
        </>
        
    );
}

export default Video