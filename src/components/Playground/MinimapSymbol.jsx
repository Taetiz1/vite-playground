import React from "react"

const MinimapSymbol = ({layer = 1}) => {

  return (
    <mesh layers={layer}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}

export default MinimapSymbol