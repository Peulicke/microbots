import { Button, FormControlLabel, MenuItem, Select, Switch, TextField } from "@material-ui/core";
import { PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import React, { FC, useEffect, useRef, useState } from "react";
import { Vec3, World } from "../core";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import update from "immutability-helper";
import { useWindowSize } from "@react-hook/window-size";

type Props = {
    scene: Scene;
    center: Vec3.Vec3;
    world: World.World | undefined;
};

const screenshotWidth = 1920;
const screenshotHeight = 1080;
const screenshotRenderer = new WebGLRenderer({ antialias: true });
screenshotRenderer.setClearColor("#87ceeb");
screenshotRenderer.setSize(screenshotWidth, screenshotHeight);
screenshotRenderer.shadowMapEnabled = true;
screenshotRenderer.shadowMapType = PCFSoftShadowMap;

const Canvas: FC<Props> = props => {
    const [windowWidth, windowHeight] = useWindowSize();
    const width = windowWidth * 0.55;
    const height = windowHeight * 0.8;
    const [fov, setFov] = useState(30);
    const mount = useRef<HTMLDivElement>(null);
    const [controls, setControls] = useState<OrbitControls>();
    const [camera, setCamera] = useState<PerspectiveCamera>();
    const [renderer, setRenderer] = useState<WebGLRenderer>();
    const [zoom, setZoom] = useState(10);
    const [saveScreenshots, setSaveScreenshots] = useState(false);

    const [align, setAlign] = useState<Vec3.Vec3>([0, 0, 1]);

    const saveImage = () => {
        if (camera === undefined) return;
        const cam = camera.clone();
        cam.aspect = screenshotWidth / screenshotHeight;
        cam.updateProjectionMatrix();
        const a = document.createElement("a");
        screenshotRenderer.render(props.scene, cam);
        a.href = screenshotRenderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
        a.download = "image.png";
        a.click();
    };

    useEffect(() => {
        const mc = mount.current;
        if (!mc) return undefined;
        // Camera
        const cam = new PerspectiveCamera(fov, width / height, 0.1, 1000);
        cam.position.set(10, 10, 10);
        cam.lookAt(0, 0, 0);
        setCamera(cam);
        // Renderer
        const ren = new WebGLRenderer({ antialias: true });
        ren.setClearColor("#87ceeb");
        ren.setSize(width, height);
        ren.shadowMapEnabled = true;
        ren.shadowMapType = PCFSoftShadowMap;
        mc.appendChild(ren.domElement);
        setRenderer(ren);
        // Controls
        const ctrls = new OrbitControls(cam, ren.domElement);
        ctrls.enableDamping = true;
        ctrls.dampingFactor = 0.5;
        setControls(ctrls);

        return () => {
            mc.removeChild(ren.domElement);
        };
    }, [mount]);

    useEffect(() => {
        if (camera === undefined) return;
        if (renderer === undefined) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }, [camera, renderer, width, height]);

    useEffect(() => {
        if (!controls || !renderer || !camera || !props.scene) return undefined;
        const i = window.setInterval(() => {
            controls.update();
            renderer.render(props.scene, camera);
        }, 1000 / 30);
        return () => {
            window.clearInterval(i);
        };
    }, [controls, renderer, camera, props.scene]);

    useEffect(() => {
        if (saveScreenshots) saveImage();
    }, [props.world]);

    return (
        <>
            <div ref={mount} />
            <Button
                variant="contained"
                onClick={() => {
                    if (controls === undefined) return;
                    const dx = props.center[0] - controls.target.x;
                    const dy = props.center[1] - controls.target.y;
                    const dz = props.center[2] - controls.target.z;
                    controls.object.position.set(
                        controls.object.position.x + dx,
                        controls.object.position.y + dy,
                        controls.object.position.z + dz
                    );
                    controls.target.set(props.center[0], props.center[1], props.center[2]);
                }}>
                Center camera
            </Button>
            <br />
            <TextField
                type="number"
                label="Camera distance"
                value={zoom}
                onChange={e => {
                    const zoomNew = Math.max(parseFloat(e.target.value), 1);
                    setZoom(zoomNew);
                    if (camera === undefined) return;
                    if (controls === undefined) return;
                    const p: Vec3.Vec3 = [
                        controls.object.position.x,
                        controls.object.position.y,
                        controls.object.position.z
                    ];
                    const t: Vec3.Vec3 = [controls.target.x, controls.target.y, controls.target.z];
                    const d = Vec3.sub(p, t);
                    const n = Vec3.normalize(d);
                    const m = Vec3.multiplyScalar(n, zoomNew);
                    const pos = Vec3.add(t, m);
                    controls.object.position.set(pos[0], pos[1], pos[2]);
                    camera.updateProjectionMatrix();
                }}
            />
            <TextField
                type="number"
                label="FOV"
                value={fov}
                onChange={e => {
                    const fovNew = Math.min(Math.max(parseFloat(e.target.value), 1), 179);
                    setFov(fovNew);
                    if (camera !== undefined) {
                        camera.fov = fovNew;
                        camera.updateProjectionMatrix();
                    }
                }}
            />
            {align.map((value, i) => (
                <Select
                    key={i}
                    value={value}
                    onChange={e => {
                        setAlign(update(align, { [i]: { $set: parseFloat(e.target.value as string) } }));
                    }}>
                    {[-1, 0, 1].map(v => (
                        <MenuItem key={v} value={v}>
                            {v}
                        </MenuItem>
                    ))}
                </Select>
            ))}
            <Button
                variant="contained"
                onClick={() => {
                    if (controls === undefined) return;
                    const t: Vec3.Vec3 = [controls.target.x, controls.target.y, controls.target.z];
                    const d = Vec3.multiplyScalar(align, zoom);
                    const pos = Vec3.add(t, d);
                    controls.object.position.set(pos[0], pos[1], pos[2]);
                }}>
                Align ({align.join(",")})
            </Button>
            <br />
            <FormControlLabel
                control={<Switch checked={saveScreenshots} onChange={e => setSaveScreenshots(e.target.checked)} />}
                label="Save screenshot on every frame"
            />
            {!saveScreenshots && (
                <Button variant="contained" onClick={saveImage}>
                    Save screenshot for this frame
                </Button>
            )}
        </>
    );
};

export default Canvas;
