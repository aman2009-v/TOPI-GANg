(function () {
  const Topi = (window.Topi = window.Topi || {});

  async function animateProgress(options) {
    const { bar, percent, text, doneText, duration } = options;
    const start = performance.now();
    return new Promise((resolve) => {
      function frame(now) {
        const elapsed = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        const value = Math.floor(eased * 100);
        bar.style.width = `${value}%`;
        percent.textContent = `${value}%`;
        if (value % 18 === 0) Topi.beep("scan");
        if (elapsed < 1) {
          requestAnimationFrame(frame);
        } else {
          text.textContent = doneText;
          Topi.beep("success");
          resolve();
        }
      }
      requestAnimationFrame(frame);
    });
  }

  function slithouseOverridePath(member) {
    return `assets/images/slithouse/${member.memberId}.png`;
  }

  Topi.runBiometrics = async function runBiometrics(member) {
    Topi.pendingMember = member;
    Topi.showScreen("fingerprintScreen");
    document.getElementById("fingerprintText").textContent = "SCANNING...";
    await animateProgress({
      bar: document.getElementById("fingerprintBar"),
      percent: document.getElementById("fingerprintPercent"),
      text: document.getElementById("fingerprintText"),
      doneText: "Fingerprint Verified",
      duration: 3000,
    });

    await Topi.wait(420);
    const faceImage = document.getElementById("faceSilhouetteImage");
    const faceTag = document.getElementById("faceIdentityTag");
    if (faceImage) {
      const fallbackImage = member.silhouetteImage;
      faceImage.onerror = () => {
        faceImage.onerror = null;
        faceImage.src = fallbackImage;
      };
      faceImage.src = slithouseOverridePath(member);
      faceImage.alt = `${member.codeName} slithouse scan image`;
    }
    if (faceTag) {
      faceTag.textContent = `DATABASE SILHOUETTE // ${member.characterReference || member.codeName}`;
    }
    Topi.showScreen("faceScreen");
    document.getElementById("faceText").textContent = "ANALYZING FACE...";
    await animateProgress({
      bar: document.getElementById("faceBar"),
      percent: document.getElementById("facePercent"),
      text: document.getElementById("faceText"),
      doneText: "MATCH FOUND // Identity Verified",
      duration: 3000,
    });

    await Topi.wait(360);
    Topi.showScreen("glitchScreen");
    Topi.beep("scan");
    await Topi.wait(1000);
    Topi.showScreen("welcomeScreen");
  };

  async function enterDatabase() {
    const member = Topi.pendingMember;
    if (!member) return;
      Topi.setSession(member);
      Topi.beep("success");
      Topi.showScreen("grantedScreen");
      await Topi.wait(1700);
      window.location.href = "dashboard.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("enterDatabase")?.addEventListener("click", enterDatabase);
  });
})();
