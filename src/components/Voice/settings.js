import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
    
export const appConfig = {
    mode: "rtc",
    codec: "vp8",
    appId: process.env.AgoraAPPID,
    token: null
}

export const useVideoClient = createClient(appConfig);
export const useVideoTracks = createMicrophoneAndCameraTracks();