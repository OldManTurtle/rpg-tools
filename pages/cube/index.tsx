/* eslint-disable react/no-unknown-property */
import { theme } from "@/imports/theme";
import { ThemeProvider } from "@emotion/react";
import * as THREE from "three";
import {
  Box,
  CssBaseline,
  Toolbar,
  Container,
  Paper,
  Button,
  ButtonGroup,
} from "@mui/material";
import * as React from "react";
import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport, OrbitControls } from "@react-three/drei";

//Cube will be projected onto a unit sphere for ease of computation
type piece = {
  originalPosition: [number, number, number];
  //[W-Y, R-O, G-B] in order of (-1 to 1)
  position: [number, number, number]; //Each should be 1, 0, or -1, depending on location
  //TODO: Figure out how to deduce which orientations are identical
  rotation: THREE.Quaternion; //All start as identity
};
const start: [number, number, number][] = ([[1], [0], [-1]] as const)
  .flatMap(
    (v) =>
      [
        [...v, 1],
        [...v, 0],
        [...v, -1],
      ] as const,
  )
  .flatMap(
    (v) =>
      [
        [...v, 1],
        [...v, 0],
        [...v, -1],
      ] as const,
  );

//TODO: Make this smaller bytes
const hash = (cube: piece[]) => {
  const size = (a: piece) =>
    a.position[0] * 1 + a.position[1] * 10 + a.position[2] * 100;
  const sorted = [...cube]
    .filter((c) => c.position.filter((v) => v === 0).length < 2) //ignore centers for the hash
    .sort((a, b) => size(a) - size(b));
  return sorted
    .map(
      (v) =>
        new THREE.Euler()
          .setFromQuaternion(v.rotation)
          .toArray()
          .slice(0, 3)
          .map((v) => Math.round((2 * (v as number)) / Math.PI) + 2)
          .join("") +
        ((v.position[0] + 1) * 1 +
          (v.position[1] + 1) * 10 +
          (v.position[2] + 1) * 100) +
        ",",
    )
    .join("");
};

const memo: Record<string, [number, number, boolean][]> = {};
const rubik = () => {
  const rotations: Parameters<typeof rotate>[] = [];
  const elements: piece[] = start.map((v) => ({
    rotation: new THREE.Quaternion().identity(),
    originalPosition: [...v],
    position: [...v],
  }));

  const rotate = (
    index: 0 | 1 | 2,
    value: 1 | -1,
    counterclockwise: boolean,
  ) => {
    const axis = [0, 0, 0] as [number, number, number];
    axis[index] = value * (counterclockwise ? Math.PI / 2 : -Math.PI / 2);
    const rot = new THREE.Quaternion().setFromEuler(new THREE.Euler(...axis));

    for (const element of elements) {
      if (element.position[index] === value) {
        const x = (index + 1) % 3;
        const y = (index + 2) % 3;
        const oldx = element.position[x];
        const oldy = element.position[y];
        element.position[x] = oldy * (counterclockwise ? -1 : 1) * value;
        element.position[y] = oldx * (counterclockwise ? 1 : -1) * value;
        element.rotation = new THREE.Quaternion().multiplyQuaternions(
          rot,
          element.rotation,
        );
      }
    }
    rotations.push([index, value, counterclockwise]);
    const key = hash(elements);
    if (!(key in memo) || memo[key].length > rotations.length)
      memo[key] = rotations;
    return { elements, rotate, rotations };
  };
  memo[hash(elements)] = [];
  return { elements, rotate, rotations };
};

const PieceRender = ({ piece }: { piece: piece }) => {
  // Hold state for hovered and clicked events
  const [, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // Return the view, these are regular Threejs elements expressed in JSX
  const reference = useRef(null);
  return (
    <mesh
      position={piece.position}
      ref={reference}
      scale={0.98}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <mesh rotation={new THREE.Euler().setFromQuaternion(piece.rotation)}>
        <mesh position={[0, 0, 0.5]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color={"green"} />
        </mesh>
        <mesh position={[0, 0, -0.5]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color={"dodgerblue"} />
        </mesh>
        <mesh position={[0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color={"darkorange"} />
        </mesh>
        <mesh position={[-0.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color={"red"} />
        </mesh>
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color={"yellow"} />
        </mesh>
        <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color={"ghostwhite"} />
        </mesh>
      </mesh>
    </mesh>
  );
};

export default function Cube() {
  const [cube, setCube] = useState(rubik());
  const camReference = useRef(null);
  const renderSetup = (
    <>
      <ambientLight />
      <OrbitControls makeDefault enableDamping={false} ref={camReference} />
      <GizmoHelper
        alignment="top-right" // widget alignment within scene
        margin={[80, 80]} // widget margins (X, Y)
      >
        <GizmoViewport
          axisColors={["red", "green", "blue"]}
          labelColor="white"
        />
      </GizmoHelper>
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} />
    </>
  );
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper>{hash(cube.elements)}</Paper>
            <Paper>{JSON.stringify(cube.rotations)}</Paper>
            <Paper>
              <ButtonGroup>
                <Button onClick={() => setCube(cube.rotate(0, 1, false))}>
                  R
                </Button>
                <Button onClick={() => setCube(cube.rotate(0, -1, false))}>
                  L
                </Button>
                <Button onClick={() => setCube(cube.rotate(1, 1, false))}>
                  U
                </Button>
                <Button onClick={() => setCube(cube.rotate(1, -1, false))}>
                  D
                </Button>
                <Button onClick={() => setCube(cube.rotate(2, 1, false))}>
                  F
                </Button>
                <Button onClick={() => setCube(cube.rotate(2, -1, false))}>
                  B
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button onClick={() => setCube(cube.rotate(0, 1, true))}>
                  R*
                </Button>
                <Button onClick={() => setCube(cube.rotate(0, -1, true))}>
                  L*
                </Button>
                <Button onClick={() => setCube(cube.rotate(1, 1, true))}>
                  U*
                </Button>
                <Button onClick={() => setCube(cube.rotate(1, -1, true))}>
                  D*
                </Button>
                <Button onClick={() => setCube(cube.rotate(2, 1, true))}>
                  F*
                </Button>
                <Button onClick={() => setCube(cube.rotate(2, -1, true))}>
                  B*
                </Button>
              </ButtonGroup>
            </Paper>
            <Paper elevation={5}>
              <Canvas style={{ height: "400px" }}>
                {renderSetup}
                <ambientLight intensity={Math.PI / 2} />
                <spotLight
                  position={[10, 10, 10]}
                  angle={0.15}
                  penumbra={1}
                  decay={0}
                  intensity={Math.PI}
                />
                <pointLight
                  position={[-10, -10, -10]}
                  decay={0}
                  intensity={Math.PI}
                />
                {cube.elements.map((piece) => (
                  <PieceRender
                    key={
                      JSON.stringify(piece.originalPosition) +
                      JSON.stringify(piece.position)
                    }
                    piece={piece}
                  />
                ))}
              </Canvas>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
