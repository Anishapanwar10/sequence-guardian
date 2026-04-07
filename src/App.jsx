import { useState, useEffect, useRef, useCallback } from "react";

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Exo+2:wght@300;400;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    :root{
      --navy:#050d1f;--navy2:#0a1628;--navy3:#0f1f3d;--navy4:#162544;
      --red:#ff2d55;--red-dim:#4d0e1a;--red-glow:rgba(255,45,85,0.4);
      --amber:#ffb800;--amber-dim:#3d2c00;--amber-glow:rgba(255,184,0,0.35);
      --blue:#00c8ff;--blue-dim:#003d4d;--blue-glow:rgba(0,200,255,0.35);
      --green:#00ff88;--green-dim:#003320;--green-glow:rgba(0,255,136,0.3);
      --purple:#a855f7;
      --text:#e8f0fe;--text-dim:#8899bb;--text-muted:#4a5a7a;
      --border:#1e3060;--border-bright:#2a4080;
      --font-head:'Orbitron',monospace;
      --font-mono:'Share Tech Mono',monospace;
      --font-body:'Exo 2',sans-serif;
    }
    body{background:var(--navy);color:var(--text);font-family:var(--font-body);overflow-x:hidden}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:var(--navy2)}
    ::-webkit-scrollbar-thumb{background:var(--border-bright);border-radius:2px}
    @keyframes pulse-red{0%,100%{box-shadow:0 0 8px var(--red-glow),0 0 20px var(--red-glow),inset 0 0 8px rgba(255,45,85,0.1)}50%{box-shadow:0 0 20px var(--red-glow),0 0 50px var(--red-glow),inset 0 0 15px rgba(255,45,85,0.2)}}
    @keyframes pulse-amber{0%,100%{box-shadow:0 0 8px var(--amber-glow),0 0 20px var(--amber-glow)}50%{box-shadow:0 0 20px var(--amber-glow),0 0 45px var(--amber-glow)}}
    @keyframes shimmer-blue{0%,100%{box-shadow:0 0 8px var(--blue-glow),0 0 20px var(--blue-glow)}50%{box-shadow:0 0 20px var(--blue-glow),0 0 40px var(--blue-glow)}}
    @keyframes glow-green{0%,100%{box-shadow:0 0 5px var(--green-glow)}50%{box-shadow:0 0 15px var(--green-glow)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
    @keyframes scoreFlash{0%{transform:scale(1)}30%{transform:scale(1.5)}100%{transform:scale(1);opacity:0}}
    @keyframes modalIn{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
    @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes critFlash{0%,100%{background:rgba(255,45,85,0.06)}50%{background:rgba(255,45,85,0.15)}}
    @keyframes healthPulse{0%,100%{opacity:1}50%{opacity:0.7}}
    @keyframes slaBreach{0%,100%{box-shadow:0 0 15px var(--red);border-color:var(--red)}50%{box-shadow:0 0 30px var(--red-glow);border-color:var(--red-dim)}}
    @keyframes glitch{0%{transform:translate(0)}20%{transform:translate(-2px,2px)}40%{transform:translate(-2px,-2px)}60%{transform:translate(2px,2px)}80%{transform:translate(2px,-2px)}100%{transform:translate(0)}}
  `}</style>
);

const today = new Date("2025-03-11");
const daysAgo = (d) => new Date(today.getTime() - d * 86400000);
const fmt = (n) => Math.round(n).toLocaleString();
const fmtD = (n) => n < 1 ? `${(n * 24).toFixed(1)}h` : `${n.toFixed(1)}d`;

const INIT_SEQS = [
  {id:"DHL-SEQ-001",carrier:"DHL Express",startNo:1000000,endNo:1500000,currentVal:1487000,startDate:new Date("2025-01-15"),source:"SQL",backupStart:1500001,backupEnd:2000000,isRotation:false,rotationDays:null,lastRotation:null,remarks:"",codecar:"DHL01",codesen:"SEN01",accountNo:"ACC-DHL-001",senderName:"Zara Retail GmbH",contactStatus:"VALID",contactEmail:"k.muller@dhl.com",contactName:"Klaus Müller",spikeActive:true},
  {id:"DHL-SEQ-002",carrier:"DHL Express",startNo:2000000,endNo:3000000,currentVal:2150000,startDate:new Date("2025-01-25"),source:"BigQuery",backupStart:null,backupEnd:null,isRotation:false,rotationDays:null,lastRotation:null,remarks:"",codecar:"DHL02",codesen:"SEN07",accountNo:"ACC-DHL-002",senderName:"Siemens AG",contactStatus:"VALID",contactEmail:"k.muller@dhl.com",contactName:"Klaus Müller",spikeActive:false},
  {id:"FDX-SEQ-001",carrier:"FedEx",startNo:5000000,endNo:5300000,currentVal:5278000,startDate:new Date("2025-01-20"),source:"BigQuery",backupStart:null,backupEnd:null,isRotation:false,rotationDays:null,lastRotation:null,remarks:"",codecar:"FDX01",codesen:"SEN02",accountNo:"ACC-FDX-001",senderName:"Amazon EU Fulfillment",contactStatus:"INVALID",contactEmail:"INVALID_EMAIL_FORMAT",contactName:"James Carter",spikeActive:false},
  {id:"FDX-SEQ-002",carrier:"FedEx",startNo:6000000,endNo:7000000,currentVal:6320000,startDate:new Date("2025-02-04"),source:"SQL",backupStart:7000001,backupEnd:8000000,isRotation:false,rotationDays:null,lastRotation:null,remarks:"",codecar:"FDX02",codesen:"SEN08",accountNo:"ACC-FDX-002",senderName:"Apple Distribution",contactStatus:"VALID",contactEmail:"support@fedex.com",contactName:"Sarah Jenkins",spikeActive:false},
  {id:"UPS-SEQ-001",carrier:"UPS",startNo:8000000,endNo:8500000,currentVal:8430000,startDate:new Date("2025-01-18"),source:"SQL",backupStart:8500001,backupEnd:9000000,isRotation:false,rotationDays:null,lastRotation:null,remarks:"",codecar:"UPS01",codesen:"SEN03",accountNo:"ACC-UPS-001",senderName:"Adidas Group",contactStatus:"VALID",contactEmail:"t.weber@ups.com",contactName:"Thomas Weber",spikeActive:false},
  {id:"UPS-SEQ-002",carrier:"UPS",startNo:9000000,endNo:10000000,currentVal:9100000,startDate:new Date("2025-01-30"),source:"BigQuery",backupStart:null,backupEnd:null,isRotation:false,rotationDays:null,lastRotation:null,remarks:"",codecar:"UPS02",codesen:"SEN09",accountNo:"ACC-UPS-002",senderName:"Nike Logistics",contactStatus:"VALID",contactEmail:"ops@ups.com",contactName:"John Smith",spikeActive:false},
  {id:"TNT-SEQ-001",carrier:"TNT Express",startNo:11000000,endNo:11200000,currentVal:11165000,startDate:new Date("2025-01-23"),source:"BigQuery",backupStart:null,backupEnd:null,isRotation:true,rotationDays:90,lastRotation:new Date("2024-12-28"),remarks:"",codecar:"TNT01",codesen:"SEN04",accountNo:"ACC-TNT-001",senderName:"Philips Healthcare",contactStatus:"MISSING",contactEmail:"",contactName:"",spikeActive:false},
  {id:"GLS-SEQ-001",carrier:"GLS",startNo:12000000,endNo:13000000,currentVal:12550000,startDate:new Date("2025-01-27"),source:"SQL",backupStart:13000001,backupEnd:14000000,isRotation:false,rotationDays:null,lastRotation:null,remarks:"",codecar:"GLS01",codesen:"SEN05",accountNo:"ACC-GLS-001",senderName:"Zalando SE",contactStatus:"VALID",contactEmail:"l.fischer@gls-group.eu",contactName:"Lena Fischer",spikeActive:false},
  {id:"DPD-SEQ-001",carrier:"DPD",startNo:14000000,endNo:14500000,currentVal:14350000,startDate:new Date("2025-01-21"),source:"SQL",backupStart:null,backupEnd:null,isRotation:false,rotationDays:null,lastRotation:null,remarks:"",codecar:"DPD01",codesen:"SEN06",accountNo:"ACC-DPD-001",senderName:"Otto Group",contactStatus:"VALID",contactEmail:"m.bianchi@dpd.com",contactName:"Marco Bianchi",spikeActive:false},
  {id:"DPD-SEQ-002",carrier:"DPD",startNo:15000000,endNo:17000000,currentVal:15200000,startDate:new Date("2025-02-02"),source:"BigQuery",backupStart:null,backupEnd:null,isRotation:false,rotationDays:null,lastRotation:null,remarks:"",codecar:"DPD02",codesen:"SEN10",accountNo:"ACC-DPD-002",senderName:"H&M Logistics",contactStatus:"VALID",contactEmail:"support@dpd.com",contactName:"Anna Berg",spikeActive:false},
];

const ENV_CODES = {
  "DHL-SEQ-001": "P02",
  "DHL-SEQ-002": "P01",
  "FDX-SEQ-001": "P03",
  "FDX-SEQ-002": "P01",
  "UPS-SEQ-001": "P02",
  "UPS-SEQ-002": "P03",
  "TNT-SEQ-001": "P05",
  "GLS-SEQ-001": "P04",
  "DPD-SEQ-001": "P01",
  "DPD-SEQ-002": "P05"
};


const computeStats = (seq) => {
  const daysRunning = Math.max(1, (today - seq.startDate) / 86400000);
  const consumed = seq.currentVal - seq.startNo;
  const remaining = Math.max(0, seq.endNo - seq.currentVal);
  const burnPerDay = consumed / daysRunning;
  const burnPerHour = burnPerDay / 24;
  const burnPer2Hr = burnPerHour * 2;
  const burnPerMonth = burnPerDay * 30;
  const daysLeft = burnPerDay > 0 ? remaining / burnPerDay : 9999;
  const pctLeft = (seq.endNo - seq.startNo) > 0 ? remaining / (seq.endNo - seq.startNo) : 0;
  const spikeDaysLeft = remaining / (burnPerDay * 2.5);
  let riskLevel = daysLeft < 7 ? "CRITICAL" : daysLeft < 30 ? "WARNING" : "OK";
  if (seq.isRotation && daysLeft >= 7) riskLevel = "ROTATION";
  const rotDaysLeft = seq.isRotation && seq.lastRotation
    ? seq.rotationDays - Math.floor((today - seq.lastRotation) / 86400000) : null;
  const rotationGap = (seq.isRotation && daysLeft < rotDaysLeft) ? rotDaysLeft - daysLeft : 0;
  return { daysRunning, consumed, remaining, burnPerDay, burnPerHour, burnPer2Hr, burnPerMonth, daysLeft, pctLeft, spikeDaysLeft, riskLevel, rotDaysLeft, rotationGap };
};

const Badge = ({ children, color = "var(--text-dim)", bg = "transparent" }) => (
  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "2px 8px", borderRadius: 3, border: `1px solid ${color}`, color, background: bg, letterSpacing: "0.05em", flexShrink: 0 }}>{children}</span>
);

const Btn = ({ children, onClick, color = "var(--blue)", disabled = false, small = false, style = {} }) => (
  <button onClick={disabled ? undefined : onClick} style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: small ? 11 : 12, padding: small ? "4px 10px" : "7px 14px", borderRadius: 5, border: `1px solid ${disabled ? "var(--text-muted)" : color}`, color: disabled ? "var(--text-muted)" : color, background: disabled ? "transparent" : `${color}18`, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.15s", letterSpacing: "0.03em", ...style }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = `${color}30`; e.currentTarget.style.boxShadow = `0 0 12px ${color}55`; } }}
    onMouseLeave={e => { e.currentTarget.style.background = disabled ? "transparent" : `${color}18`; e.currentTarget.style.boxShadow = "none"; }}>
    {children}
  </button>
);

const HealthBar = ({ pct, risk }) => {
  const colors = { CRITICAL: "var(--red)", WARNING: "var(--amber)", ROTATION: "var(--blue)", OK: "var(--green)" };
  const col = colors[risk] || colors.OK;
  return (
    <div style={{ background: "var(--navy)", borderRadius: 4, height: 8, overflow: "hidden" }}>
      <div style={{ width: `${Math.max(0, Math.min(100, pct * 100))}%`, height: "100%", background: `linear-gradient(90deg,${col}88,${col})`, borderRadius: 4, transition: "width 2s ease", boxShadow: `0 0 8px ${col}`, animation: pct < 0.1 ? "healthPulse 0.8s infinite" : "none" }} />
    </div>
  );
};

const cardStyle = (risk) => {
  const base = { borderRadius: 10, padding: 16, position: "relative", overflow: "hidden", animation: "fadeIn 0.4s ease" };
  if (risk === "CRITICAL") return { ...base, border: "1px solid var(--red)", animation: "pulse-red 1.5s ease-in-out infinite,fadeIn 0.4s ease", background: "linear-gradient(135deg,var(--red-dim) 0%,var(--navy2) 100%)" };
  if (risk === "WARNING") return { ...base, border: "1px solid var(--amber)", animation: "pulse-amber 2s ease-in-out infinite,fadeIn 0.4s ease", background: "linear-gradient(135deg,var(--amber-dim) 0%,var(--navy2) 100%)" };
  if (risk === "ROTATION") return { ...base, border: "1px solid var(--blue)", animation: "shimmer-blue 2.5s ease-in-out infinite,fadeIn 0.4s ease", background: "linear-gradient(135deg,var(--blue-dim) 0%,var(--navy2) 100%)" };
  return { ...base, border: "1px solid #1a3a2a", animation: "glow-green 3s ease-in-out infinite,fadeIn 0.4s ease", background: "linear-gradient(135deg,var(--green-dim) 0%,var(--navy2) 100%)" };
};

const riskColor = { CRITICAL: "var(--red)", WARNING: "var(--amber)", ROTATION: "var(--blue)", OK: "var(--green)" };
const riskEmoji = { CRITICAL: "🔴", WARNING: "🟡", ROTATION: "🔵", OK: "🟢" };

// ── SLA Countdown ────────────────────────────────────────────────────────────
function SLACountdown({ sentAt }) {
  const [timeLeft, setTimeLeft] = useState(24 * 3600);
  
  useEffect(() => {
    const update = () => {
      const elapsed = Math.floor((new Date() - new Date(sentAt)) / 1000);
      setTimeLeft(Math.max(0, (24 * 3600) - elapsed));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [sentAt]);

  const hrs = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;
  const isBreached = timeLeft <= 0;
  const col = isBreached ? "var(--red)" : hrs < 12 ? "var(--amber)" : "var(--green)";

  return (
    <div style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${col}`, borderRadius: 4, padding: "3px 8px", display: "inline-flex", alignItems: "center", gap: 6, animation: isBreached ? "blink 1s infinite" : "none" }}>
      <span style={{ fontSize: 10 }}>⏳</span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: col, fontWeight: 700 }}>
        {isBreached ? "BREACHED" : `SLA: ${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}
      </span>
    </div>
  );
}

// ── Sequence Card ─────────────────────────────────────────────────────────────
function SequenceCard({ seq, stats, onAction, emailSentData, emailSentAt, monitoring }) {
  const emailSent = !!emailSentData;
  const col = riskColor[stats.riskLevel];
  const isSLABreached = emailSentAt && (new Date() - new Date(emailSentAt)) > 86400000;
  
  const baseCardStyle = cardStyle(stats.riskLevel);
  const finalCardStyle = {
    ...baseCardStyle,
    ...(isSLABreached ? { animation: `${baseCardStyle.animation}, slaBreach 2s infinite, glitch 0.3s infinite` } : {})
  };

  return (
    <div style={finalCardStyle}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${col}66,transparent)` }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 16 }}>{riskEmoji[stats.riskLevel]}</span>
            <Badge color={col}>{seq.id}</Badge>
            <Badge color="var(--purple)">ENV: {ENV_CODES[seq.id] || "N/A"}</Badge>
          </div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 700, color: col, letterSpacing: "0.08em", marginBottom: 2 }}>{seq.carrier}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>{seq.senderName} · {seq.accountNo}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 900, color: col, lineHeight: 1, textShadow: `0 0 20px ${col}` }}>{stats.daysLeft > 999 ? "∞" : fmtD(stats.daysLeft)}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)" }}>UNTIL EMPTY</div>
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>{fmt(seq.currentVal)} / {fmt(seq.endNo)}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: col, fontWeight: 700 }}>{(stats.pctLeft * 100).toFixed(1)}% · {fmt(stats.remaining)} left</span>
        </div>
        <HealthBar pct={stats.pctLeft} risk={stats.riskLevel} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, marginBottom: 10 }}>
        {[["2hr", fmt(stats.burnPer2Hr)], ["day", fmt(stats.burnPerDay)], ["month", fmt(stats.burnPerMonth)]].map(([label, val]) => (
          <div key={label} style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 6px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text)", fontWeight: 700 }}>{val}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 1 }}>/{label}</div>
          </div>
        ))}
      </div>

      {seq.spikeActive && (
        <div style={{ background: "rgba(255,184,0,0.08)", border: "1px solid var(--amber)", borderRadius: 6, padding: "6px 10px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", animation: "critFlash 1.5s infinite" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--amber)" }}>⚡ SPIKE · Normal: {fmtD(stats.daysLeft)} · Worst-case: {fmtD(stats.spikeDaysLeft)}</span>
          <Btn small color="var(--amber)" onClick={() => onAction("ack_spike", seq.id)}>✅ ACK +150</Btn>
        </div>
      )}

      {seq.isRotation && (
        <div style={{ background: stats.rotationGap > 0 ? "rgba(255,45,85,0.1)" : "rgba(0,200,255,0.06)", border: `1px solid ${stats.rotationGap > 0 ? "var(--red)" : "var(--blue)"}`, borderRadius: 6, padding: "6px 10px", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: stats.rotationGap > 0 ? "var(--red)" : "var(--blue)" }}>
              🔄 ROTATION · {seq.rotationDays}d cycle · Next: {stats.rotDaysLeft}d
            </span>
            {stats.rotationGap > 0 && <Badge color="var(--red)" bg="var(--red-dim)">⚠️ CRITICAL GAP</Badge>}
          </div>
          {stats.rotationGap > 0 && (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--red)", marginTop: 4, fontWeight: 700 }}>
              🚨 Range expires in {fmtD(stats.daysLeft)} but rotation is in {stats.rotDaysLeft}d. Gap: {stats.rotationGap.toFixed(1)} days of "dead air".
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10, alignItems: "center" }}>
        {seq.contactStatus === "VALID" && <Badge color="var(--green)">📧 Contact OK</Badge>}
        {seq.contactStatus === "INVALID" && <Badge color="var(--red)" bg="var(--red-dim)">❌ Invalid Email</Badge>}
        {seq.contactStatus === "MISSING" && <Badge color="var(--amber)" bg="var(--amber-dim)">🔴 No Contact</Badge>}
        {emailSent && <SLACountdown sentAt={emailSentAt} />}
        {monitoring && <Badge color="var(--blue)" bg="var(--blue-dim)">⏱ Monitoring</Badge>}
        {seq.remarks ? <Badge color="var(--text-dim)">{seq.remarks}</Badge> : null}
      </div>

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {(stats.riskLevel === "CRITICAL" || stats.riskLevel === "WARNING") && !emailSent && (
          <Btn color="var(--red)" onClick={() => onAction("send_email", seq.id)}>📧 Send Alert +500</Btn>
        )}
        {seq.contactStatus === "INVALID" && <Btn color="var(--amber)" onClick={() => onAction("fix_contact", seq.id)}>⚠️ Fix Contact +100</Btn>}
        {seq.contactStatus === "MISSING" && <Btn color="var(--red)" onClick={() => onAction("add_contact", seq.id)}>🔴 Add Contact +100</Btn>}
        {emailSent && !monitoring && <Btn color="var(--green)" onClick={() => onAction("add_range", seq.id)}>➕ Add Range +200</Btn>}
        {seq.isRotation && <Btn color="var(--blue)" onClick={() => onAction("rotation_email", seq.id)}>🔄 Rotation Email</Btn>}
        <Btn small color="var(--text-dim)" onClick={() => onAction("view_senders", seq.id)}>👥 Senders</Btn>
      </div>
    </div>
  );
}

// ── Email Modal ───────────────────────────────────────────────────────────────
function EmailModal({ seq, stats, isRotation, activePlayer, onClose, onSend }) {
  const pctLeft = (stats.pctLeft * 100).toFixed(1);
  const subject = `Sequence_code | ${seq.id}`;
  const signature = `${activePlayer}\nCentiro | Operations Team`;
  const body = isRotation
    ? `Hello Team,\n\nWe are reviewing the rotation setup for sequence ${seq.id}.\n\nCurrent rotation period: ${seq.rotationDays} days\nDays until next rotation: ${stats.rotDaysLeft} days\nNew range remaining: ~${fmtD(stats.daysLeft)}\n\nThe new range may NOT survive the full rotation period.\n\nCould you please advise:\n1. Should we add the same range again for the next rotation?\n2. Or are you providing a new range? If yes, please share the new range details.\n\nSequence details:\nSequenceName : ${seq.id}\nCurrent range: ${fmt(seq.startNo)} - ${fmt(seq.endNo)}\nCodecar      : ${seq.codecar}\nCodesen      : ${seq.codesen}\nAccount No   : ${seq.accountNo}\n\nBest regards,\n${signature}`
    : `Hello Team,\n\nHope you are doing well!\n\nCould you please help us with a new sequence range to add to our production?\n\nCurrently, the range is running low at ${pctLeft}% [${fmt(stats.remaining)} numbers left].\n\nMore details of the sequence range:\n\nSequenceName   : ${seq.id}\nCurrent range  : ${fmt(seq.startNo)} - ${fmt(seq.endNo)}\nCodecar        : ${seq.codecar}\nCodesen        : ${seq.codesen}\nCustomer Number: ${seq.accountNo}\n\nBurn rate      : ~${fmt(stats.burnPerDay)} numbers/day\nEstimated days : ~${fmtD(stats.daysLeft)} remaining\n\nPlease provide the new range at your earliest convenience.\n\nBest regards,\n${signature}`;
  const [editBody, setEditBody] = useState(body);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.87)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--navy2)", border: "1px solid var(--border-bright)", borderRadius: 12, padding: 28, width: 600, maxHeight: "82vh", overflowY: "auto", animation: "modalIn 0.2s ease", boxShadow: "0 24px 64px rgba(0,0,0,0.9)" }}>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 13, color: "var(--blue)", marginBottom: 18, letterSpacing: "0.08em" }}>📧 DRAFT ALERT EMAIL</div>
        {[["FROM", `${activePlayer.toLowerCase()}@centiro.com`, "var(--text)"], ["TO · CC", `ops.support@centiro.com  ·  ${seq.contactEmail || "⚠️ No CC — contact missing"}`, "var(--text)"], ["SUBJECT", subject, "var(--amber)"]].map(([label, val, col]) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>{label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: col, padding: "7px 10px", background: "var(--navy3)", borderRadius: 5 }}>{val}</div>
          </div>
        ))}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>BODY <span style={{ color: "var(--text-muted)" }}>(editable)</span></div>
          <textarea value={editBody} onChange={e => setEditBody(e.target.value)} style={{ width: "100%", height: 220, background: "var(--navy3)", border: "1px solid var(--border-bright)", borderRadius: 6, padding: 10, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text)", resize: "vertical", outline: "none", lineHeight: 1.6 }} />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn color="var(--text-muted)" onClick={onClose}>Cancel</Btn>
          <Btn color="var(--green)" onClick={() => onSend(subject, editBody)}>✅ Confirm Send · +500 pts</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Contact Modal ─────────────────────────────────────────────────────────────
function ContactModal({ seq, mode, onClose, onSave }) {
  const [email, setEmail] = useState(mode === "fix" ? seq.contactEmail : "");
  const [name, setName] = useState(seq.contactName || "");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const borderCol = mode === "missing" ? "var(--red)" : "var(--amber)";
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.87)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--navy2)", border: `1px solid ${borderCol}`, borderRadius: 12, padding: 28, width: 460, animation: "modalIn 0.2s ease", boxShadow: "0 24px 64px rgba(0,0,0,0.9)" }}>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 13, color: borderCol, marginBottom: 14, letterSpacing: "0.08em" }}>{mode === "missing" ? "🔴 NO CONTACT FOUND" : "❌ INVALID CONTACT EMAIL"}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-dim)", marginBottom: 18 }}>{mode === "missing" ? `No carrier contact for ${seq.carrier}. Add manually to proceed with email alert.` : `Invalid email format detected for ${seq.contactName}. Correct to dispatch alert.`}</div>
        {[["CONTACT NAME", name, setName, "e.g. Klaus Müller", "var(--text)"], ["EMAIL ADDRESS", email, setEmail, "contact@carrier.com", email && !valid ? "var(--red)" : "var(--border-bright)"]].map(([label, val, setter, ph, bc]) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>{label}</div>
            <input value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={{ width: "100%", padding: "8px 12px", background: "var(--navy3)", border: `1px solid ${bc}`, borderRadius: 6, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", outline: "none" }} />
          </div>
        ))}
        {email && !valid && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--red)", marginBottom: 12 }}>⚠️ Invalid email format</div>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn color="var(--text-muted)" onClick={onClose}>Cancel</Btn>
          <Btn color="var(--green)" disabled={!valid || !name} onClick={() => onSave(name, email)}>✅ Save Contact · +100 pts</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Add Range Modal ───────────────────────────────────────────────────────────
function AddRangeModal({ seq, onClose, onAdd }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [isAlpha, setIsAlpha] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");

  const canAdd = start && end && !isNaN(start) && !isNaN(end) && Number(end) > Number(start);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.87)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--navy2)", border: `1px solid ${isAlpha ? "var(--amber)" : "var(--green)"}`, borderRadius: 12, padding: 28, width: 460, animation: "modalIn 0.2s ease", boxShadow: "0 24px 64px rgba(0,0,0,0.9)" }}>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 13, color: isAlpha ? "var(--amber)" : "var(--green)", marginBottom: 14, letterSpacing: "0.08em" }}>
          {isAlpha ? "🔤 ADD ALPHANUMERIC RANGE" : "➕ ADD NEW RANGE"} — {seq.id}
        </div>

        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" id="alphaCheck" checked={isAlpha} onChange={e => setIsAlpha(e.target.checked)} style={{ cursor: "pointer" }} />
          <label htmlFor="alphaCheck" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text)", cursor: "pointer" }}>Is this an Alphanumeric range?</label>
        </div>

        {isAlpha && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>PREFIX</div>
              <input value={prefix} onChange={e => setPrefix(e.target.value)} placeholder="e.g. A" style={{ width: "100%", padding: "8px 12px", background: "var(--navy3)", border: "1px solid var(--border-bright)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--amber)", outline: "none" }} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>SUFFIX</div>
              <input value={suffix} onChange={e => setSuffix(e.target.value)} placeholder="e.g. B" style={{ width: "100%", padding: "8px 12px", background: "var(--navy3)", border: "1px solid var(--border-bright)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--amber)", outline: "none" }} />
            </div>
          </div>
        )}

        {[["START NUMBER (digits only)", start, setStart, "e.g. 1500001"], ["END NUMBER (digits only)", end, setEnd, "e.g. 2000000"]].map(([label, val, setter, ph]) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>{label}</div>
            <input value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={{ width: "100%", padding: "8px 12px", background: "var(--navy3)", border: "1px solid var(--border-bright)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 14, color: isAlpha ? "var(--amber)" : "var(--green)", outline: "none" }} />
          </div>
        ))}

        {isAlpha && start && end && (
          <div style={{ background: "rgba(0,0,0,0.3)", padding: 10, borderRadius: 6, marginBottom: 14, border: "1px dashed var(--amber)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)" }}>PREVIEW:</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--amber)" }}>{prefix}{start}{suffix} → {prefix}{end}{suffix}</div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn color="var(--text-muted)" onClick={onClose}>Cancel</Btn>
          <Btn color={isAlpha ? "var(--amber)" : "var(--green)"} disabled={!canAdd} onClick={() => onAdd(isAlpha ? "ALPHA_COMBO" : "NUMERIC", start, end, prefix, suffix)}>
            ✅ Add Range · +200 pts
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── Senders Modal ─────────────────────────────────────────────────────────────
function SendersModal({ seq, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.87)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--navy2)", border: "1px solid var(--border-bright)", borderRadius: 12, padding: 28, width: 500, animation: "modalIn 0.2s ease" }}>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 13, color: "var(--blue)", marginBottom: 16, letterSpacing: "0.08em" }}>👥 SENDERS USING {seq.id}</div>
        <div style={{ background: "var(--navy3)", borderRadius: 8, padding: 16, marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Carrier", seq.carrier], ["Sender", seq.senderName], ["Codecar", seq.codecar], ["Codesen", seq.codesen], ["Account No", seq.accountNo], ["Contact", seq.contactName || "—"], ["Contact Email", seq.contactEmail || "—"], ["Contact Status", seq.contactStatus]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>{k}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text)", marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
        <Btn color="var(--text-muted)" onClick={onClose}>Close</Btn>
      </div>
    </div>
  );
}

// ── Login Modal ───────────────────────────────────────────────────────────────
function LoginModal({ onLogin, onClose, isRequired = false }) {
  const [name, setName] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.87)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }} onClick={e => !isRequired && e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--navy2)", border: "1px solid var(--blue)", borderRadius: 12, padding: 28, width: 400, animation: "modalIn 0.2s ease", boxShadow: "0 24px 64px rgba(0,0,0,0.9)" }}>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 13, color: "var(--blue)", marginBottom: 14, letterSpacing: "0.08em" }}>👤 {isRequired ? "PLEASE LOGIN" : "GUARDIAN LOGIN"}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-dim)", marginBottom: 18 }}>Enter your name to access the terminal. New Guardians will be registered automatically.</div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>NAME</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter name..." autoFocus style={{ width: "100%", padding: "8px 12px", background: "var(--navy3)", border: "1px solid var(--blue)", borderRadius: 6, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", outline: "none" }} onKeyDown={e => e.key === 'Enter' && name && onLogin(name)} />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {!isRequired && <Btn color="var(--text-muted)" onClick={onClose}>Cancel</Btn>}
          <Btn color="var(--blue)" disabled={!name} onClick={() => onLogin(name)}>Initialize Session</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Monitoring Banner ─────────────────────────────────────────────────────────
function MonitoringBanner({ seqId, onVerified }) {
  const [hrs, setHrs] = useState(24);
  useEffect(() => {
    const t = setInterval(() => setHrs(h => { if (h <= 1) { clearInterval(t); setTimeout(() => onVerified(seqId), 500); return 0; } return h - 1; }), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background: "rgba(0,200,255,0.06)", border: "1px solid var(--blue)", borderRadius: 8, padding: "8px 14px", marginTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--blue)" }}>⏱ MONITORING · {hrs}h remaining · Watching burn rate...</span>
      <Btn small color="var(--blue)" onClick={() => { setHrs(0); onVerified(seqId); }}>⏩ Fast Forward</Btn>
    </div>
  );
}

// ── Score Popup ───────────────────────────────────────────────────────────────
function ScorePopup({ delta, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1400); return () => clearTimeout(t); }, []);
  const color = delta > 0 ? "var(--green)" : "var(--red)";
  return (
    <div style={{ position: "fixed", top: "45%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "var(--font-head)", fontSize: 52, fontWeight: 900, color, textShadow: `0 0 40px ${color}`, zIndex: 9000, animation: "scoreFlash 1.4s ease forwards", pointerEvents: "none" }}>
      {delta > 0 ? `+${delta}` : `${delta}`}
    </div>
  );
}

// ── Start Page ────────────────────────────────────────────────────────────────
function StartPage({ onStart }) {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at center, var(--navy2) 0%, var(--navy) 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,200,255,0.03) 3px,rgba(0,200,255,0.03) 4px)", pointerEvents: "none" }} />
      <h1 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(40px, 10vw, 100px)", fontWeight: 900, color: "var(--blue)", textShadow: "0 0 20px var(--blue), 0 0 40px var(--blue-glow)", marginBottom: "15px", letterSpacing: "0.15em", textAlign: "center", animation: "glitch 2s infinite", marginTop: "-10vh" }}>
        SEQUENCE GUARDIAN
      </h1>
      <div style={{ background: "rgba(0, 200, 255, 0.08)", border: "1px solid var(--blue-dim)", padding: "6px 24px", borderRadius: "4px", marginBottom: "45px", backdropFilter: "blur(8px)", boxShadow: "0 0 20px rgba(0, 200, 255, 0.1)", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "6px", height: "6px", background: "var(--blue)", borderRadius: "50%", boxShadow: "0 0 8px var(--blue)", animation: "blink 1.5s infinite" }} />
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--blue)", letterSpacing: "0.5em", textTransform: "uppercase", fontWeight: 700, margin: 0 }}>
          No Breach. No Break.
        </p>
        <div style={{ width: "6px", height: "6px", background: "var(--blue)", borderRadius: "50%", boxShadow: "0 0 8px var(--blue)", animation: "blink 1.5s infinite" }} />
      </div>
      <Btn onClick={onStart} color="var(--blue)" style={{ padding: "8px 25px", fontSize: "14px", border: "1px solid var(--blue)", boxShadow: "0 0 15px var(--blue-glow)" }}>
        START TERMINAL
      </Btn>
      <div style={{ position: "absolute", bottom: 20, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
        CENTIRO LOGISTICS TERMINAL v2.4.0 // SECURE CONNECTION ESTABLISHED
      </div>
    </div>
  );
}

// ── Alphanumeric Page ─────────────────────────────────────────────────────────
function AlphanumericPage({ entries, allSeqs, onSubmit, onBack }) {
  const choices = [...entries, ...allSeqs.filter(s => !entries.some(e => e.id === s.id)).map(s => ({ id: s.id, carrier: s.carrier }))];
  const [selId, setSelId] = useState(choices[0]?.id || "");
  const [rawStr, setRawStr] = useState("");
  const [manStart, setManStart] = useState("");
  const [manEnd, setManEnd] = useState("");
  const [learned, setLearned] = useState([]);
  const handleSubmit = () => {
    setLearned(l => [...l, { seqId: selId, pattern: `${manStart} → ${manEnd}`, date: new Date().toLocaleTimeString() }]);
    onSubmit(selId, manStart, manEnd);
  };
  return (
    <div style={{ padding: 24, animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid var(--border-bright)", borderRadius: 6, color: "var(--text-dim)", cursor: "pointer", padding: "6px 14px", fontFamily: "var(--font-body)", fontSize: 13 }}>← Dashboard</button>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 18, color: "var(--amber)", letterSpacing: "0.1em" }}>🔤 ALPHANUMERIC RANGE HANDLER</div>
        {entries.length > 0 && <Badge color="var(--amber)" bg="var(--amber-dim)">{entries.length} PENDING</Badge>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 900 }}>
        <div style={{ background: "rgba(255,184,0,0.06)", border: "1px solid var(--amber)", borderRadius: 10, padding: 20 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--amber)", marginBottom: 16 }}>AI detected non-numeric range. Manual entry required. AI will learn this pattern.</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>SEQUENCE CODE</div>
            <select value={selId} onChange={e => setSelId(e.target.value)} style={{ padding: "7px 10px", background: "var(--navy3)", border: "1px solid var(--border-bright)", borderRadius: 6, color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: 13, outline: "none", width: "100%" }}>
              {choices.map(c => <option key={c.id} value={c.id}>{c.id} — {c.carrier}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>RAW STRING FROM EMAIL</div>
            <input value={rawStr} onChange={e => setRawStr(e.target.value)} placeholder='"A100000 to A999999"' style={{ width: "100%", padding: "8px 12px", background: "var(--navy3)", border: "1px solid var(--border-bright)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text)", outline: "none" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[["MANUAL START", manStart, setManStart, "A100000"], ["MANUAL END", manEnd, setManEnd, "A999999"]].map(([label, val, setter, ph]) => (
              <div key={label}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>{label}</div>
                <input value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={{ width: "100%", padding: "8px 10px", background: "var(--navy3)", border: "1px solid var(--border-bright)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--amber)", outline: "none" }} />
              </div>
            ))}
          </div>
          <Btn color="var(--amber)" disabled={!manStart || !manEnd || !selId} onClick={handleSubmit}>✅ Submit Range Setup · +150 pts</Btn>
        </div>
        <div style={{ background: "var(--navy2)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 11, color: "var(--blue)", marginBottom: 14, letterSpacing: "0.08em" }}>🤖 AI LEARNING LOG</div>
          {learned.length === 0
            ? <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>No patterns learned yet.<br /><br />Submit a range above to begin AI training. Learned patterns will be used to auto-parse future alphanumeric ranges from carrier emails.</div>
            : learned.map((l, i) => (
              <div key={i} style={{ padding: "8px 10px", background: "rgba(0,200,255,0.06)", border: "1px solid var(--blue)", borderRadius: 6, marginBottom: 8 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--blue)" }}>✅ {l.seqId} — {l.pattern}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>Learned at {l.date}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ── Leaderboard Page ──────────────────────────────────────────────────────────
function LeaderboardPage({ players, getLevel, onBack }) {
  const sortedPlayers = Object.entries(players)
    .map(([name, data]) => ({ name, ...data, rank: getLevel(data.score).name }))
    .sort((a, b) => b.score - a.score);

  return (
    <div style={{ padding: 24, animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid var(--border-bright)", borderRadius: 6, color: "var(--text-dim)", cursor: "pointer", padding: "6px 14px", fontFamily: "var(--font-body)", fontSize: 13 }}>← Dashboard</button>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 18, color: "var(--amber)", letterSpacing: "0.1em" }}>🏆 GUARDIAN LEADERBOARD</div>
      </div>
      
      <div style={{ maxWidth: 800, margin: "0 auto", background: "var(--navy2)", border: "1px solid var(--border-bright)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)" }}>
          <thead>
            <tr style={{ background: "var(--navy3)", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>RANK</th>
              <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>GUARDIAN</th>
              <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>LEVEL / TITLE</th>
              <th style={{ padding: "16px", textAlign: "right", color: "var(--text-muted)", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>TOTAL SCORE</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((p, i) => (
              <tr key={p.name} style={{ borderBottom: "1px solid var(--border)", background: i === 0 ? "rgba(255,184,0,0.03)" : "transparent" }}>
                <td style={{ padding: "16px" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? "var(--amber)" : "var(--navy3)", color: i === 0 ? "var(--navy)" : "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>
                    {i + 1}
                  </div>
                </td>
                <td style={{ padding: "16px", fontFamily: "var(--font-head)", color: i === 0 ? "var(--amber)" : "var(--text)", fontSize: 14 }}>
                  {p.name.toUpperCase()} {i === 0 && "👑"}
                </td>
                <td style={{ padding: "16px" }}>
                  <Badge color={i === 0 ? "var(--amber)" : "var(--blue)"}>{p.rank}</Badge>
                </td>
                <td style={{ padding: "16px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 900, color: i === 0 ? "var(--amber)" : "var(--green)" }}>
                  {p.score.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ textAlign: "center", marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
        * Scores update in real-time as Guardians perform operations.
      </div>
    </div>
  );
}

// ── Resolved Page ─────────────────────────────────────────────────────────────
function ResolvedPage({ items, liveRanges, onBack }) {
  return (
    <div style={{ padding: 24, animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid var(--border-bright)", borderRadius: 6, color: "var(--text-dim)", cursor: "pointer", padding: "6px 14px", fontFamily: "var(--font-body)", fontSize: 13 }}>← Dashboard</button>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 18, color: "var(--green)", letterSpacing: "0.1em" }}>✅ RESOLVED SEQUENCES</div>
      </div>
      {items.length === 0
        ? <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-muted)", textAlign: "center", marginTop: 60 }}>No resolved sequences yet. Handle alerts on the dashboard to resolve them.</div>
        : items.map(item => (
          <div key={item.id} style={{ background: "var(--navy2)", border: "1px solid var(--green)", borderRadius: 10, padding: 16, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", animation: "fadeIn 0.3s ease" }}>
            <div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 13, color: "var(--green)" }}>{item.id}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>{item.msg}</div>
            </div>
            <Badge color="var(--green)" bg="var(--green-dim)">✅ VERIFIED HEALTHY</Badge>
          </div>
        ))}
      {liveRanges.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 13, color: "var(--blue)", marginBottom: 14, letterSpacing: "0.08em" }}>📋 LIVE ACTIVE RANGES — SHEET 4</div>
          <div style={{ background: "var(--navy2)", border: "1px solid var(--border-bright)", borderRadius: 10, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: 12 }}>
              <thead>
                <tr>{["SEQ CODE", "NEW START", "NEW END", "DATE ADDED", "ADDED BY", "STATUS"].map(h => <th key={h} style={{ padding: "10px 14px", background: "var(--navy3)", color: "var(--text-dim)", textAlign: "left", fontWeight: 400, borderBottom: "1px solid var(--border)", fontSize: 11 }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {liveRanges.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    {[r.seqId, fmt(r.newStart), fmt(r.newEnd), r.dateAdded, r.addedBy].map((v, j) => <td key={j} style={{ padding: "10px 14px", color: "var(--text)" }}>{v}</td>)}
                    <td style={{ padding: "10px 14px" }}><Badge color={r.status === "MONITORING" ? "var(--blue)" : "var(--green)"}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [players, setPlayers] = useState({
    "ADMIN": { score: 0 }
  });
  const [activePlayer, setActivePlayer] = useState("ADMIN");
  const [currentUser, setCurrentUser] = useState(null);
  
  const [sequences, setSequences] = useState(INIT_SEQS);
  const [feed, setFeed] = useState([
    { type: "SYSTEM", icon: "🛡️", msg: "Sequence Guardian online. Gap detection engine active.", time: "00:00:00" },
    { type: "CRITICAL", icon: "🔴", msg: "DHL-SEQ-001: CRITICAL — 4.2 days remaining. Backup range on standby.", time: "00:00:01" },
    { type: "CRITICAL", icon: "🔴", msg: "FDX-SEQ-001: CRITICAL — 2.8 days. NO BACKUP. Immediate action required!", time: "00:00:01" },
    { type: "WARNING", icon: "⚡", msg: "SPIKE ALERT: DHL-SEQ-001 2hr rate is 2.4× above baseline.", time: "00:00:02" },
    { type: "WARNING", icon: "❌", msg: "FedEx (FDX-SEQ-001): Contact email invalid. Manual fix required.", time: "00:00:02" },
    { type: "WARNING", icon: "🔴", msg: "TNT-SEQ-001: No carrier contact found. Rotation email cannot be sent.", time: "00:00:03" },
    { type: "INFO", icon: "🔄", msg: "TNT-SEQ-001: Rotation active — 18 days until next rotation cycle.", time: "00:00:03" },
    { type: "WARNING", icon: "⚠️", msg: "DPD-SEQ-001: WARNING — 15.2 days remaining. No backup range on file.", time: "00:00:04" },
  ]);
  const [page, setPage] = useState("start");
  const [modal, setModal] = useState(null);
  const [emailSent, setEmailSent] = useState({});
  const [emailSentAt, setEmailSentAt] = useState({});
  const [monitoring, setMonitoring] = useState({});
  const [resolved, setResolved] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [scorePopup, setScorePopup] = useState(null);
  const [alphaEntries, setAlphaEntries] = useState([]);
  const [liveRanges, setLiveRanges] = useState([]);
  const [clock, setClock] = useState(new Date());
  const feedRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => {
      setClock(new Date());
      
      // Randomly trigger spikes based on historical data probability
      setSequences(prev => prev.map(s => {
        if (s.spikeActive) return s; // Already spiked
        
        const stats = computeStats(s);
        // 2% chance per second to trigger a spike if it's healthy, 
        // 5% if it's already Warning/Critical
        const threshold = stats.riskLevel === "OK" ? 0.98 : 0.95;
        if (Math.random() > threshold) {
          const time = new Date().toLocaleTimeString("en-GB");
          setFeed(f => [...f.slice(-50), { type: "WARNING", icon: "⚡", msg: `SPIKE ALERT: ${s.id} rate is abnormally high!`, time }]);
          return { ...s, spikeActive: true };
        }
        return s;
      }));
    }, 5000); // Check every 5 seconds for more "action"
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [feed]);

  const addFeed = useCallback((type, icon, msg) => {
    const time = new Date().toLocaleTimeString("en-GB");
    setFeed(f => [...f.slice(-50), { type, icon, msg, time }]);
  }, []);

  const addScore = useCallback((delta) => {
    setPlayers(prev => {
      const newScore = Math.max(0, prev[activePlayer].score + delta);
      return {
        ...prev,
        [activePlayer]: { score: newScore }
      };
    });
    setScorePopup(delta);
    if (delta > 0) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        
        // Classic "Mario-style" Coin Sound Synthesis
        const playNote = (freq, start, duration, vol) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "triangle"; // Softer than square, punchier than sine
          osc.frequency.setValueAtTime(freq, start);
          g.gain.setValueAtTime(vol, start);
          g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + duration);
        };

        // Two-note "Ding-Ring" effect
        const now = ctx.currentTime;
        playNote(987.77, now, 0.15, 0.3); // B5
        playNote(1318.51, now + 0.08, 0.4, 0.3); // E6
        
      } catch (e) {
        // Fallback to a high-quality external coin sound if synthesis fails
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
        audio.volume = 0.5;
        audio.play().catch(() => {});
      }
    }
  }, [activePlayer]);

  const getLevel = (s) => {
    if (s <= 1000) return { name: "Junior Ops Coordinator", next: 1000 };
    if (s <= 3000) return { name: "Senior Ops Specialist", next: 3000 };
    if (s <= 6000) return { name: "Logistics Guardian", next: 6000 };
    if (s <= 10000) return { name: "Sequence Commander", next: 10000 };
    return { name: "Chief Carrier Guardian 🏆", next: null };
  };
  const currentScore = players[activePlayer].score;
  const level = getLevel(currentScore);

  const handleLogin = (name) => {
    setPlayers(prev => {
      if (prev[name]) return prev;
      return { ...prev, [name]: { score: 0 } };
    });
    setActivePlayer(name);
    setCurrentUser(name);
    setModal(null);
    setPage("dashboard");
    addFeed("SYSTEM", "👤", `Session Initialized: ${name}`);
  };

  const handleAction = (action, seqId) => {
    const seq = sequences.find(s => s.id === seqId);
    if (!seq) return;
    if (action === "ack_spike") {
      setSequences(p => p.map(s => s.id === seqId ? { ...s, spikeActive: false } : s));
      addFeed("SUCCESS", "✅", `${seqId}: Spike acknowledged. Rate normalizing.`);
      addScore(150);
    }
    if (action === "send_email") setModal({ type: "email", seqId });
    if (action === "fix_contact") setModal({ type: "fix_contact", seqId });
    if (action === "add_contact") setModal({ type: "missing_contact", seqId });
    if (action === "add_range") setModal({ type: "add_range", seqId });
    if (action === "rotation_email") setModal({ type: "rotation_email", seqId });
    if (action === "view_senders") setModal({ type: "senders", seqId });
  };

  const handleEmailSend = (seqId, subject, body) => {
    const seq = sequences.find(s => s.id === seqId);
    const to = "ops.support@centiro.com";
    const cc = seq.contactEmail ? `${seq.contactEmail}` : "";
    const mailtoUrl = `mailto:${to}?cc=${cc}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    setEmailSent(e => ({ ...e, [seqId]: { player: activePlayer, at: new Date().toISOString() } }));
    setEmailSentAt(e => ({ ...e, [seqId]: new Date().toISOString() }));
    setModal(null);
    addFeed("SUCCESS", "📧", `Alert email sent for ${seqId} by ${activePlayer}. Monitoring for reply.`);
    addScore(500);
  };

  const handleContactSave = (seqId, name, email) => {
    setSequences(p => p.map(s => s.id === seqId ? { ...s, contactName: name, contactEmail: email, contactStatus: "VALID" } : s));
    setModal(null);
    addFeed("SUCCESS", "✅", `Contact saved for ${seqId}: ${name} <${email}>`);
    addScore(100);
  };

  const handleAddRange = (seqId, type, start, end, prefix = "", suffix = "") => {
    if (type === "ALPHA_COMBO") {
      const fullStart = `${prefix}${start}${suffix}`;
      const fullEnd = `${prefix}${end}${suffix}`;
      const seq = sequences.find(s => s.id === seqId);
      
      setResolved(r => [...r, { id: seqId, msg: `${seq?.carrier || seqId} — Alphanumeric range added: ${fullStart}–${fullEnd}` }]);
      setSequences(p => p.filter(s => s.id !== seqId));
      setModal(null);
      addFeed("SUCCESS", "🔤", `Alphanumeric range accepted for ${seqId}: ${fullStart} → ${fullEnd}`);
      addScore(200);
      return;
    }
    const ns = Number(start), ne = Number(end);
    const seq = sequences.find(s => s.id === seqId);
    
    setSequences(p => p.map(s => s.id === seqId ? { 
      ...s, 
      startNo: ns,
      currentVal: ns,
      endNo: ne, 
      startDate: new Date(today),
      remarks: `Range rcvd ${new Date().toLocaleDateString()}` 
    } : s));

    setResolved(r => [...r, { id: seqId, msg: `${seq?.carrier || seqId} — New range added and verified: ${ns}–${ne}` }]);
    setEmailSent(e => { const ne = { ...e }; delete ne[seqId]; return ne; });
    setEmailSentAt(e => { const ne = { ...e }; delete ne[seqId]; return ne; });
    
    const rangeEntryId = Date.now();
    setLiveRanges(lr => [...lr, { entryId: rangeEntryId, seqId, newStart: ns, newEnd: ne, dateAdded: new Date().toLocaleDateString(), addedBy: activePlayer, status: "MONITORING" }]);
    
    // Auto-verify after 1 minute (60,000 ms)
    setTimeout(() => {
      setLiveRanges(lr => lr.map(r => r.entryId === rangeEntryId ? { ...r, status: "VERIFIED" } : r));
      addFeed("SUCCESS", "✅", `${seqId}: Sequence sync verified.`);
    }, 60000);
    
    // Remove the sequence from the active list since it is now 100% full
    setSequences(p => p.filter(s => s.id !== seqId));
    
    setModal(null);

    // ACTUAL Excel Update via the Bridge Server
    fetch(`http://localhost:3001/update?id=${seqId}&start=${ns}&end=${ne}`)
      .then(response => response.json())
      .then(data => {
        console.log("Excel Sync:", data);
        addFeed("SUCCESS", "📊", `Excel File Sync: ${seqId} range updated in spreadsheet.`);
      })
      .catch(err => {
        console.error("Excel Sync Failed:", err);
        addFeed("WARNING", "⚠️", "Excel Sync: Bridge server not responding.");
      });
    
    addFeed("SUCCESS", "➕", `New range added: ${seqId}. Monitoring for sync...`);
    addScore(200);
  };

  const handleAlphaSubmit = (seqId, start, end) => {
    const seq = sequences.find(s => s.id === seqId);
    setResolved(r => [...r, { id: seqId, msg: `${seq?.carrier || seqId} — Alpha range verified: ${start}–${end}` }]);
    setSequences(p => p.filter(s => s.id !== seqId));
    setAlphaEntries(a => a.filter(e => e.id !== seqId));
    setPage("dashboard");
    addFeed("SUCCESS", "🔤", `Alphanumeric range accepted for ${seqId}. AI pattern learned.`);
    addScore(150);
  };

  const handleVerified = (seqId) => {
    const seq = sequences.find(s => s.id === seqId);
    setMonitoring(m => { const nm = { ...m }; delete nm[seqId]; return nm; });
    setEmailSent(e => { const ne = { ...e }; delete ne[seqId]; return ne; });
    setEmailSentAt(e => { const ne = { ...e }; delete ne[seqId]; return ne; });
    setLiveRanges(lr => lr.map(r => r.seqId === seqId ? { ...r, status: "VERIFIED" } : r));
    setResolved(r => [...r, { id: seqId, msg: `${seq?.carrier || seqId} — Range verified healthy after 24h monitoring` }]);
    // We no longer filter out the sequence so it stays as a green health card
    addFeed("SUCCESS", "✅", `${seqId}: Range verified healthy. Dashboard updated. +100`);
    addScore(100);
  };

  const handleLogout = () => {
    setPage("start");
    setCurrentUser(null);
    addFeed("SYSTEM", "🔒", `Session Terminated: ${activePlayer}`);
  };

  const sortedSeqs = [...sequences]
    .filter(s => {
      if (filter === "ALL") return true;
      if (filter === "EMAILS_SENT") return !!emailSent[s.id];
      return computeStats(s).riskLevel === filter;
    })
    .sort((a, b) => {
    const order = { CRITICAL: 0, WARNING: 1, ROTATION: 2, OK: 3 };
    return (order[computeStats(a).riskLevel] ?? 4) - (order[computeStats(b).riskLevel] ?? 4);
  });

  const critCount = sequences.filter(s => computeStats(s).riskLevel === "CRITICAL").length;
  const warnCount = sequences.filter(s => computeStats(s).riskLevel === "WARNING").length;
  const feedColour = { CRITICAL: "var(--red)", WARNING: "var(--amber)", INFO: "var(--blue)", SUCCESS: "var(--green)", SYSTEM: "var(--purple)" };

  const tickerItems = ["🛡️ SEQUENCE GUARDIAN — CENTIRO LOGISTICS OPS", "🔴 DHL-SEQ-001 CRITICAL — 4.2 DAYS", "⚡ SPIKE ALERT ACTIVE", "🔴 FDX-SEQ-001 CRITICAL — NO BACKUP", "❌ FEDEX CONTACT INVALID", "🔴 TNT-SEQ-001 NO CONTACT", "🔵 ROTATION ACTIVE: TNT", "🟡 UPS-SEQ-001 WARNING", "🟡 DPD-SEQ-001 WARNING"];

  const getSeq = (id) => sequences.find(s => s.id === id);

  return (
    <>
      <FontLink />
      <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 15% 15%,rgba(0,200,255,0.05) 0%,transparent 55%),radial-gradient(ellipse at 85% 85%,rgba(255,45,85,0.05) 0%,transparent 55%),var(--navy)` }}>
        <div style={{ position: "fixed", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.025) 3px,rgba(0,0,0,0.025) 4px)", pointerEvents: "none", zIndex: 9999 }} />

        {page === "start" && <StartPage onStart={() => setModal({ type: "login", isRequired: true })} />}

        {page !== "start" && (
          <>
            {/* ── TOP BAR ── */}
            <div style={{ position: "sticky", top: 0, zIndex: 200, background: "rgba(5,13,31,0.97)", borderBottom: "1px solid var(--border-bright)", backdropFilter: "blur(10px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 20 }}>🛡️</span>
                <div style={{ fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 900, color: "var(--blue)", letterSpacing: "0.12em", textShadow: "0 0 24px var(--blue)", lineHeight: 1.1 }}>
                  <div>SEQUENCE</div>
                  <div>GUARDIAN</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Badge color="var(--blue)">CENTIRO OPS</Badge>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {currentUser === "ADMIN" ? (
                    <select 
                      value={activePlayer} 
                      onChange={(e) => {
                        setActivePlayer(e.target.value);
                        addFeed("SYSTEM", "👤", `View Switched: ${e.target.value}`);
                      }}
                      style={{ 
                        background: "var(--navy3)", 
                        border: "1px solid var(--blue)", 
                        borderRadius: 4, 
                        color: "var(--blue)", 
                        fontSize: 10, 
                        fontFamily: "var(--font-mono)", 
                        padding: "2px 6px",
                        outline: "none",
                        cursor: "pointer",
                        fontWeight: 700
                      }}
                    >
                      {Object.keys(players).map(name => (
                        <option key={name} value={name}>{name} — {players[name].score.toLocaleString()} pts</option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ 
                      background: "var(--navy3)", 
                      border: "1px solid var(--border)", 
                      borderRadius: 4, 
                      color: "var(--text-dim)", 
                      fontSize: 10, 
                      fontFamily: "var(--font-mono)", 
                      padding: "2px 8px",
                      fontWeight: 700
                    }}>
                      {activePlayer}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 4, flexShrink: 0, margin: "0 20px" }}>
              {[["dashboard", "⚡ Dashboard"], ["leaderboard", "🏆 Leaderboard"], ["resolved", "✅ Resolved"]].map(([p, label]) => (
                <button key={p} onClick={() => setPage(p)} style={{ background: page === p ? "rgba(0,200,255,0.1)" : "none", border: `1px solid ${page === p ? "var(--blue)" : "var(--border)"}`, borderRadius: 6, color: page === p ? "var(--blue)" : "var(--text-dim)", cursor: "pointer", padding: "6px 14px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, letterSpacing: "0.04em", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}>
                  {label}
                  {p === "resolved" && resolved.length > 0 && <span style={{ background: "var(--green)", color: "#000", borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{resolved.length}</span>}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 900, color: "var(--green)", lineHeight: 1, textShadow: "0 0 16px var(--green)" }}>{currentScore.toLocaleString()}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)" }}>SCORE</div>
              </div>
              <div style={{ width: 1, height: 36, background: "var(--border)" }} />
              <div style={{ display: "flex", gap: 12 }}>
                {[["CRITICAL", critCount, "var(--red)"], ["WARNING", warnCount, "var(--amber)"]].map(([label, val, col]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 700, color: col, lineHeight: 1, animation: val > 0 && label === "CRITICAL" ? "blink 1.2s infinite" : "" }}>{val}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)" }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ width: 1, height: 36, background: "var(--border)" }} />
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--blue)", letterSpacing: "0.1em", minWidth: 76, textAlign: "center" }}>{clock.toLocaleTimeString("en-GB")}</div>
              <button onClick={handleLogout} style={{ background: "none", border: "1px solid var(--red)", borderRadius: 6, color: "var(--red)", cursor: "pointer", padding: "6px 12px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 11, letterSpacing: "0.04em", transition: "all 0.15s", marginLeft: 4 }}>
                LOGOUT
              </button>
            </div>
          </div>

          {/* Ticker */}
          <div style={{ background: "rgba(0,200,255,0.04)", borderTop: "1px solid var(--border)", height: 22, overflow: "hidden", position: "relative" }}>
            <div style={{ display: "flex", gap: 60, position: "absolute", whiteSpace: "nowrap", animation: "ticker 28s linear infinite", top: "50%", transform: "translateY(-50%)" }}>
              {[...tickerItems, ...tickerItems].map((t, i) => (
                <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", flexShrink: 0 }}>· {t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── PAGES ── */}
        {page === "alpha" && <AlphanumericPage entries={alphaEntries} allSeqs={sequences} onSubmit={handleAlphaSubmit} onBack={() => setPage("dashboard")} />}
        {page === "leaderboard" && <LeaderboardPage players={players} getLevel={getLevel} onBack={() => setPage("dashboard")} />}
        {page === "resolved" && <ResolvedPage items={resolved} liveRanges={liveRanges} onBack={() => setPage("dashboard")} />}

        {/* ── DASHBOARD ── */}
        {page === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", height: "calc(100vh - 92px)" }}>

            {/* LEFT — Sequence Cards */}
            <div style={{ overflowY: "auto", padding: 16 }}>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 14 }}>
                {[
                  ["SEQUENCES", sequences.length, "var(--blue)", "ALL"],
                  ["CRITICAL", critCount, "var(--red)", "CRITICAL"],
                  ["WARNING", warnCount, "var(--amber)", "WARNING"],
                  ["EMAILS SENT", Object.keys(emailSent).length, "var(--green)", "EMAILS_SENT"],
                  ["RESOLVED", resolved.length, "var(--green)", null]
                ].map(([label, val, col, filterVal]) => (
                  <div 
                    key={label} 
                    onClick={() => filterVal && setFilter(filterVal)}
                    style={{ 
                      background: filter === filterVal ? `${col}22` : "var(--navy2)", 
                      border: `1px solid ${filter === filterVal ? col : col + "22"}`, 
                      borderRadius: 8, 
                      padding: "8px 12px", 
                      textAlign: "center",
                      cursor: filterVal ? "pointer" : "default",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700, color: col, lineHeight: 1 }}>{val}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 3, letterSpacing: "0.06em" }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Cards grid */}
              {filter === "EMAILS_SENT" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {sortedSeqs.map(seq => (
                    <div key={seq.id} style={{ background: "var(--navy2)", border: "1px solid var(--green)", borderRadius: 8, padding: "14px 18px", display: "flex", alignItems: "center", gap: 15, animation: "fadeIn 0.3s ease", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(0,255,136,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📧</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text)", lineHeight: 1.5 }}>
                        Email has been sent for <span style={{ color: "var(--green)", fontWeight: 700 }}>{seq.carrier}</span> in <span style={{ color: "var(--purple)", fontWeight: 700 }}>{ENV_CODES[seq.id] || "N/A"}</span> environment for sequence <span style={{ color: "var(--blue)", fontWeight: 700 }}>{seq.id}</span> by <span style={{ color: "var(--amber)", fontWeight: 700 }}>{emailSent[seq.id]?.player || "System"}</span>.
                      </div>
                      <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
                        {new Date(emailSentAt[seq.id]).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
                  {sortedSeqs.map(seq => {
                    const stats = computeStats(seq);
                    return (
                      <div key={seq.id}>
                        <SequenceCard 
                          seq={seq} 
                          stats={stats} 
                          onAction={handleAction} 
                          emailSentData={emailSent[seq.id]} 
                          emailSentAt={emailSentAt[seq.id]}
                          monitoring={!!monitoring[seq.id]} 
                        />
                        {monitoring[seq.id] && <MonitoringBanner seqId={seq.id} onVerified={handleVerified} />}
                      </div>
                    );
                  })}
                  {sequences.length === 0 && (
                    <div style={{ gridColumn: "1/-1", textAlign: "center", marginTop: 80, animation: "fadeIn 0.5s ease" }}>
                      <div style={{ fontFamily: "var(--font-head)", fontSize: 32, color: "var(--green)", textShadow: "0 0 30px var(--green)", marginBottom: 16 }}>🏆 ALL CLEAR</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--text-dim)" }}>All sequences resolved. Perfect Guardian achieved!</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT — Alert Feed */}
            <div style={{ borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "var(--navy2)", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-head)", fontSize: 10, color: "var(--blue)", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 8px var(--green)", animation: "blink 1.5s infinite" }} />
                LIVE ALERT FEED
              </div>
              <div ref={feedRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {feed.map((item, i) => (
                  <div key={i} style={{ padding: "7px 12px", borderBottom: "1px solid var(--border)", animation: "slideIn 0.3s ease", borderLeft: `3px solid ${feedColour[item.type] || "var(--text-muted)"}` }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: feedColour[item.type] || "var(--text-dim)" }}>{item.icon} {item.msg}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{item.time}</div>
                  </div>
                ))}
              </div>

              {/* Ops panel */}
              <div style={{ borderTop: "1px solid var(--border)", padding: 12, flexShrink: 0 }}>
                <div style={{ fontFamily: "var(--font-head)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 8 }}>OPS STATUS</div>
                {[["Active Sequences", sequences.length, "var(--blue)"], ["Critical Alerts", critCount, "var(--red)"], ["Emails Sent", Object.keys(emailSent).length, "var(--green)"], ["In Monitoring", Object.keys(monitoring).length, "var(--blue)"], ["Alpha Pending", alphaEntries.length, "var(--amber)"]].map(([label, val, col]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>{label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: col, fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
                <div style={{ marginTop: 10, background: "var(--navy3)", borderRadius: 6, padding: "8px 10px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--blue)", marginBottom: 4 }}>{activePlayer}: {level.name}</div>
                  <div style={{ background: "var(--navy)", borderRadius: 2, height: 4, overflow: "hidden" }}>
                    <div style={{ width: `${level.next ? Math.min(100, (currentScore / level.next) * 100) : 100}%`, height: "100%", background: "linear-gradient(90deg,var(--blue),var(--green))", transition: "width 0.8s" }} />
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 4 }}>{level.next ? `${(level.next - currentScore).toLocaleString()} pts to next level` : "MAX LEVEL ACHIEVED 🏆"}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        </>
      )}

        {/* ── MODALS ── */}

        {modal?.type === "email" && (() => { const seq = getSeq(modal.seqId); return seq ? <EmailModal seq={seq} stats={computeStats(seq)} activePlayer={activePlayer} onClose={() => setModal(null)} onSend={(sub, body) => handleEmailSend(seq.id, sub, body)} /> : null; })()}
        {modal?.type === "rotation_email" && (() => { const seq = getSeq(modal.seqId); return seq ? <EmailModal seq={seq} stats={computeStats(seq)} activePlayer={activePlayer} isRotation onClose={() => setModal(null)} onSend={(sub, body) => handleEmailSend(seq.id, sub, body)} /> : null; })()}
        {modal?.type === "fix_contact" && (() => { const seq = getSeq(modal.seqId); return seq ? <ContactModal seq={seq} mode="fix" onClose={() => setModal(null)} onSave={(n, e) => handleContactSave(seq.id, n, e)} /> : null; })()}
        {modal?.type === "missing_contact" && (() => { const seq = getSeq(modal.seqId); return seq ? <ContactModal seq={seq} mode="missing" onClose={() => setModal(null)} onSave={(n, e) => handleContactSave(seq.id, n, e)} /> : null; })()}
        {modal?.type === "add_range" && (() => { const seq = getSeq(modal.seqId); return seq ? <AddRangeModal seq={seq} onClose={() => setModal(null)} onAdd={(t, s, e) => handleAddRange(seq.id, t, s, e)} /> : null; })()}
        {modal?.type === "senders" && (() => { const seq = getSeq(modal.seqId); return seq ? <SendersModal seq={seq} onClose={() => setModal(null)} /> : null; })()}
        {modal?.type === "login" && <LoginModal onLogin={handleLogin} onClose={() => setModal(null)} isRequired={modal.isRequired} />}

        {scorePopup !== null && <ScorePopup delta={scorePopup} onDone={() => setScorePopup(null)} />}
      </div>
    </>
  );
}
