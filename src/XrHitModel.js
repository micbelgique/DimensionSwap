import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import { useRef, useState } from "react";
import Model from "./Model";

const XrHitModel = () => {
  const reticleRef = useRef();
    const [currentModel, setCurrentModel] = useState({position: [10,0,0], rotation:[0,0,0]});

  const { isPresenting } = useXR();

  useThree(({ camera }) => {
    if (!isPresenting) {
      camera.position.z = 2;
    }
  });

  useHitTest((hitMatrix, hit) => {
    hitMatrix.decompose(
      reticleRef.current.position,
      reticleRef.current.quaternion,
      reticleRef.current.scale
    );

    reticleRef.current.rotation.set(-Math.PI / 2, 0, 0);
  });

  const placeModel = (e) => {
    let position = e.intersection.object.position.clone();
  
    setCurrentModel({position: position, rotation: currentModel.rotation});
  };

  const turnModel = (e) => {
    
    const newRotation = [currentModel.rotation[0], currentModel.rotation[1]+0.25, currentModel.rotation[2]]
    
    setCurrentModel({position: currentModel.position, rotation: newRotation});
  };

  return (
    <>
    
    
      <ambientLight />

      {isPresenting && (
        <>
          <Interactive onSelect={(e)=>{turnModel(e)}}>
          <Model position={currentModel.position} rotation={currentModel.rotation} />
          </Interactive>
          
          <Interactive onSelect={placeModel}>
            <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
              <ringGeometry args={[0.1, 0.25, 32]} />
              <meshStandardMaterial color={"white"} />
            </mesh>
          </Interactive>
        </>
      )}

      {!isPresenting && <Model/>}
    </>
  );
};

export default XrHitModel;