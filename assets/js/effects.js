(function () {
  const Topi = (window.Topi = window.Topi || {});
  const SESSION_KEY = "topiGangSession";
  const SOUND_KEY = "topiGangSound";
  let audioContext = null;

  Topi.sessionKey = SESSION_KEY;

  Topi.showScreen = function showScreen(id) {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.toggle("is-active", screen.id === id);
    });
  };

  Topi.wait = function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  Topi.loadMembers = async function loadMembers() {
    if (Array.isArray(Topi.members)) return Topi.members;
    try {
      const response = await fetch("data/members.json", { cache: "no-store" });
      if (response.ok) {
        Topi.members = await response.json();
        return Topi.members;
      }
    } catch (error) {
      console.warn("Falling back to inline member data.", error);
    }
    Topi.members = Array.isArray(window.TOPI_MEMBERS) ? window.TOPI_MEMBERS : [];
    return Topi.members;
  };

  Topi.getSession = function getSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
      const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
      return session && session.memberId ? session : null;
    } catch {
      return null;
    }
  };

  Topi.setSession = function setSession(member) {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ memberId: member.memberId, loginAt: new Date().toISOString() }),
    );
  };

  Topi.clearSession = function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  };

  Topi.isSoundEnabled = function isSoundEnabled() {
    return localStorage.getItem(SOUND_KEY) === "on";
  };

  Topi.setSoundEnabled = function setSoundEnabled(enabled) {
    localStorage.setItem(SOUND_KEY, enabled ? "on" : "off");
    document.querySelectorAll("#soundToggle").forEach((button) => {
      button.setAttribute("aria-pressed", String(enabled));
      button.textContent = enabled ? "SOUND ON" : "SOUND OFF";
    });
  };

  Topi.beep = function beep(type = "tick") {
    if (!Topi.isSoundEnabled()) return;
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const tones = {
      tick: [520, 0.035],
      success: [920, 0.16],
      error: [150, 0.25],
      scan: [680, 0.08],
    };
    const [frequency, duration] = tones[type] || tones.tick;
    oscillator.frequency.value = frequency;
    oscillator.type = type === "error" ? "sawtooth" : "sine";
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.02);
  };

  Topi.maskName = function maskName(name) {
    return String(name)
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => {
        if (part.length <= 2) return `${part[0] || ""}*`;
        return `${part.slice(0, 2).toUpperCase()}${"*".repeat(Math.max(3, part.length - 2))}`;
      })
      .join(" ");
  };

  Topi.hashSignature = function hashSignature(text) {
    let hash = 2166136261;
    for (const char of String(text)) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return `SIG-${(hash >>> 0).toString(16).toUpperCase().padStart(8, "0")}`;
  };

  Topi.safeText = function safeText(value, fallback = "CLASSIFIED") {
    const text = String(value ?? "").trim();
    return text || fallback;
  };

  document.addEventListener("DOMContentLoaded", () => {
    Topi.setSoundEnabled(Topi.isSoundEnabled());
    document.querySelectorAll("#soundToggle").forEach((button) => {
      button.addEventListener("click", () => {
        Topi.setSoundEnabled(!Topi.isSoundEnabled());
        Topi.beep("success");
      });
    });
  });
})();
