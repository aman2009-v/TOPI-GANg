(function () {
  const lines = [
    "TOPI GANG SECURE TERMINAL v2.7",
    "Initializing Core Modules...",
    "Loading Encryption Engine...",
    "Verifying Security Protocols...",
    "Connecting To Secure Network...",
    "Loading Personnel Database...",
    "Decrypting Mission Archives...",
    "Establishing Secure Channel...",
    "System Status : ONLINE",
    "Ready.",
  ];

  async function typeLine(container, text) {
    const line = document.createElement("div");
    line.className = "boot-line";
    container.appendChild(line);
    for (const char of text) {
      line.textContent += char;
      if (char !== " ") window.Topi.beep("tick");
      await window.Topi.wait(16 + Math.random() * 18);
    }
    line.classList.remove("boot-line");
    await window.Topi.wait(120);
  }

  async function start() {
    await window.Topi.loadMembers();
    window.Topi.clearSession();
    window.Topi.showScreen("powerScreen");
    await window.Topi.wait(2600);

    window.Topi.showScreen("bootScreen");
    const bootLines = document.getElementById("bootLines");
    bootLines.textContent = "";
    for (const line of lines) await typeLine(bootLines, line);

    await window.Topi.wait(400);
    window.Topi.showScreen("loginScreen");
    document.getElementById("memberId")?.focus();
  }

  document.addEventListener("DOMContentLoaded", start);
})();
