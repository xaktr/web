import React, { useEffect, useRef, useState } from 'react';

/**
 * SonarWaterfall: High-performance, Hardware-Accelerated Side-Scan Sonar Waterfall
 * Uses GPU-accelerated offscreen canvas buffering to prevent flickering and eliminate CPU bottlenecks.
 */
export default function SonarWaterfall({ viewMode = 'detection', simActive = true, onPingUpdate }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  // Keep references to props so they don't re-trigger the canvas animation loop
  const propsRef = useRef({ viewMode, simActive, onPingUpdate });
  useEffect(() => {
    propsRef.current = { viewMode, simActive, onPingUpdate };
  }, [viewMode, simActive, onPingUpdate]);

  const [telemetry, setTelemetry] = useState({
    ping: 1482,
    range: 18.4,
    altitude: 6.8,
    speed: 3.4,
    snr: 18.2,
    lat: "12°58'24.8\"N",
    lon: "80°15'09.2\"E"
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const width = 800;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    // --- 1. BUILD OFFSCREEN TEXTURE CANVAS (Generates ONCE per viewMode) ---
    // Offscreen canvas is 2x height (600px) so it tiles seamlessly
    const texHeight = 600;
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = texHeight;
    const offCtx = offscreen.getContext('2d');

    const midX = width / 2;
    const nadirWidth = 46;
    const portWidth = midX - nadirWidth / 2;

    const imgData = offCtx.createImageData(width, texHeight);
    const data = imgData.data;

    // Fast PRNG for reproducible acoustic noise
    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let y = 0; y < texHeight; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const distFromCenter = Math.abs(x - midX);

        // Nadir gap (Water column blind zone directly beneath AUV)
        if (distFromCenter < nadirWidth / 2) {
          const n = pseudoRandom() * 15;
          data[idx] = 8 + n;
          data[idx + 1] = 12 + n;
          data[idx + 2] = 18 + n;
          data[idx + 3] = 255;
          continue;
        }

        const swathRange = (distFromCenter - nadirWidth / 2) / portWidth;
        const falloff = Math.max(0.18, 1.0 - Math.pow(swathRange, 1.3) * 0.65);
        const ripple = Math.sin((x * 0.08) + (y * 0.04) + Math.sin(x * 0.015) * 3) * 16;
        const noise = pseudoRandom() * 255;

        let intensity = 0;

        if (viewMode === 'raw') {
          // RAW XTF: Amber acoustic palette with speckle
          intensity = (noise * 0.65 + ripple) * falloff;
          data[idx] = Math.min(255, intensity * 0.95);
          data[idx + 1] = Math.min(255, intensity * 0.75);
          data[idx + 2] = Math.min(255, intensity * 0.42);
        } else if (viewMode === 'clahe') {
          // CLAHE: Equalized cyan-gray acoustic palette
          const smoothed = (noise * 0.35 + 85 + ripple * 1.5) * falloff;
          intensity = Math.min(255, Math.pow(smoothed / 255, 0.75) * 265);
          data[idx] = Math.min(255, intensity * 0.6);
          data[idx + 1] = Math.min(255, intensity * 0.75);
          data[idx + 2] = Math.min(255, intensity * 0.95);
        } else {
          // CASCADED AI: Cobalt marine palette
          const smoothed = (noise * 0.38 + 80 + ripple * 1.2) * falloff;
          intensity = Math.min(255, Math.pow(smoothed / 255, 0.8) * 260);
          data[idx] = Math.min(255, intensity * 0.55);
          data[idx + 1] = Math.min(255, intensity * 0.72);
          data[idx + 2] = Math.min(255, intensity * 0.98);
        }

        data[idx + 3] = 255;
      }
    }

    offCtx.putImageData(imgData, 0, 0);

    // Target position inside the 600px offscreen buffer
    const targetBaseY = 220;
    const targetX = midX + 160;
    const targetW = 42;
    const targetH = 28;
    const shadowW = 85;

    // A) Draw Acoustic Shadow into Offscreen Canvas
    offCtx.fillStyle = 'rgba(2, 4, 7, 0.96)';
    offCtx.beginPath();
    offCtx.moveTo(targetX + targetW, targetBaseY);
    offCtx.lineTo(targetX + targetW + shadowW, targetBaseY - 5);
    offCtx.lineTo(targetX + targetW + shadowW + 12, targetBaseY + targetH + 10);
    offCtx.lineTo(targetX + targetW, targetBaseY + targetH);
    offCtx.closePath();
    offCtx.fill();

    // B) Draw Acoustic Highlight into Offscreen Canvas
    const highlightGrad = offCtx.createLinearGradient(targetX, targetBaseY, targetX + targetW, targetBaseY);
    if (viewMode === 'raw') {
      highlightGrad.addColorStop(0, '#ffe0a0');
      highlightGrad.addColorStop(1, '#ffc060');
    } else {
      highlightGrad.addColorStop(0, '#ffffff');
      highlightGrad.addColorStop(1, '#9eb4ff');
    }
    offCtx.fillStyle = highlightGrad;
    offCtx.beginPath();
    offCtx.roundRect(targetX, targetBaseY, targetW, targetH, 4);
    offCtx.fill();

    // Subtle net cross-hatch texture on object
    offCtx.strokeStyle = 'rgba(15, 25, 45, 0.65)';
    offCtx.lineWidth = 1.5;
    offCtx.beginPath();
    offCtx.moveTo(targetX + 6, targetBaseY + 4);
    offCtx.lineTo(targetX + targetW - 6, targetBaseY + targetH - 4);
    offCtx.moveTo(targetX + targetW - 6, targetBaseY + 4);
    offCtx.lineTo(targetX + 6, targetBaseY + targetH - 4);
    offCtx.stroke();

    // --- 2. GPU-ACCELERATED RENDER LOOP ---
    let scrollY = 0;
    let pingCounter = 1482;
    let lastTime = performance.now();
    let isRunning = true;
    let lastTelemetryUpdate = 0;

    const render = (time) => {
      if (!isRunning) return;

      const dt = Math.min(0.05, (time - lastTime) / 1000); // cap dt to avoid giant leaps
      lastTime = time;

      const { simActive, onPingUpdate } = propsRef.current;

      if (simActive) {
        // Scroll at constant 42px per second
        scrollY = (scrollY + dt * 42) % texHeight;
        pingCounter += dt * 15;

        // Throttled telemetry update (every 400ms) - DOES NOT RECREATE CANVAS
        if (time - lastTelemetryUpdate > 400) {
          lastTelemetryUpdate = time;
          const p = Math.floor(pingCounter);
          const r = +(18.0 + Math.sin(time / 1400) * 1.5).toFixed(1);
          const alt = +(6.8 + Math.cos(time / 2000) * 0.3).toFixed(1);

          setTelemetry(prev => ({
            ...prev,
            ping: p,
            range: r,
            altitude: alt,
            lat: `12°58'${(24.8 + (time * 0.00001) % 0.8).toFixed(1)}"N`
          }));

          if (onPingUpdate) onPingUpdate(p, r);
        }
      }

      // 1. Blit offscreen buffer onto main canvas via GPU (sub-millisecond drawImage)
      const sy = Math.floor(scrollY);
      const remainingH = texHeight - sy;

      if (remainingH >= height) {
        ctx.drawImage(offscreen, 0, sy, width, height, 0, 0, width, height);
      } else {
        // Tile wrap
        ctx.drawImage(offscreen, 0, sy, width, remainingH, 0, 0, width, remainingH);
        ctx.drawImage(offscreen, 0, 0, width, height - remainingH, 0, remainingH, width, height - remainingH);
      }

      // Calculate where the target is currently located on screen
      let currentScreenTargetY = (targetBaseY - sy);
      if (currentScreenTargetY < -60) currentScreenTargetY += texHeight;

      // 2. Render AI Detection HUD (when in 'detection' mode and target is visible)
      if (viewMode === 'detection' && currentScreenTargetY > -50 && currentScreenTargetY < height + 40) {
        const boxPad = 8;
        const boxX = targetX - boxPad;
        const boxY = currentScreenTargetY - boxPad;
        const boxW = targetW + shadowW + boxPad * 2;
        const boxH = targetH + boxPad * 2;

        // Bounding Box
        ctx.strokeStyle = '#3458d4';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Corner reticles
        const cornerLen = 10;
        ctx.strokeStyle = '#6a8aff';
        ctx.lineWidth = 2.5;

        // Top-Left
        ctx.beginPath();
        ctx.moveTo(boxX, boxY + cornerLen);
        ctx.lineTo(boxX, boxY);
        ctx.lineTo(boxX + cornerLen, boxY);
        ctx.stroke();

        // Top-Right
        ctx.beginPath();
        ctx.moveTo(boxX + boxW - cornerLen, boxY);
        ctx.lineTo(boxX + boxW, boxY);
        ctx.lineTo(boxX + boxW, boxY + cornerLen);
        ctx.stroke();

        // Bottom-Left
        ctx.beginPath();
        ctx.moveTo(boxX, boxY + boxH - cornerLen);
        ctx.lineTo(boxX, boxY + boxH);
        ctx.lineTo(boxX + cornerLen, boxY + boxH);
        ctx.stroke();

        // Bottom-Right
        ctx.beginPath();
        ctx.moveTo(boxX + boxW - cornerLen, boxY + boxH);
        ctx.lineTo(boxX + boxW, boxY + boxH);
        ctx.lineTo(boxX + boxW, boxY + boxH - cornerLen);
        ctx.stroke();

        // Pill Label
        ctx.fillStyle = '#3458d4';
        ctx.fillRect(boxX, boxY - 20, 172, 19);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px "DM Mono", monospace';
        ctx.fillText('YOLO26n · GHOST_NET: 95.4%', boxX + 6, boxY - 7);

        // Sub-HUD telemetry
        ctx.fillStyle = 'rgba(13, 17, 23, 0.92)';
        ctx.fillRect(boxX, boxY + boxH + 3, 188, 26);
        ctx.strokeStyle = '#2e3440';
        ctx.lineWidth = 1;
        ctx.strokeRect(boxX, boxY + boxH + 3, 188, 26);

        ctx.fillStyle = '#9eb4ff';
        ctx.font = '8px "DM Mono", monospace';
        ctx.fillText(`RANGE: ${telemetry.range}m · SHADOW_H: 1.4m`, boxX + 6, boxY + boxH + 14);
        ctx.fillText(`GEO: ${telemetry.lat}, ${telemetry.lon}`, boxX + 6, boxY + boxH + 24);
      }

      // 3. Grid & Nadir Overlays
      ctx.strokeStyle = 'rgba(209, 106, 69, 0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, height);
      ctx.stroke();

      // Range grid lines
      ctx.strokeStyle = 'rgba(52, 88, 212, 0.16)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(midX - 100, 0); ctx.lineTo(midX - 100, height);
      ctx.moveTo(midX - 200, 0); ctx.lineTo(midX - 200, height);
      ctx.moveTo(midX + 100, 0); ctx.lineTo(midX + 100, height);
      ctx.moveTo(midX + 200, 0); ctx.lineTo(midX + 200, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Top Nadir Pill
      ctx.fillStyle = '#1c2028';
      ctx.fillRect(midX - 58, 6, 116, 16);
      ctx.strokeStyle = '#d16a45';
      ctx.lineWidth = 1;
      ctx.strokeRect(midX - 58, 6, 116, 16);

      ctx.fillStyle = '#d16a45';
      ctx.font = '9px "DM Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('NADIR (WATER COLUMN)', midX, 18);

      // Channel Labels
      ctx.textAlign = 'left';
      ctx.fillStyle = '#838ea3';
      ctx.font = '9px "DM Mono", monospace';
      ctx.fillText('◀ PORT CHANNEL [-25.0m]', 12, 18);

      ctx.textAlign = 'right';
      ctx.fillText('STARBOARD CHANNEL [+25.0m] ▶', width - 12, 18);

      // Bottom Status Line
      ctx.textAlign = 'left';
      ctx.fillStyle = '#626a74';
      ctx.font = '8px "DM Mono", monospace';
      ctx.fillText(`SWATH: 50.0m · BEAM: 50° · AUV HEADING: 042° · PING: #${Math.floor(pingCounter)}`, 12, height - 8);

      ctx.textAlign = 'right';
      const modeNames = {
        raw: 'STREAM: RAW .XTF BACKSCATTER (UNFILTERED)',
        clahe: 'STREAM: LEE-DESPECKLED + CLAHE EQUALIZED',
        detection: 'STREAM: CASCADED AI (YOLO26n INT8 + ATTENTION U-NET)'
      };
      ctx.fillText(modeNames[viewMode] || '', width - 12, height - 8);

      // Ping Scanline Indicator
      if (simActive) {
        ctx.strokeStyle = viewMode === 'raw' ? 'rgba(255, 192, 96, 0.8)' : 'rgba(74, 114, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 2);
        ctx.lineTo(width, 2);
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [viewMode]); // Re-renders offscreen texture ONLY when viewMode changes!

  return (
    <div className="sonar-canvas-wrap">
      <canvas
        ref={canvasRef}
        className="sonar-waterfall-canvas"
        style={{
          width: '100%',
          height: '290px',
          display: 'block',
          borderRadius: '8px',
          background: '#0a0d12'
        }}
      />
    </div>
  );
}
