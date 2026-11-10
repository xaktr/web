import React, { useEffect, useRef, useState } from 'react';

/**
 * AcousticWaterfall: High-fidelity Side-Scan Sonar (SSS) Waterfall Canvas Simulator
 * Simulates raw .XTF acoustic ping ingestion, CLAHE contrast enhancement,
 * and cascaded YOLO26n + Attention U-Net target detection on edge hardware.
 */
export default function SonarWaterfall({ viewMode = 'detection', simActive = true, onPingUpdate }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef({
    offset: 0,
    targetY: 120, // initial Y position of the target
    lastTime: performance.now(),
    ping: 1482
  });

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
    const ctx = canvas.getContext('2d');

    const width = 800;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    // Pre-generate pseudo-random acoustic texture seed to keep rendering fast & stable
    const textureHeight = height * 2;
    const noiseBuffer = new Uint8Array(width * textureHeight);
    for (let i = 0; i < noiseBuffer.length; i++) {
      noiseBuffer[i] = Math.floor(Math.random() * 256);
    }

    let isRunning = true;

    const render = (time) => {
      if (!isRunning) return;

      const state = stateRef.current;
      const dt = (time - state.lastTime) / 1000;
      state.lastTime = time;

      // Scroll speed: 45 pixels per second when active
      if (simActive) {
        state.offset = (state.offset + dt * 48) % height;
        state.targetY = (state.targetY + dt * 48) % (height + 120);
        state.ping += dt * 15; // 15 Hz ping rate

        // Periodic telemetry drift
        if (Math.random() < 0.05) {
          const p = Math.floor(state.ping);
          const r = +(18.0 + Math.sin(time / 1400) * 1.6).toFixed(1);
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

      // Clear Canvas
      ctx.fillStyle = '#0a0d12';
      ctx.fillRect(0, 0, width, height);

      const midX = width / 2;
      const nadirWidth = 44; // Central water column blind zone
      const portWidth = midX - nadirWidth / 2;
      const starboardStart = midX + nadirWidth / 2;

      // 1. Draw Acoustic Swath Background (Port & Starboard)
      // Different color palettes per mode:
      // - raw: noisy sepia/amber acoustic palette
      // - clahe: high-contrast blue-gray acoustic palette
      // - detection: crisp high-res tactical palette with AI overlay
      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;

      const offsetFloor = Math.floor(state.offset);

      for (let y = 0; y < height; y++) {
        const noiseY = (y + offsetFloor) % textureHeight;
        const pingNoiseIdx = noiseY * width;

        for (let x = 0; x < width; x++) {
          const pixelIdx = (y * width + x) * 4;

          // Check if inside Nadir gap (Water column blind zone)
          const distFromCenter = Math.abs(x - midX);
          if (distFromCenter < nadirWidth / 2) {
            // Dark water column with subtle faint reverberation
            const nVal = noiseBuffer[pingNoiseIdx + x] * 0.08;
            data[pixelIdx] = 10 + nVal;
            data[pixelIdx + 1] = 14 + nVal;
            data[pixelIdx + 2] = 20 + nVal;
            data[pixelIdx + 3] = 255;
            continue;
          }

          // Relative range along the swath (0 at nadir edge, 1 at swath boundary)
          const swathRange = (distFromCenter - nadirWidth / 2) / portWidth;
          
          // Grazing angle falloff + seabed sand ripples
          const falloff = Math.max(0.2, 1.0 - Math.pow(swathRange, 1.4) * 0.65);
          const ripple = Math.sin((x * 0.08) + (y * 0.04) + Math.sin(x * 0.015) * 3) * 18;
          const rawNoise = noiseBuffer[pingNoiseIdx + x];

          let intensity = 0;

          if (viewMode === 'raw') {
            // RAW XTF: High speckle noise, lower SNR
            intensity = (rawNoise * 0.65 + ripple) * falloff;
            // Amber/Copper acoustic phosphor colormap
            data[pixelIdx] = Math.min(255, intensity * 0.95);     // R
            data[pixelIdx + 1] = Math.min(255, intensity * 0.75); // G
            data[pixelIdx + 2] = Math.min(255, intensity * 0.42); // B
          } else if (viewMode === 'clahe') {
            // CLAHE: Lee-despeckled + contrast equalization
            const smoothed = (rawNoise * 0.35 + 80 + ripple * 1.5) * falloff;
            intensity = Math.min(255, Math.pow(smoothed / 255, 0.75) * 270);
            // Crisp cyan-gray acoustic colormap
            data[pixelIdx] = Math.min(255, intensity * 0.6);
            data[pixelIdx + 1] = Math.min(255, intensity * 0.75);
            data[pixelIdx + 2] = Math.min(255, intensity * 0.95);
          } else {
            // CASCADED AI Mode: High-contrast cobalt marine colormap
            const smoothed = (rawNoise * 0.4 + 75 + ripple * 1.2) * falloff;
            intensity = Math.min(255, Math.pow(smoothed / 255, 0.8) * 260);
            data[pixelIdx] = Math.min(255, intensity * 0.55);
            data[pixelIdx + 1] = Math.min(255, intensity * 0.72);
            data[pixelIdx + 2] = Math.min(255, intensity * 0.98);
          }

          data[pixelIdx + 3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // 2. Render Target Anomaly (Acoustic Highlight + Shadow)
      const targetScreenY = state.targetY - 40;
      const targetX = midX + 160; // In Starboard swath (~18m range)
      const targetW = 38;
      const targetH = 26;
      const shadowW = 75; // Acoustic shadow extends outward from acoustic beam

      if (targetScreenY > -60 && targetScreenY < height + 40) {
        // A) Acoustic Shadow (Sound blocked by object, completely dark on seabed)
        ctx.fillStyle = 'rgba(4, 6, 9, 0.94)';
        ctx.beginPath();
        ctx.moveTo(targetX + targetW, targetScreenY);
        ctx.lineTo(targetX + targetW + shadowW, targetScreenY - 4);
        ctx.lineTo(targetX + targetW + shadowW + 8, targetScreenY + targetH + 8);
        ctx.lineTo(targetX + targetW, targetScreenY + targetH);
        ctx.closePath();
        ctx.fill();

        // Highlight/Shadow boundary indicator in AI detection mode
        if (viewMode === 'detection') {
          ctx.strokeStyle = 'rgba(116, 123, 131, 0.8)';
          ctx.setLineDash([3, 3]);
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // B) Acoustic Highlight (Strong backscatter reflection off object)
        const highlightGrad = ctx.createLinearGradient(targetX, targetScreenY, targetX + targetW, targetScreenY);
        if (viewMode === 'raw') {
          highlightGrad.addColorStop(0, '#ffe0a0');
          highlightGrad.addColorStop(1, '#ffc060');
        } else {
          highlightGrad.addColorStop(0, '#ffffff');
          highlightGrad.addColorStop(1, '#9eb4ff');
        }

        ctx.fillStyle = highlightGrad;
        ctx.beginPath();
        ctx.roundRect(targetX, targetScreenY, targetW, targetH, 4);
        ctx.fill();

        // Ghost net texture lines
        ctx.strokeStyle = 'rgba(20, 30, 50, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(targetX + 6, targetScreenY + 4);
        ctx.lineTo(targetX + targetW - 6, targetScreenY + targetH - 4);
        ctx.moveTo(targetX + targetW - 6, targetScreenY + 4);
        ctx.lineTo(targetX + 6, targetScreenY + targetH - 4);
        ctx.stroke();

        // 3. AI Detection Overlay (When in CASCADED AI Mode)
        if (viewMode === 'detection') {
          const boxPad = 8;
          const boxX = targetX - boxPad;
          const boxY = targetScreenY - boxPad;
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

          // Target Label Pill
          ctx.fillStyle = '#3458d4';
          ctx.fillRect(boxX, boxY - 20, 168, 19);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px "DM Mono", monospace';
          ctx.fillText('YOLO26n · GHOST_NET: 95.4%', boxX + 6, boxY - 7);

          // Secondary Telemetry Label
          ctx.fillStyle = 'rgba(13, 17, 23, 0.9)';
          ctx.fillRect(boxX, boxY + boxH + 3, 185, 26);
          ctx.strokeStyle = '#2e3440';
          ctx.lineWidth = 1;
          ctx.strokeRect(boxX, boxY + boxH + 3, 185, 26);

          ctx.fillStyle = '#9eb4ff';
          ctx.font = '8px "DM Mono", monospace';
          ctx.fillText(`RANGE: ${telemetry.range}m · SHADOW_H: 1.4m`, boxX + 6, boxY + boxH + 14);
          ctx.fillText(`GEO: ${telemetry.lat}, ${telemetry.lon}`, boxX + 6, boxY + boxH + 24);
        }
      }

      // 4. Draw Nadir Line & Swath Grid Overlays
      // Nadir center line
      ctx.strokeStyle = 'rgba(209, 106, 69, 0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, height);
      ctx.stroke();

      // Range grid lines (every 10 meters)
      ctx.strokeStyle = 'rgba(52, 88, 212, 0.15)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;

      // Port side markers
      ctx.beginPath();
      ctx.moveTo(midX - 100, 0); ctx.lineTo(midX - 100, height);
      ctx.moveTo(midX - 200, 0); ctx.lineTo(midX - 200, height);
      ctx.moveTo(midX - 300, 0); ctx.lineTo(midX - 300, height);
      // Starboard markers
      ctx.moveTo(midX + 100, 0); ctx.lineTo(midX + 100, height);
      ctx.moveTo(midX + 200, 0); ctx.lineTo(midX + 200, height);
      ctx.moveTo(midX + 300, 0); ctx.lineTo(midX + 300, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Top Nadir Label
      ctx.fillStyle = '#1c2028';
      ctx.fillRect(midX - 58, 6, 116, 16);
      ctx.strokeStyle = '#d16a45';
      ctx.lineWidth = 1;
      ctx.strokeRect(midX - 58, 6, 116, 16);

      ctx.fillStyle = '#d16a45';
      ctx.font = '9px "DM Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('NADIR (WATER COLUMN)', midX, 18);

      // Channel Headers
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
      ctx.fillText(`SWATH: 50.0m · BEAM: 50° · AUV HEADING: 042° · PING: #${Math.floor(state.ping)}`, 12, height - 8);

      ctx.textAlign = 'right';
      const modeNames = {
        raw: 'STREAM: RAW .XTF BACKSCATTER (UNFILTERED)',
        clahe: 'STREAM: LEE-DESPECKLED + CLAHE EQUALIZED',
        detection: 'STREAM: CASCADED AI (YOLO26n INT8 + ATTENTION U-NET)'
      };
      ctx.fillText(modeNames[viewMode] || '', width - 12, height - 8);

      // Water flow ping scanline at top
      if (simActive) {
        ctx.strokeStyle = viewMode === 'raw' ? 'rgba(255, 192, 96, 0.7)' : 'rgba(74, 114, 255, 0.85)';
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
  }, [viewMode, simActive, onPingUpdate]);

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

