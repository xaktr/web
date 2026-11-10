import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, ArrowUpRight, Waves, Cpu, Layers, Eye,
  Activity, Terminal, Database, ShieldCheck, Compass,
  CheckCircle2, Sparkles, AlertCircle, Play, Pause, RotateCcw
} from 'lucide-react';
import './nemo.css';

export default function NemoPage({ onBack }) {
  const logoUrl = `${import.meta.env.BASE_URL}logo.svg`;
  const [simActive, setSimActive] = useState(true);
  const [pingCount, setPingCount] = useState(1482);
  const [currentRange, setCurrentRange] = useState(18.4);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!simActive) return;
    const interval = setInterval(() => {
      setPingCount((p) => p + 1);
      setCurrentRange((r) => +(18.0 + (Math.sin(Date.now() / 1500) * 1.5)).toFixed(1));
    }, 1200);
    return () => clearInterval(interval);
  }, [simActive]);

  return (
    <div className="nemo-page site-shell">
      <div className="grain" aria-hidden="true" />

      {/* Topbar */}
      <header className="nemo-topbar">
        <a href="#home" className="wordmark" onClick={onBack} aria-label="Back to portfolio">
          <img src={logoUrl} alt="AR" className="site-logo" />
        </a>

        <button className="nemo-back-btn" onClick={onBack}>
          <ArrowLeft size={15} />
          <span>BACK TO PORTFOLIO</span>
        </button>
      </header>

      <main className="section-wrap">
        {/* Project Hero */}
        <section className="nemo-hero">
          <div className="nemo-kicker-row">
            <span className="nemo-kicker">01 / PROJECT CASE STUDY · UNDERWATER SYSTEMS</span>
            <div className="nemo-badge">
              <span className="status-dot" />
              <span>ACTIVE RESEARCH & PROTOTYPE</span>
            </div>
          </div>

          <h1 className="nemo-title">
            NEMO: Acoustic Vision for <span>Seafloor Intelligence</span>.
          </h1>

          <p className="nemo-subtitle">
            An exploration into using high-frequency side-scan sonar (SSS) imagery and deep learning
            to automatically detect marine debris, pipeline damage, and submerged anomalies in low-visibility marine environments.
          </p>

          {/* Specs Grid */}
          <div className="nemo-specs-grid">
            <div className="nemo-spec-item">
              <span className="nemo-spec-label">DOMAIN</span>
              <span className="nemo-spec-value">Marine Robotics & Acoustics</span>
            </div>
            <div className="nemo-spec-item">
              <span className="nemo-spec-label">CORE STACK</span>
              <div className="nemo-spec-tags">
                <span className="nemo-tag">Python</span>
                <span className="nemo-tag">OpenCV</span>
                <span className="nemo-tag">PyTorch</span>
                <span className="nemo-tag">YOLOv8</span>
              </div>
            </div>
            <div className="nemo-spec-item">
              <span className="nemo-spec-label">SENSOR INPUT</span>
              <span className="nemo-spec-value">Side-Scan Sonar (SSS) Waterfall</span>
            </div>
            <div className="nemo-spec-item">
              <span className="nemo-spec-label">OBJECTIVE</span>
              <span className="nemo-spec-value">Autonomous Anomaly Detection</span>
            </div>
          </div>
        </section>

        {/* Live Acoustic Sonar Simulation Panel */}
        <section className="nemo-sonar-box" aria-label="Acoustic Sonar Visualizer">
          <div className="sonar-box-head">
            <div className="sonar-box-head-left">
              <div className="sonar-radar-dot" />
              <span>SSS WATERFALL ACOUSTIC TELEMETRY FEED (SIMULATED)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span>PING: #{pingCount}</span>
              <button
                onClick={() => setSimActive(!simActive)}
                style={{
                  background: 'transparent',
                  border: '1px solid #363d4e',
                  color: '#9eb4ff',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'inherit',
                  fontSize: '10px'
                }}
              >
                {simActive ? <Pause size={11} /> : <Play size={11} />}
                {simActive ? 'PAUSE' : 'RESUME'}
              </button>
            </div>
          </div>

          <div className="sonar-box-body">
            <div className="sonar-screen">
              <div className="sonar-swath-grid" />
              <div className="sonar-nadir-line" />
              <div className="sonar-nadir-label">NADIR GAP (BLIND ZONE)</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: '10px', color: '#687387' }}>
                <span>PORT CHANNEL [-25m]</span>
                <span>STARBOARD CHANNEL [+25m]</span>
              </div>

              {/* Detected Anomaly Bounding Box */}
              <div className="sonar-target-box">
                <span className="target-badge">TARGET DETECTED · ANOMALY_01</span>
                <div className="target-details">
                  <div>CLASS: SUBMERGED_DEBRIS</div>
                  <div>CONF: 94.6% · RANGE: {currentRange}m</div>
                  <div>GEO: 12°58'24"N, 80°15'09"E</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: '9px', color: '#525b6c' }}>
                <span>SWATH WIDTH: 50.0m</span>
                <span>STATUS: TRACKING NOMINAL</span>
              </div>
            </div>

            <div className="sonar-telemetry-row">
              <div className="telemetry-item">
                <span>FREQUENCY</span>
                <strong>455 kHz (High-Res)</strong>
              </div>
              <div className="telemetry-item">
                <span>SPEED OVER GROUND</span>
                <strong>3.4 knots</strong>
              </div>
              <div className="telemetry-item">
                <span>ALTITUDE (ALT)</span>
                <strong>6.8 m above seafloor</strong>
              </div>
              <div className="telemetry-item">
                <span>SIGNAL-TO-NOISE</span>
                <strong>18.2 dB</strong>
              </div>
              <div className="telemetry-item">
                <span>INFERENCE LATENCY</span>
                <strong>14.2 ms / frame</strong>
              </div>
            </div>
          </div>
        </section>

        {/* The Motivation & Scientific Context */}
        <section className="nemo-section">
          <div className="nemo-section-head">
            <span className="nemo-section-num">01 / BACKGROUND</span>
            <h2 className="nemo-section-title">The Problem With Looking Underwater</h2>
          </div>

          <div className="nemo-grid-two">
            <div className="nemo-prose">
              <p>
                In ocean exploration and underwater archaeology, standard optical cameras are virtually blind.
                Seawater rapidly absorbs and scatters red and green wavelengths, leaving zero optical visibility past
                a few meters in turbid or deep waters.
              </p>
              <p>
                To map the seafloor, vessels rely on <strong>Side-Scan Sonar (SSS)</strong>, emitting acoustic pulses
                and recording the amplitude of the echoes over time. While acoustic waves travel hundreds of meters through water,
                the resulting imagery is <strong>non-intuitive, heavily speckled, and distorted</strong> by slant-range geometry.
              </p>
            </div>

            <div className="nemo-highlight-card">
              <h4>The Core Insight</h4>
              <p>
                Unlike optical cameras where an object is identified by color, edges, and texture, sonar imagery identifies targets through
                <strong> Highlight & Shadow pairs</strong>. The physical object reflects sound (bright acoustic highlight),
                followed by a void where the acoustic beam was blocked (acoustic shadow). The length and geometry of that shadow encodes the exact 3D height profile of the submerged artifact.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Pipeline & Architecture */}
        <section className="nemo-section">
          <div className="nemo-section-head">
            <span className="nemo-section-num">02 / PIPELINE ARCHITECTURE</span>
            <h2 className="nemo-section-title">How the Detection Pipeline Works</h2>
          </div>

          <div className="pipeline-steps">
            <div className="pipeline-card">
              <span className="pipeline-card-num">STEP 01</span>
              <div className="pipeline-card-icon">
                <Waves size={20} />
              </div>
              <h3>Slant-Range Correction</h3>
              <p>
                Raw sonar records echo arrival times, producing distorted water-column blind zones (nadir).
                We project the time-series acoustic beam into true flat-bottom ground range coordinates.
              </p>
              <span className="pipeline-card-tech">Python · NumPy · Geometric Projection</span>
            </div>

            <div className="pipeline-card">
              <span className="pipeline-card-num">STEP 02</span>
              <div className="pipeline-card-icon">
                <Layers size={20} />
              </div>
              <h3>Speckle Noise Filtering</h3>
              <p>
                Coherent acoustic interference creates multiplicative speckle noise. We employ adaptive Lee
                and Frost spatial filtering to preserve sharp shadow boundaries while suppressing seafloor clutter.
              </p>
              <span className="pipeline-card-tech">OpenCV · Adaptive Spatial Kernels</span>
            </div>

            <div className="pipeline-card">
              <span className="pipeline-card-num">STEP 03</span>
              <div className="pipeline-card-icon">
                <Eye size={20} />
              </div>
              <h3>Acoustic Highlight & Shadow Detection</h3>
              <p>
                A tailored lightweight convolutional detector (YOLOv8 backbone with custom attention heads)
                identifies target candidate anchors by jointly coupling highlight and acoustic shadow signatures.
              </p>
              <span className="pipeline-card-tech">PyTorch · YOLOv8 · Transfer Learning</span>
            </div>

            <div className="pipeline-card">
              <span className="pipeline-card-num">STEP 04</span>
              <div className="pipeline-card-icon">
                <Compass size={20} />
              </div>
              <h3>Geospatial Fusion</h3>
              <p>
                Detected pixel bounding boxes are fused with real-time GPS / Inertial Navigation System (INS)
                telemetry to output exportable, geo-referenced GeoJSON points for survey analysts.
              </p>
              <span className="pipeline-card-tech">GeoJSON · WGS84 Coordinate Conversion</span>
            </div>
          </div>
        </section>

        {/* Challenges & Key Discoveries */}
        <section className="nemo-section">
          <div className="nemo-section-head">
            <span className="nemo-section-num">03 / TECHNICAL CHALLENGES</span>
            <h2 className="nemo-section-title">What Makes Underwater CV Hard</h2>
          </div>

          <div className="challenges-list">
            <div className="challenge-row">
              <div className="challenge-label">
                <AlertCircle size={18} color="#d16a45" />
                <span>Severe Data Scarcity</span>
              </div>
              <div className="challenge-text">
                Annotated public datasets for seafloor side-scan sonar are scarce. To prevent overfitting, we generated synthetic sonar data using Blender acoustic shader pipelines and simulated reverberation noise.
              </div>
            </div>

            <div className="challenge-row">
              <div className="challenge-label">
                <AlertCircle size={18} color="#d16a45" />
                <span>Grazing Angle Variance</span>
              </div>
              <div className="challenge-text">
                As the sonar towfish rolls and heaves with ocean swells, acoustic illumination intensity fluctuates dynamically across the swath. We implemented adaptive histogram equalization (CLAHE) along the range axis to stabilize brightness.
              </div>
            </div>

            <div className="challenge-row">
              <div className="challenge-label">
                <AlertCircle size={18} color="#d16a45" />
                <span>Edge Compute Bounds</span>
              </div>
              <div className="challenge-text">
                Autonomous Underwater Vehicles (AUVs) have constrained battery budgets and thermal limits. Models are quantized to FP16 and INT8 using TensorRT to maintain &gt;30 FPS on embedded edge chips (NVIDIA Jetson).
              </div>
            </div>
          </div>
        </section>

        {/* Project Next Steps & Back Button */}
        <section className="nemo-section" style={{ borderBottom: 'none' }}>
          <div className="nemo-footer-cta">
            <h3>Interested in this research?</h3>
            <p>
              NEMO is an active, evolving project exploring the intersection of acoustics, computer vision,
              and ocean technology. Feel free to reach out if you'd like to collaborate, test datasets, or discuss ideas.
            </p>
            <div className="nemo-cta-btns">
              <button className="button button-light" onClick={onBack}>
                <ArrowLeft size={16} /> Return to Portfolio
              </button>
              <a className="button" style={{ border: '1px solid var(--line)', background: '#fbf9f3' }} href="mailto:rajankit.ap@gmail.com">
                Discuss Project <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
