import React, { useState, useEffect } from "react";
import { Canvas,  } from "react-three-fiber";

import { Grid, Switch } from "@mui/material/";
import { OrbitControls } from '@react-three/drei'
import "./AppStyle.css"; // Import the CSS file
import { XR, ARButton,  VRButton, } from '@react-three/xr'

import XrHitModel from "./XrHitModel";

import VRScene from "./VRScene";




function App() {
  const [mode, setMode] = useState("AR");
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isXrSupported, setIsXrSupported] = useState(false);


  const handleSceneModeChange = (event) => {
    setMode(event.target.checked ? "AR" : "VR");
  };
  const handleAutoRotateChange = (event) => {
    setIsAutoRotating(event.target.checked);
  };

  useEffect(() => {
    async function checkXRSupport() {
      const supported = await navigator.xr.isSessionSupported("immersive-vr");
      setIsXrSupported(supported);
    }

    checkXRSupport();
  }, []);

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        style={{ height: "100vh" }} // Adjust the height of the container to fill the viewport
      >
        <h1>Dimension Swap</h1>
        {!isXrSupported ?
          <Grid item>
            <h3>XR is not supported</h3>
          </Grid>
          :
          <Grid item>
            <Grid container direction="row" alignItems="center">
              <Grid item style={{ width: "10vh" }}>
                <Switch
                  checked={mode === "AR"}
                  onChange={handleSceneModeChange}
                  name="scene-mode-switch"
                />
              </Grid>



              <Grid item style={{ width: "15vh" }}>
                <label htmlFor="scene-mode-switch">
                  {mode === "VR" ? "VR Mode" : "AR Mode"}
                </label>
              </Grid>
            </Grid>
          </Grid>
        }
        <Grid item>
          <Grid container direction="row" alignItems="center">
            <Grid item style={{ width: "10vh" }}>
              <Switch
                checked={isAutoRotating}
                onChange={handleAutoRotateChange}
                name="autorotate-switch"
              />
            </Grid>



            <Grid item style={{ width: "15vh" }}>
              <label htmlFor="autorotate">
                Auto-rotate
              </label>
            </Grid>
          </Grid>
        </Grid>

        <Grid item style={{ flex: 1, width: "100%" }}>
          {(mode === "AR") &&
            <>
              <ARButton  sessionInit={{
                requiredFeatures: ["hit-test"],
              }} />
              <Canvas >
                <XR referenceSpace="local">
                  <OrbitControls autoRotate={isAutoRotating} />
                  <ambientLight intensity={1} />
                  <spotLight intensity={1} angle={1.5} penumbra={1} position={[0, 15, 10]} />
                  <spotLight intensity={1} angle={1.5} penumbra={1} position={[0, 15, -10]} />
                  <spotLight intensity={1} angle={1.5} penumbra={1} position={[10, 15, 0]} />
                  <spotLight intensity={1} angle={1.5} penumbra={1} position={[-10, 15, 0]} />
                  <XrHitModel />
                  
                </XR>
              </Canvas>
            </>
          }

          {(mode === "VR") &&
            <>
              <VRButton />
              <Canvas>
                <XR>
                  <VRScene />
                </XR>
              </Canvas>
            </>
          }
        </Grid>
      </Grid>
    </>
  );
}

export default App;
