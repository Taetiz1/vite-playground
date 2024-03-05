import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = import.meta.env.AGORA_APPID
const token = null

export const appConfig = {
    mode: "rtc",
    codec: "vp8",
    appId: appId,
    token: token
}

export const useVideoClient = createClient(appConfig);
export const useVideoTracks = createMicrophoneAndCameraTracks();