import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, ArrowUpRight, Waves, Cpu, Layers, Eye,
  Activity, Terminal, Database, ShieldCheck, Compass,
  CheckCircle2, Sparkles, AlertCircle, Play, Pause,
  Radar, Anchor, MapPin, HardDrive, Zap, BookOpen, ExternalLink
} from 'lucide-react';
import './nemo.css';
import SonarWaterfall from './SonarWaterfall';

export default function NemoPage({ onBack }) {
  const logoUrl = `${import.meta.env.BASE_URL}logo.svg`;
  const [simActive, setSimActive] = useState(true);
  const [pingCount, setPingCount] = useState(1482);
  const [currentRange, setCurrentRange] = useState(18.4);
  const [viewMode, setViewMode] = useState('detection'); // 'raw', 'clahe', 'detection'

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
        {/* Project Hero Header */}
        <section className="nemo-hero">
          <div className="nemo-kicker-row">
            <div className="sih-badge">
              <span>SMART INDIA HACKATHON 2026</span>
              <span>·</span>
              <span>PS: <b>SIH26057</b></span>
              <span>·</span>
              <span>TEAM: <b>Davy.json</b></span>
            </div>

            <div className="nemo-badge">
              <span className="status-dot" />
              <span>THEME: DISASTER MANAGEMENT</span>
            </div>
          </div>

          <h1 className="nemo-title">
            NEMO: <span>Nautical Environment Mapping</span> and Object Detection.
          </h1>

          <span className="nemo-acronym">
            AI-Powered Automated Underwater Marine Debris & Anomaly Detection System using Side-Scan Sonar Imagery
          </span>

          <p className="nemo-subtitle">
            An end-to-end edge AI vision system engineered to process raw acoustic waterfall streams
            from Autonomous Underwater Vehicles (AUVs), replacing slow manual sonar review with real-time,
            physics-informed debris localization and georeferenced anomaly mapping.
          </p>

          {/* KPI Strip */}
          <div className="kpi-strip">
            <div className="kpi-card">
              <span className="kpi-num">~10x</span>
              <span className="kpi-label">SURVEY SPEEDUP</span>
              <span className="kpi-sub">From ~5 km/hr manual review to 50+ km/hr AI throughput</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-num">50+ FPS</span>
              <span className="kpi-label">REAL-TIME INFERENCE</span>
              <span className="kpi-sub">Continuous acoustic stream analysis on NVIDIA Jetson</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-num">&lt;10 MB</span>
              <span className="kpi-label">MODEL FOOTPRINT</span>
              <span className="kpi-sub">INT8 quantized weights optimized for edge AUV deployments</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-num">60–70%</span>
              <span className="kpi-label">COST REDUCTION</span>
              <span className="kpi-sub">Cuts vessel-days and manual acoustic analyst labor</span>
            </div>
          </div>

          {/* Technical Specs Bar */}
          <div className="nemo-specs-grid">
            <div className="nemo-spec-item">
              <span className="nemo-spec-label">EDGE PLATFORM</span>
              <span className="nemo-spec-value">NVIDIA Jetson Orin Nano (15W)</span>
            </div>
            <div className="nemo-spec-item">
              <span className="nemo-spec-label">CORE AI MODELS</span>
              <div className="nemo-spec-tags">
                <span className="nemo-tag">YOLO26n INT8</span>
                <span className="nemo-tag">Attention U-Net</span>
                <span className="nemo-tag">CycleGAN</span>
              </div>
            </div>
            <div className="nemo-spec-item">
              <span className="nemo-spec-label">SONAR FORMAT</span>
              <span className="nemo-spec-value">.XTF (eXtended Triton Format)</span>
            </div>
            <div className="nemo-spec-item">
              <span className="nemo-spec-label">ACCELERATION</span>
              <span className="nemo-spec-value">TensorRT & ONNX Runtime</span>
            </div>
          </div>
        </section>

        {/* Live Acoustic Sonar Simulation Panel */}
        <section className="nemo-sonar-box" aria-label="Acoustic Sonar Visualizer">
          <div className="sonar-box-head">
            <div className="sonar-box-head-left">
              <div className="sonar-radar-dot" />
              <span>SSS WATERFALL ACOUSTIC TELEMETRY FEED (SIMULATED .XTF INGESTION)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div className="sonar-view-modes">
                <button
                  className={`sonar-mode-btn ${viewMode === 'raw' ? 'active' : ''}`}
                  onClick={() => setViewMode('raw')}
                >
                  RAW XTF
                </button>
                <button
                  className={`sonar-mode-btn ${viewMode === 'clahe' ? 'active' : ''}`}
                  onClick={() => setViewMode('clahe')}
                >
                  CLAHE FILTERED
                </button>
                <button
                  className={`sonar-mode-btn ${viewMode === 'detection' ? 'active' : ''}`}
                  onClick={() => setViewMode('detection')}
                >
                  CASCADED AI (YOLO26n + U-NET)
                </button>
              </div>

              <span>PING: #{pingCount}</span>

              <button
                onClick={() => setSimActive(!simActive)}
                style={{
                  background: 'transparent',
                  border: '1px solid #363d4e',
                  color: '#9eb4ff',
                  borderRadius: '4px',
                  padding: '4px 10px',
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
            <SonarWaterfall
              viewMode={viewMode}
              simActive={simActive}
              onPingUpdate={(p, r) => {
                setPingCount(p);
                setCurrentRange(r);
              }}
            />

            {/* Telemetry Row */}
            <div className="sonar-telemetry-row">
              <div className="telemetry-item">
                <span>ACOUSTIC FREQUENCY</span>
                <strong>455 kHz (High-Res SSS)</strong>
              </div>
              <div className="telemetry-item">
                <span>SPEED OVER GROUND</span>
                <strong>3.4 knots (AUV Nominal)</strong>
              </div>
              <div className="telemetry-item">
                <span>ALTITUDE (ALT)</span>
                <strong>6.8 m above seafloor</strong>
              </div>
              <div className="telemetry-item">
                <span>SIGNAL-TO-NOISE RATIO</span>
                <strong>18.2 dB (Lee Filtered)</strong>
              </div>
              <div className="telemetry-item">
                <span>EDGE INFERENCE LATENCY</span>
                <strong>14.2 ms (TensorRT INT8)</strong>
              </div>
              <div className="telemetry-item">
                <span>POWER DRAW</span>
                <strong>11.4 W / 15 W Budget</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Core Innovations */}
        <section className="nemo-section">
          <div className="nemo-section-head">
            <span className="nemo-section-num">01 / INNOVATIONS & UNIQUENESS</span>
            <h2 className="nemo-section-title">What Sets NEMO Apart</h2>
          </div>

          <div className="innovations-grid">
            <div className="innovation-card">
              <span className="innovation-badge">CASCADED AI ARCHITECTURE</span>
              <h3>Detect → Segment Pipeline</h3>
              <p>
                Instead of running a heavy segmentation network on the entire high-resolution sonar swath,
                NEMO uses a fast, NMS-free <strong>YOLO26n INT8</strong> detector to generate candidate proposals,
                followed by <strong>Attention U-Net INT8</strong> on cropped regions for pixel-level boundary extraction.
              </p>
            </div>

            <div className="innovation-card">
              <span className="innovation-badge">ACOUSTIC PHYSICS MODELING</span>
              <h3>Shadow-as-a-Feature</h3>
              <p>
                In side-scan sonar, the shadow behind an object contains more geometric fidelity than the highlight itself.
                NEMO treats acoustic shadows as primary diagnostic signal rather than noise, calculating target height
                profile from sonar beam geometry to reject non-shadow seabed clutter.
              </p>
            </div>

            <div className="innovation-card">
              <span className="innovation-badge">GENERATIVE AUGMENTATION</span>
              <h3>CycleGAN Synthetic Training</h3>
              <p>
                To overcome extreme scarcity of annotated underwater sonar datasets, NEMO employs CycleGAN to translate
                optical debris masks into realistic side-scan sonar acoustic textures with simulated speckle and grazing attenuation.
              </p>
            </div>

            <div className="innovation-card">
              <span className="innovation-badge">EDGE-FIRST DEPLOYMENT</span>
              <h3>INT8 Quantized &lt;10MB Footprint</h3>
              <p>
                Export-optimized via TensorRT and ONNX Runtime for deployment on <strong>NVIDIA Jetson Orin Nano</strong>.
                Runs 100% offline at 50+ FPS with zero internet dependency inside an AUV's 7W–15W power envelope.
              </p>
            </div>
          </div>
        </section>

        {/* 6-Stage Technical Pipeline */}
        <section className="nemo-section">
          <div className="nemo-section-head">
            <span className="nemo-section-num">02 / END-TO-END PIPELINE</span>
            <h2 className="nemo-section-title">The Complete System Architecture</h2>
          </div>

          <div className="pipeline-grid">
            <div className="pipeline-card">
              <span className="pipeline-card-num">STAGE 01</span>
              <div className="pipeline-card-icon">
                <Database size={20} />
              </div>
              <h3>Data Ingestion & Parsing</h3>
              <p>
                Reads raw sonar files in <strong>.XTF (eXtended Triton Format)</strong> and extracts ping-header navigation data
                (AUV altitude, heading, heave, pitch, and roll) using <code>pyxtf</code>.
              </p>
              <span className="pipeline-card-tech">pyxtf · .XTF Metadata Parsing</span>
            </div>

            <div className="pipeline-card">
              <span className="pipeline-card-num">STAGE 02</span>
              <div className="pipeline-card-icon">
                <Waves size={20} />
              </div>
              <h3>Sonar Pre-Processing</h3>
              <p>
                Suppresses coherent multiplicative acoustic speckle using <strong>Lee and Frost spatial filters</strong>.
                Applies Contrast Limited Adaptive Histogram Equalization (<strong>CLAHE</strong>) across range channels.
              </p>
              <span className="pipeline-card-tech">Lee/Frost Denoising · CLAHE</span>
            </div>

            <div className="pipeline-card">
              <span className="pipeline-card-num">STAGE 03</span>
              <div className="pipeline-card-icon">
                <Cpu size={20} />
              </div>
              <h3>Edge AI Processing</h3>
              <p>
                Cascaded neural inference: NMS-free <strong>YOLO26n INT8</strong> detects bounding boxes, passing cropped
                regions to <strong>Attention U-Net INT8</strong> for precise mask extraction on the edge.
              </p>
              <span className="pipeline-card-tech">YOLO26n · Attention U-Net · TensorRT</span>
            </div>

            <div className="pipeline-card">
              <span className="pipeline-card-num">STAGE 04</span>
              <div className="pipeline-card-icon">
                <Compass size={20} />
              </div>
              <h3>Post-Processing & Filtering</h3>
              <p>
                Corrects slant-range geometric distortions (hypotenuse-to-ground projection).
                Computes physics-informed confidence scoring from highlight-to-shadow ratios, and georeferences coordinates using <code>pyproj</code>.
              </p>
              <span className="pipeline-card-tech">Slant-Range Math · pyproj (WGS84)</span>
            </div>

            <div className="pipeline-card">
              <span className="pipeline-card-num">STAGE 05</span>
              <div className="pipeline-card-icon">
                <HardDrive size={20} />
              </div>
              <h3>Data Reporting & Integration</h3>
              <p>
                Packages georeferenced anomaly locations, physical volume estimates, and confidence scores into structured
                standardized <strong>JSON and CSV reports</strong> ready for export to GIS systems.
              </p>
              <span className="pipeline-card-tech">pandas · NumPy · GeoJSON</span>
            </div>

            <div className="pipeline-card">
              <span className="pipeline-card-num">STAGE 06</span>
              <div className="pipeline-card-icon">
                <Activity size={20} />
              </div>
              <h3>Dashboard & Live Telemetry</h3>
              <p>
                Full-stack monitoring interface built with <strong>FastAPI</strong> and <strong>WebSockets</strong> for real-time
                data streaming, accompanied by an interactive <strong>React.js + Leaflet.js</strong> map dashboard.
              </p>
              <span className="pipeline-card-tech">FastAPI · WebSockets · React · Leaflet</span>
            </div>
          </div>
        </section>

        {/* Feasibility & Hardware Matrix */}
        <section className="nemo-section">
          <div className="nemo-section-head">
            <span className="nemo-section-num">03 / FEASIBILITY & DEPLOYMENT</span>
            <h2 className="nemo-section-title">Unified Feasibility Matrix</h2>
          </div>

          <div className="feasibility-grid">
            <div className="feasibility-card">
              <h3><Zap size={18} color="#3458d4" /> Technical Viability</h3>
              <ul className="feasibility-list">
                <li><CheckCircle2 size={15} /> <strong>Two-Stage AI Pipeline:</strong> Fast candidate filtering ensures zero dropped pings during high-speed survey.</li>
                <li><CheckCircle2 size={15} /> <strong>Denoising & Contrast:</strong> Proven Lee/Frost filtering retains acoustic shadow edges critical for morphology.</li>
                <li><CheckCircle2 size={15} /> <strong>NMS-Free YOLO26n:</strong> Eliminates non-maximum suppression latency bottlenecks on edge hardware.</li>
              </ul>
            </div>

            <div className="feasibility-card">
              <h3><Cpu size={18} color="#3458d4" /> Hardware Deployment</h3>
              <ul className="feasibility-list">
                <li><CheckCircle2 size={15} /> <strong>Low-Power Budget:</strong> 7W – 15W operational envelope matches autonomous AUV battery constraints.</li>
                <li><CheckCircle2 size={15} /> <strong>40 TOPS Compute:</strong> Powered by NVIDIA Jetson Orin Nano for continuous 50+ FPS video-rate sonar streams.</li>
                <li><CheckCircle2 size={15} /> <strong>Zero Internet Dependency:</strong> Operates 100% offline underwater without tether or cloud access.</li>
              </ul>
            </div>

            <div className="feasibility-card">
              <h3><Anchor size={18} color="#3458d4" /> Operational Scalability</h3>
              <ul className="feasibility-list">
                <li><CheckCircle2 size={15} /> <strong>100% Autonomous:</strong> Performs real-time anomaly logging directly onboard the underwater vehicle.</li>
                <li><CheckCircle2 size={15} /> <strong>Multi-AUV Fleets:</strong> Standardized JSON schema allows multi-vehicle swarm survey aggregation.</li>
                <li><CheckCircle2 size={15} /> <strong>Docking Synchronization:</strong> Automatically offloads mission logs and georeferenced maps upon vessel docking.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Risks, Challenges & Visual Mitigations */}
        <section className="nemo-section">
          <div className="nemo-section-head">
            <span className="nemo-section-num">04 / RISKS & MITIGATIONS</span>
            <h2 className="nemo-section-title">Navigating Real-World Acoustic Challenges</h2>
          </div>

          <div className="mitigation-table">
            <div className="mitigation-row">
              <div className="mitigation-risk">
                <AlertCircle size={16} color="#d16a45" />
                <span>1. Scarce Sonar Data</span>
              </div>
              <div className="mitigation-desc">
                Public annotated side-scan sonar datasets for ghost nets and debris are exceptionally rare.
              </div>
              <div className="mitigation-solution">
                <strong>CycleGAN Generative Modeling:</strong> Translates abundant optical debris masks into synthetic sonar training samples with realistic acoustic noise.
              </div>
            </div>

            <div className="mitigation-row">
              <div className="mitigation-risk">
                <AlertCircle size={16} color="#d16a45" />
                <span>2. Seafloor Clutter</span>
              </div>
              <div className="mitigation-desc">
                Natural rock piles, sand ripples, and benthic geological features mimic man-made debris signatures.
              </div>
              <div className="mitigation-solution">
                <strong>Acoustic Shadow Verification:</strong> Filters out non-shadow objects by verifying physical highlight-to-shadow geometric proportions based on sonar altitude.
              </div>
            </div>

            <div className="mitigation-row">
              <div className="mitigation-risk">
                <AlertCircle size={16} color="#d16a45" />
                <span>3. Motion & Severe Blur</span>
              </div>
              <div className="mitigation-desc">
                Ocean swells cause AUV heave, pitch, and roll, introducing heavy motion artifacts across waterfall pings.
              </div>
              <div className="mitigation-solution">
                <strong>Motion Compensation & Windowing:</strong> Fuses ping-header inertial telemetry with overlapping windowing to normalize attitude changes before inference.
              </div>
            </div>

            <div className="mitigation-row">
              <div className="mitigation-risk">
                <AlertCircle size={16} color="#d16a45" />
                <span>4. Large Files & No GPS</span>
              </div>
              <div className="mitigation-desc">
                500MB+ raw .XTF files and lack of GPS signals underwater create memory and localization bottlenecks.
              </div>
              <div className="mitigation-solution">
                <strong>Async Chunking & Pixel Tracking:</strong> Streams files in lightweight memory chunks while computing relative dead-reckoning pixel offsets.
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Impact & Stakeholders */}
        <section className="nemo-section">
          <div className="nemo-section-head">
            <span className="nemo-section-num">05 / IMPACT & BENEFITS</span>
            <h2 className="nemo-section-title">Who Benefits From NEMO</h2>
          </div>

          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-card-head">
                <Waves size={20} />
                <h4>Marine Conservation</h4>
              </div>
              <ul>
                <li>Cuts ghost fishing net survey times from days to hours.</li>
                <li>Prevents annual deaths of 100,000+ marine mammals entangled in abandoned nets.</li>
                <li>Halts microplastic shedding from decaying polypropylene ropes on reefs.</li>
              </ul>
            </div>

            <div className="impact-card">
              <div className="impact-card-head">
                <ShieldCheck size={20} />
                <h4>Coast Guards & Ports</h4>
              </div>
              <ul>
                <li>Rapid mapping of unexploded ordnance (UXO) and submerged hazards.</li>
                <li>Shipwreck clearance and navigation channel inspection in active harbor approaches.</li>
                <li>Pre-verified hazard coordinates significantly reduce risk for human dive teams.</li>
              </ul>
            </div>

            <div className="impact-card">
              <div className="impact-card-head">
                <Zap size={20} />
                <h4>Offshore Energy & Telecom</h4>
              </div>
              <ul>
                <li>Automated, repeatable inspection for subsea power cables and communication trunks.</li>
                <li>Replaces tedious manual frame-by-frame ROV video review with automated reports.</li>
                <li>Prevents costly anchor strikes and dredging damage in utility corridors.</li>
              </ul>
            </div>

            <div className="impact-card">
              <div className="impact-card-head">
                <Compass size={20} />
                <h4>AUV Manufacturers</h4>
              </div>
              <ul>
                <li>Plug-and-play, hardware-agnostic edge AI vision stack via ONNX and TensorRT.</li>
                <li>Adds real-time autonomous target recognition (ATR) to standard commercial sonar equipment.</li>
                <li>Low barrier to adoption for small research institutions and NGOs.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Research Foundations & References */}
        <section className="nemo-section">
          <div className="nemo-section-head">
            <span className="nemo-section-num">06 / RESEARCH FOUNDATIONS</span>
            <h2 className="nemo-section-title">Academic & Industry Literature</h2>
          </div>

          <div className="research-grid">
            <div className="research-card">
              <div className="research-author">Jocher et al. (2026)</div>
              <div className="research-paper">Ultralytics YOLO26: Unified Real-Time End-to-End Vision Models</div>
              <div className="research-takeaway">Single-stage, anchor-free, NMS-free architecture enabling high-framerate sonar stream detection on edge chips.</div>
            </div>

            <div className="research-card">
              <div className="research-author">Oktay et al. (2018)</div>
              <div className="research-paper">Attention U-Net: Learning Where to Look for the Pancreas</div>
              <div className="research-takeaway">Soft attention gates suppress noisy benthic clutter, isolating precise acoustic shadow contours for 3D volumetric estimation.</div>
            </div>

            <div className="research-card">
              <div className="research-author">Cui et al. (2025) & Zhou et al. (2024)</div>
              <div className="research-paper">Small-Object Detection & Multi-Scale Contrast Restoration in SSS</div>
              <div className="research-takeaway">Demonstrated mathematical enhancement of acoustic signal-to-noise ratio in low-contrast side-scan sonar waterfall imagery.</div>
            </div>

            <div className="research-card">
              <div className="research-author">Microsoft Research (2025)</div>
              <div className="research-paper">GhostNetZero: AI for Detecting Ghost Fishing Gear</div>
              <div className="research-takeaway">Benchmark datasets and evaluation protocols for identifying synthetic derelict gear from benthic sonar backscatter.</div>
            </div>

            <div className="research-card">
              <div className="research-author">GEOMAR (2021)</div>
              <div className="research-paper">GHOSTNETBUSTERS: Field Validation of SSS on Benthic Debris</div>
              <div className="research-takeaway">Real-world operational methodology for validating acoustic detection of marine debris in Baltic Sea sea trials.</div>
            </div>
          </div>
        </section>

        {/* Project Call to Action & Return */}
        <section className="nemo-section" style={{ borderBottom: 'none' }}>
          <div className="nemo-footer-cta">
            <h3>NEMO · Smart India Hackathon 2026</h3>
            <p>
              Developed by <strong>Team Davy.json</strong> for Problem Statement <strong>SIH26057</strong> (Disaster Management).
              Built with curiosity, rigorous acoustic physics, and edge-first AI.
            </p>
            <div className="nemo-cta-btns">
              <button className="button button-light" onClick={onBack}>
                <ArrowLeft size={16} /> Return to Portfolio
              </button>
              <a className="button" style={{ border: '1px solid var(--line)', background: '#fbf9f3' }} href="mailto:rajankit.ap@gmail.com">
                Discuss Project / Collaboration <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
