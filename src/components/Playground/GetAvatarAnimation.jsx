import React from "react";
import { useGLTF } from "@react-three/drei";

function GetAvatarAnimation(avatarAnimation) {

    const { animations: walkAnimation } = useGLTF("/models/animations/M_Walk_001.glb")
    const { animations: idleAnimation } = useGLTF("/models/animations/M_Standing_Idle_001.glb")
    const { animations: runAnimation } = useGLTF("/models/animations/F_Jog_001.glb")
    const { animations: danceAnimation } = useGLTF("/models/animations/M_Dances_009.glb")
    const { animations: helloAnimation } = useGLTF("/models/animations/M_Standing_Expressions_013.glb")
    const { animations: saveAnimation } = useGLTF("/models/animations/M_Standing_Expressions_015.glb")
    const { animations: notGoodAnimation } = useGLTF("/models/animations/M_Standing_Expressions_016.glb")
    const { animations: sitAnimation } = useGLTF("/models/animations/sittingGround.glb")

    const actionsArray = [walkAnimation[0], idleAnimation[0], runAnimation[0], danceAnimation[0], helloAnimation[0], saveAnimation[0], notGoodAnimation[0], sitAnimation[0]]

    avatarAnimation.forEach((animation) => {
        const { animations } = useGLTF(animation)

        actionsArray.push(animations[0])
    })

    return actionsArray
}

export default GetAvatarAnimation

useGLTF.preload("/models/animations/M_Walk_001.glb");
useGLTF.preload("/models/animations/M_Standing_Idle_001.glb");
useGLTF.preload("/models/animations/M_Standing_Expressions_013.glb");
useGLTF.preload("/models/animations/M_Standing_Expressions_015.glb");
useGLTF.preload("/models/animations/M_Standing_Expressions_016.glb");
useGLTF.preload("/models/animations/M_Dances_009.glb");
useGLTF.preload("/models/animations/F_Jog_001.glb");
useGLTF.preload("/models/animations/sittingGround.glb");