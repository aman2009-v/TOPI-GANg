(function () {
  const Topi = (window.Topi = window.Topi || {});
  let failedAttempts = Number(localStorage.getItem("topiGangFailedAttempts") || "0");

  function setAttemptText() {
    const attempt = document.getElementById("attemptNumber");
    if (attempt) attempt.textContent = `Attempt #${String(Math.max(failedAttempts, 1)).padStart(2, "0")}`;
  }

  async function showDenied() {
    setAttemptText();
    Topi.beep("error");
    Topi.showScreen("deniedScreen");
    if (failedAttempts >= 3) {
      await Topi.wait(900);
      const copy = document.querySelector(".denied-copy");
      const event = document.createElement("p");
      event.textContent = "FAKE HACK DETECTED // COUNTERMEASURES ARMED";
      copy?.appendChild(event);
    }
    await Topi.wait(3100);
    Topi.showScreen("loginScreen");
    document.getElementById("password").value = "";
    document.getElementById("password").focus();
  }

  async function handleLogin(event) {
    event.preventDefault();
    const members = await Topi.loadMembers();
    const memberId = document.getElementById("memberId").value.trim().toUpperCase();
    const password = document.getElementById("password").value;
    const member = members.find((item) => item.memberId.toUpperCase() === memberId && item.password === password);

    if (!member) {
      failedAttempts += 1;
      localStorage.setItem("topiGangFailedAttempts", String(failedAttempts));
      await showDenied();
      return;
    }

    failedAttempts = 0;
    localStorage.setItem("topiGangFailedAttempts", "0");
    Topi.pendingMember = member;
    Topi.beep("success");
    await Topi.runBiometrics(member);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
  });
})();
