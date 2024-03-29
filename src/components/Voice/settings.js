import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "324c17f38cca462fa7916683da05fb3a"

const token = null
    
export const appConfig = {
    mode: "rtc",
    codec: "vp8",
    appId: appId,
    token: token
}

export const useVideoClient = createClient(appConfig);
export const useVideoTracks = createMicrophoneAndCameraTracks();