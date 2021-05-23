import { Button, TextField } from "@material-ui/core";
import { PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import React, { FC, useEffect, useRef, useState } from "react";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vec3 } from "../core";
import { useWindowSize } from "@react-hook/window-size";

type Props = {
    scene: Scene;
    center: Vec3.Vec3;
};

const Canvas: FC<Props> = props => {
    const [windowWidth, windowHeight] = useWindowSize();
    const width = windowWidth * 0.55;
    const height = windowHeight * 0.8;
    const fov = 75;
    const mount = useRef<HTMLDivElement>(null);
    const [controls, setControls] = useState<OrbitControls>();
    const [camera, setCamera] = useState<PerspectiveCamera>();
    const [renderer, setRenderer] = useState<WebGLRenderer>();
    const [zoom, setZoom] = useState(10);

    const saveImage = () => {
        if (camera === undefined) return;
        const w = 640;
        const h = 480;
        const cam = camera.clone();
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
        const ren = new WebGLRenderer({ antialias: true });
        ren.setClearColor("#87ceeb");
        ren.setSize(w, h);
        ren.shadowMapEnabled = true;
        ren.shadowMapType = PCFSoftShadowMap;
        const a = document.createElement("a");
        ren.render(props.scene, cam);
        a.href = ren.domElement.toDataURL().replace("image/png", "image/octet-stream");
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
                label="Zoom level"
                value={zoom}
                onChange={e => setZoom(Math.max(parseFloat(e.target.value), 0))}
            />
            <Button
                variant="contained"
                onClick={() => {
                    if (controls === undefined) return;
                    controls.object.position.set(controls.target.x, controls.target.y, controls.target.z + zoom);
                }}>
                Align (0,0,1)
            </Button>
            <Button
                variant="contained"
                onClick={() => {
                    if (controls === undefined) return;
                    controls.object.position.set(
                        controls.target.x + zoom / Math.sqrt(3),
                        controls.target.y + zoom / Math.sqrt(3),
                        controls.target.z + zoom / Math.sqrt(3)
                    );
                }}>
                Align (1,1,1)
            </Button>
            <br />
            <Button variant="contained" onClick={saveImage}>
                Save screenshot
            </Button>
        </>
    );
};

export default Canvas;
