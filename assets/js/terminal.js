(function () {
  const Topi = (window.Topi = window.Topi || {});
  let logoClicks = 0;
  let developerMode = false;
  const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let konamiIndex = 0;

  function outputLine(text) {
    const output = document.getElementById("terminalOutput");
    if (!output) return;
    const line = document.createElement("p");
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function openTerminal() {
    const overlay = document.getElementById("terminalOverlay");
    if (!overlay) return;
    overlay.hidden = false;
    if (!document.getElementById("terminalOutput").childElementCount) {
      outputLine("TOPI GANG TERMINAL v2.7");
      outputLine("Type help for available commands.");
    }
    document.getElementById("terminalInput")?.focus();
    Topi.beep("scan");
  }

  function closeTerminal() {
    const overlay = document.getElementById("terminalOverlay");
    if (overlay && !overlay.classList.contains("is-standalone")) overlay.hidden = true;
  }

  function command(raw) {
    const cmd = raw.trim().toLowerCase();
    const member = Topi.currentMember || {};
    outputLine(`> ${raw}`);
    switch (cmd) {
      case "help":
        outputLine("help, whoami, profile, status, members, rank, clear, logout");
        if (developerMode) outputLine("developer: missions, decrypt, archive");
        break;
      case "whoami":
        outputLine(`Member ID : ${member.memberId || "NO SESSION"}`);
        outputLine(`Rank : ${member.rank || "UNKNOWN"}`);
        outputLine(`Status : ${member.status || "UNKNOWN"}`);
        break;
      case "profile":
        outputLine(`${member.name || "Unknown"} // ${member.codeName || "Unknown"} // Clearance ${member.clearanceLevel || "?"}`);
        break;
      case "status":
        outputLine(`System Status : ONLINE`);
        outputLine(`Security Score : ${member.securityScore || "--"}%`);
        break;
      case "members":
        outputLine((Topi.members || []).map((item) => `${item.memberId} ${Topi.maskName(item.name)} ${item.status}`).join("\n"));
        break;
      case "rank":
        outputLine(`Rank : ${member.rank || "UNKNOWN"} // XP ${member.experiencePoints || 0}`);
        break;
      case "clear":
        document.getElementById("terminalOutput").textContent = "";
        break;
      case "logout":
        Topi.clearSession();
        window.location.href = "index.html";
        break;
      case "missions":
      case "decrypt":
      case "archive":
        outputLine(developerMode ? "CLASSIFIED ARCHIVE: OPERATION NEON TOPI // SEALED" : "ACCESS REQUIRES DEVELOPER MODE");
        break;
      default:
        outputLine(cmd ? "Unknown command. Type help." : "");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("terminalButton")?.addEventListener("click", openTerminal);
    document.getElementById("closeTerminal")?.addEventListener("click", closeTerminal);
    if (document.getElementById("terminalOverlay")?.classList.contains("is-standalone")) openTerminal();

    function submitTerminalCommand(event) {
      event.preventDefault();
      const input = document.getElementById("terminalInput");
      command(input.value);
      input.value = "";
    }

    document.getElementById("terminalForm")?.addEventListener("submit", submitTerminalCommand);
    document.getElementById("terminalInput")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") submitTerminalCommand(event);
    });

    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "t") {
        event.preventDefault();
        openTerminal();
      }
      const expected = konami[konamiIndex];
      konamiIndex = event.key === expected ? konamiIndex + 1 : 0;
      if (konamiIndex === konami.length) {
        developerMode = true;
        konamiIndex = 0;
        document.body.classList.add("developer-mode");
        outputLine("DEVELOPER MODE UNLOCKED");
        Topi.beep("success");
      }
    });

    document.getElementById("logoButton")?.addEventListener("click", () => {
      logoClicks += 1;
      if (logoClicks >= 7) {
        document.getElementById("hiddenPanel").hidden = false;
        openTerminal();
        outputLine("Hidden panel unlocked by logo sequence.");
        logoClicks = 0;
      }
    });
  });
})();
