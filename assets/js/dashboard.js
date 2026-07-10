(function () {
  const Topi = (window.Topi = window.Topi || {});
  const profileFields = [
    ["Full Name", "name"],
    ["Code Name", "codeName"],
    ["Member ID", "memberId"],
    ["Rank", "rank"],
    ["Division", "division"],
    ["Clearance Level", "clearanceLevel"],
    ["Date of Birth", "dateOfBirth"],
    ["Blood Group", "bloodGroup"],
    ["Class", "class"],
    ["School", "school"],
    ["Contact Number", "phone"],
    ["Email", "email"],
    ["Address", "address"],
    ["Joining Date", "joiningDate"],
    ["Interests", "interests"],
    ["Speciality", "speciality"],
    ["Current Status", "status"],
    ["Mission Count", "missionCount"],
    ["Awards & Badges", "awards"],
    ["Personal Notes", "notes"],
  ];

  const characterThemes = [
    {
      match: "yuta",
      accent: "#8f5cff",
      accent2: "#21102f",
      glow: "rgba(143, 92, 255, 0.42)",
      kanji: "乙骨",
      title: "YUTA REFERENCE",
      quote: "BLACK AND DARK PURPLE CLEARANCE",
    },
    {
      match: "giyu",
      accent: "#6f95ff",
      accent2: "#07162d",
      glow: "rgba(111, 149, 255, 0.42)",
      kanji: "水",
      title: "GIYU REFERENCE",
      quote: "BLACK AND BLUE CLEARANCE",
    },
    {
      match: "yorichi",
      accent: "#ff5a1f",
      accent2: "#2c1305",
      glow: "rgba(255, 90, 31, 0.4)",
      kanji: "日",
      title: "YORIICHI REFERENCE",
      quote: "BLACK AND SUN FLAME CLEARANCE",
    },
    {
      match: "yoriichi",
      accent: "#ff5a1f",
      accent2: "#2c1305",
      glow: "rgba(255, 90, 31, 0.4)",
      kanji: "日",
      title: "YORIICHI REFERENCE",
      quote: "BLACK AND SUN FLAME CLEARANCE",
    },
    {
      match: "baki",
      accent: "#ff4c4c",
      accent2: "#260708",
      glow: "rgba(255, 76, 76, 0.38)",
      kanji: "力",
      title: "BAKI REFERENCE",
      quote: "BLACK AND CRIMSON CLEARANCE",
    },
    {
      match: "inosuke",
      accent: "#42d6ff",
      accent2: "#061e24",
      glow: "rgba(66, 214, 255, 0.38)",
      kanji: "獣",
      title: "INOSUKE REFERENCE",
      quote: "BLACK AND BEAST BLUE CLEARANCE",
    },
    {
      match: "thorfin",
      accent: "#d2b46c",
      accent2: "#20180a",
      glow: "rgba(210, 180, 108, 0.34)",
      kanji: "北",
      title: "THORFINN REFERENCE",
      quote: "BLACK AND VINLAND GOLD CLEARANCE",
    },
    {
      match: "thorfinn",
      accent: "#d2b46c",
      accent2: "#20180a",
      glow: "rgba(210, 180, 108, 0.34)",
      kanji: "北",
      title: "THORFINN REFERENCE",
      quote: "BLACK AND VINLAND GOLD CLEARANCE",
    },
  ];

  function slithousePath(member) {
    return `assets/images/slithouse/${member.memberId}.png`;
  }

  function applyMemberTheme(member) {
    const reference = `${member.characterReference || ""} ${member.codeName || ""} ${member.name || ""}`.toLowerCase();
    const theme = characterThemes.find((item) => reference.includes(item.match)) || {
      accent: "#00f0ff",
      accent2: "#061616",
      glow: "rgba(0, 240, 255, 0.36)",
      kanji: "TG",
      title: "TOPI GANG",
      quote: "BLACK CLEARANCE",
    };
    const root = document.documentElement;
    root.style.setProperty("--member-accent", theme.accent);
    root.style.setProperty("--member-accent-2", theme.accent2);
    root.style.setProperty("--member-glow", theme.glow);
    document.body.dataset.memberTheme = member.memberId;
    const identityPanel = document.getElementById("identityPanel");
    if (identityPanel) {
      identityPanel.dataset.kanji = theme.kanji;
      identityPanel.dataset.themeTitle = theme.title;
      identityPanel.dataset.themeQuote = theme.quote;
    }
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = window.Topi.safeText(value);
  }

  function renderQr(memberId) {
    const qr = document.getElementById("qrCode");
    if (!qr) return;
    qr.textContent = "";
    let hash = 0;
    for (const char of memberId) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
    for (let index = 0; index < 81; index += 1) {
      const cell = document.createElement("i");
      if (((hash >> (index % 24)) + index + Math.floor(index / 9)) % 3 !== 0) cell.className = "on";
      qr.appendChild(cell);
    }
  }

  function renderProfile(member, visibility = "FULL PROFILE") {
    const grid = document.getElementById("profileGrid");
    const searchResults = document.getElementById("searchResults");
    if (!grid) return;
    grid.hidden = false;
    if (searchResults) searchResults.hidden = true;
    document.getElementById("fileVisibility").textContent = visibility;
    grid.textContent = "";

    profileFields.forEach(([label, key]) => {
      const item = document.createElement("article");
      item.className = "profile-item";
      const labelEl = document.createElement("span");
      labelEl.textContent = label;
      const valueEl = document.createElement("strong");
      const value = Array.isArray(member[key]) ? member[key].join(", ") : member[key];
      valueEl.textContent = window.Topi.safeText(value);
      item.append(labelEl, valueEl);
      grid.appendChild(item);
    });
  }

  function statCard(label, value, suffix = "%") {
    const card = document.createElement("article");
    card.className = "stat-card";
    const ring = document.createElement("div");
    ring.className = "ring";
    const percent = Math.max(0, Math.min(100, Number(value) || 0));
    ring.style.setProperty("--value", percent);
    ring.textContent = `${value}${suffix}`;
    const caption = document.createElement("span");
    caption.textContent = label;
    card.append(ring, caption);
    return card;
  }

  function renderStats(member) {
    const grid = document.getElementById("statsGrid");
    if (!grid) return;
    grid.textContent = "";
    grid.append(
      statCard("Mission Success Rate", member.missionSuccessRate),
      statCard("Security Score", member.securityScore),
      statCard("Clearance Progress", member.clearanceProgress),
      statCard("Activity Level", member.activityLevel),
    );
    setText("rankBadge", `${member.rank} // ${member.experiencePoints} XP`);
  }

  Topi.renderDashboardMember = function renderDashboardMember(member, options = {}) {
    Topi.displayedMember = member;
    const full = options.full !== false;
    applyMemberTheme(member);
    const photo = document.getElementById("memberPhoto");
    if (photo) {
      const fallback = full ? member.silhouetteImage : member.silhouetteImage;
      photo.onerror = () => {
        photo.onerror = null;
        photo.src = fallback;
      };
      photo.src = full ? slithousePath(member) : member.silhouetteImage;
      photo.alt = full ? `${member.name} slithouse portrait` : `${member.codeName} silhouette`;
    }
    setText("memberNameStroke", full ? member.name : Topi.maskName(member.name));
    setText("memberIdBadge", member.memberId);
    setText("memberCodeName", full ? member.codeName : Topi.maskName(member.name));
    setText("memberRank", member.rank);
    setText("memberClearance", member.clearanceLevel);
    setText("memberStatus", member.status);
    setText("digitalSignature", Topi.hashSignature(`${member.memberId}:${member.codeName}`));
    renderQr(member.memberId);
    renderProfile(member, full ? "FULL PROFILE" : "MASKED PROFILE");
    renderStats(member);
  };

  async function initializeDashboard() {
    const isDashboardLike = document.querySelector(".dashboard-shell") || document.body.classList.contains("terminal-page");
    if (!isDashboardLike) return;
    const members = await Topi.loadMembers();
    const session = Topi.getSession();
    if (!session && !document.body.classList.contains("terminal-page")) {
      window.location.href = "index.html";
      return;
    }
    const member = members.find((item) => item.memberId === session?.memberId) || members[0];
    Topi.members = members;
    Topi.currentMember = member;
    if (document.querySelector(".dashboard-shell")) Topi.renderDashboardMember(member, { full: true });

    document.getElementById("logoutButton")?.addEventListener("click", () => {
      Topi.clearSession();
      Topi.beep("error");
      window.location.href = "index.html";
    });
  }

  document.addEventListener("DOMContentLoaded", initializeDashboard);
})();
