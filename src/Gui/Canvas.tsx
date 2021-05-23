import { PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import React, { FC, useEffect, useRef, useState } from "react";

import { Button } from "@material-ui/core";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useWindowSize } from "@react-hook/window-size";

type Props = { scene: Scene };

const Canvas: FC<Props> = props => {
    const [windowWidth, windowHeight] = useWindowSize();
    const width = windowWidth * 0.55;
    const height = windowHeight * 0.9;
    const fov = 75;
    const mount = useRef<HTMLDivElement>(null);
    const [controls, setControls] = useState<OrbitControls>();
    const [camera, setCamera] = useState<PerspectiveCamera>();
    const [renderer, setRenderer] = useState<WebGLRenderer>();

    const saveImage = () => {
        if (camera === undefined) return;
        const ren = new WebGLRenderer({ antialias: true });
        ren.setClearColor("#87ceeb");
        ren.setSize(640, 480);
        ren.shadowMapEnabled = true;
        ren.shadowMapType = PCFSoftShadowMap;
        const a = document.createElement("a");
        ren.render(props.scene, camera);
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
    }, [mount, width, height]);

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
            <Button variant="contained" onClick={() => saveImage()}>
                Save screenshot
            </Button>
        </>
    );
};

export default Canvas;
