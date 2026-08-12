import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Helper to generate a 2D Canvas Texture for 360° Cylinder Wrapping
const createLabelTexture = (productName, subtitle, accentColor, imageTexture) => {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, "#0E0405");
  grad.addColorStop(0.25, "#200A0E");
  grad.addColorStop(0.5, "#381016");
  grad.addColorStop(0.75, "#200A0E");
  grad.addColorStop(1, "#0E0405");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative Metallic Stripes
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, 0, canvas.width, 40);
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

  ctx.fillStyle = "#FFC02D";
  ctx.fillRect(0, 40, canvas.width, 12);
  ctx.fillRect(0, canvas.height - 52, canvas.width, 12);

  // Center Front Branding (Around x = 1024)
  const centerX = 1024;

  // Brand Badge
  ctx.fillStyle = "rgba(196, 65, 0, 0.4)";
  ctx.strokeStyle = "#FFC02D";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(centerX - 240, 120, 480, 70, 35);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#FFC02D";
  ctx.font = "900 32px Montserrat, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("A1 CHIPS • 100% COCONUT OIL", centerX, 166);

  // Main Product Title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 75px Montserrat, sans-serif";
  ctx.shadowColor = "rgba(0,0,0,0.8)";
  ctx.shadowBlur = 20;
  ctx.fillText(productName, centerX, 300);

  // Subtitle
  ctx.fillStyle = accentColor;
  ctx.font = "700 36px Montserrat, sans-serif";
  ctx.shadowBlur = 0;
  ctx.fillText(subtitle || "AUTHENTIC HERITAGE CRUNCH", centerX, 360);

  // Draw product image in center if available
  if (imageTexture && imageTexture.image) {
    try {
      const img = imageTexture.image;
      const imgWidth = 420;
      const imgHeight = (img.height / img.width) * imgWidth;
      ctx.drawImage(img, centerX - imgWidth / 2, 420, imgWidth, imgHeight);
    } catch (e) {
      console.warn("Could not draw texture image onto label canvas", e);
    }
  }

  // Quality Badges at Bottom
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 28px Montserrat, sans-serif";
  ctx.fillText("PREMIUM EXPORT QUALITY • NET WT. 200G", centerX, 910);

  // Back Label Details
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "600 22px monospace";
  ctx.textAlign = "left";
  ctx.fillText("NUTRITIONAL INFORMATION", 100, 200);
  ctx.fillText("Energy: 520 kcal", 100, 250);
  ctx.fillText("Total Fat: 30g", 100, 290);
  ctx.fillText("Protein: 6.5g", 100, 330);
  ctx.fillText("Carbohydrates: 56g", 100, 370);

  ctx.fillText("BARCODE / BATCH NO.", 1600, 200);
  ctx.fillText("||||||||||||||||||||||||||||||", 1600, 250);
  ctx.fillText("Batch: A1-2026-IND", 1600, 290);
  ctx.fillText("Mfd: Fresh Daily", 1600, 330);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const ThreeDProductModel = ({ imageUrl, productName, subtitle, accentColor = "#FF9500" }) => {
  const mountRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [angleDisplay, setAngleDisplay] = useState(0);

  const sceneRef = useRef(null);
  const canGroupRef = useRef(null);
  const rendererRef = useRef(null);
  const targetRotationY = useRef(0);
  const targetRotationX = useRef(0);
  const currentRotationY = useRef(0);
  const currentRotationX = useRef(0);
  const isPointerDown = useRef(false);
  const previousPointerPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 340;
    const height = currentMount.clientHeight || 340;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    rendererRef.current = renderer;

    while (currentMount.firstChild) {
      currentMount.removeChild(currentMount.firstChild);
    }
    currentMount.appendChild(renderer.domElement);

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 3.5);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.5);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(accentColor, 5, 15);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // 5. Build Volumetric 3D Canister Group
    const canGroup = new THREE.Group();
    canGroupRef.current = canGroup;
    scene.add(canGroup);

    // Load Image & Create Label Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (imgTexture) => {
      const labelTexture = createLabelTexture(productName, subtitle, accentColor, imgTexture);

      // 3D Cylinder Body Mesh
      const bodyRadius = 1.2;
      const bodyHeight = 3.3;
      const bodyGeo = new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyHeight, 64, 1, true);

      const bodyMat = new THREE.MeshStandardMaterial({
        map: labelTexture,
        roughness: 0.2,
        metalness: 0.25,
        side: THREE.DoubleSide,
      });

      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      canGroup.add(bodyMesh);

      // Metallic Top Cap Mesh
      const capGeo = new THREE.CylinderGeometry(bodyRadius + 0.04, bodyRadius + 0.04, 0.2, 64);
      const metalMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#E0E0E0"),
        roughness: 0.1,
        metalness: 0.9,
      });

      const topCap = new THREE.Mesh(capGeo, metalMat);
      topCap.position.y = bodyHeight / 2 + 0.1;
      topCap.castShadow = true;
      canGroup.add(topCap);

      // Metallic Pull Ring
      const ringGeo = new THREE.TorusGeometry(0.35, 0.05, 16, 32);
      const ringMesh = new THREE.Mesh(ringGeo, metalMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.set(0, bodyHeight / 2 + 0.21, 0.4);
      canGroup.add(ringMesh);

      // Metallic Bottom Base
      const bottomCap = new THREE.Mesh(capGeo, metalMat);
      bottomCap.position.y = -bodyHeight / 2 - 0.1;
      bottomCap.castShadow = true;
      canGroup.add(bottomCap);
    });

    // 6. Volumetric Floating 3D Snack Chips
    const chipsGroup = new THREE.Group();
    scene.add(chipsGroup);

    const chipCount = 10;
    const chipGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.03, 16, 1);
    const chipPos = chipGeom.attributes.position;

    for (let i = 0; i < chipPos.count; i++) {
      const cx = chipPos.getX(i);
      const cy = chipPos.getY(i);
      const cz = chipPos.getZ(i);
      chipPos.setY(i, cy + Math.sin(cx * 6) * 0.05 + Math.cos(cz * 6) * 0.05);
    }
    chipGeom.computeVertexNormals();

    const chipMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FFC02D"),
      roughness: 0.35,
      metalness: 0.15,
    });

    const chipsData = [];
    for (let c = 0; c < chipCount; c++) {
      const chipMesh = new THREE.Mesh(chipGeom, chipMat);
      const angle = (c / chipCount) * Math.PI * 2;
      const radius = 2.3 + Math.random() * 0.4;
      const heightOffset = (Math.random() - 0.5) * 3.0;

      chipMesh.position.set(Math.cos(angle) * radius, heightOffset, Math.sin(angle) * radius);
      chipMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      chipsGroup.add(chipMesh);
      chipsData.push({
        mesh: chipMesh,
        angle,
        radius,
        speed: 0.008 + Math.random() * 0.01,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.03,
        baseY: heightOffset,
      });
    }

    // 7. Floor Shadow
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.2;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // 8. Animation & Physics Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (canGroupRef.current) {
        if (isAutoRotate && !isPointerDown.current) {
          targetRotationY.current += 0.012;
        }

        currentRotationY.current += (targetRotationY.current - currentRotationY.current) * 0.1;
        currentRotationX.current += (targetRotationX.current - currentRotationX.current) * 0.1;

        canGroupRef.current.rotation.y = currentRotationY.current;
        canGroupRef.current.rotation.x = currentRotationX.current;

        canGroupRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.08;

        const deg = Math.round((((currentRotationY.current * 180) / Math.PI) % 360 + 360) % 360);
        setAngleDisplay(deg);
      }

      chipsData.forEach((cd) => {
        cd.angle += cd.speed;
        cd.mesh.position.x = Math.cos(cd.angle) * cd.radius;
        cd.mesh.position.z = Math.sin(cd.angle) * cd.radius;
        cd.mesh.position.y = cd.baseY + Math.sin(cd.angle * 2) * 0.12;

        cd.mesh.rotation.x += cd.rotSpeedX;
        cd.mesh.rotation.y += cd.rotSpeedY;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [imageUrl, productName, subtitle, accentColor, isAutoRotate]);

  // Pointer & Touch Handlers
  const handlePointerDown = (e) => {
    isPointerDown.current = true;
    setIsDragging(true);
    setIsAutoRotate(false);
    previousPointerPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isPointerDown.current) return;
    const deltaX = e.clientX - previousPointerPosition.current.x;
    const deltaY = e.clientY - previousPointerPosition.current.y;

    targetRotationY.current += deltaX * 0.015;
    targetRotationX.current = Math.max(-0.4, Math.min(0.4, targetRotationX.current + deltaY * 0.008));

    previousPointerPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
    setIsDragging(false);
  };

  return (
    <div className="relative w-full h-[350px] flex flex-col items-center justify-center select-none font-poppins">
      {/* Apple-style Minimal Badge */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-2 pointer-events-none">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40 font-mono">
          3D VIEW
        </span>

        <span className="text-[10px] font-mono text-white/40">
          {angleDisplay}°
        </span>
      </div>

      {/* Canvas Container */}
      <div
        ref={mountRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            handlePointerDown({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 1) {
            handlePointerMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
          }
        }}
        onTouchEnd={handlePointerUp}
        className={`w-full h-full flex items-center justify-center cursor-grab ${
          isDragging ? "cursor-grabbing" : ""
        }`}
      />

      {/* Minimal Apple-style Controls */}
      <div className="relative z-20 flex items-center gap-3 mt-1 text-[11px] font-medium text-white/60">
        <button
          onClick={() => {
            targetRotationY.current -= Math.PI / 4;
          }}
          className="hover:text-white transition-colors"
        >
          -45°
        </button>
        <span className="text-white/20">•</span>
        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className="hover:text-white transition-colors"
        >
          {isAutoRotate ? "Pause" : "Orbit"}
        </button>
        <span className="text-white/20">•</span>
        <button
          onClick={() => {
            targetRotationY.current += Math.PI / 4;
          }}
          className="hover:text-white transition-colors"
        >
          +45°
        </button>
        <span className="text-white/20">•</span>
        <button
          onClick={() => {
            targetRotationY.current = 0;
            targetRotationX.current = 0;
          }}
          className="hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ThreeDProductModel;
