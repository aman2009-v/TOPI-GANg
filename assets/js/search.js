(function () {
  const Topi = (window.Topi = window.Topi || {});

  function createResult(member, isSelf) {
    const card = document.createElement("article");
    card.className = "result-card";
    const image = document.createElement("img");
    image.src = isSelf ? member.profileImage : member.silhouetteImage;
    image.alt = isSelf ? `${member.name} profile image` : `${member.codeName} silhouette`;

    const content = document.createElement("div");
    const label = document.createElement("span");
    label.textContent = isSelf ? "FULL PROFILE AVAILABLE" : "MASKED RESULT";
    const title = document.createElement("h3");
    title.textContent = isSelf ? member.name : Topi.maskName(member.name);
    const details = document.createElement("p");
    details.textContent = `${member.memberId} // ${member.rank} // ${member.status}`;
    content.append(label, title, details);
    card.append(image, content);
    card.addEventListener("click", () => {
      Topi.renderDashboardMember(member, { full: isSelf });
      Topi.beep(isSelf ? "success" : "scan");
    });
    return card;
  }

  function renderSearch(query) {
    const grid = document.getElementById("profileGrid");
    const results = document.getElementById("searchResults");
    if (!grid || !results) return;
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      Topi.renderDashboardMember(Topi.currentMember, { full: true });
      return;
    }

    const matches = Topi.members
      .filter((member) => member.memberId.toLowerCase().includes(normalized) || member.name.toLowerCase().includes(normalized))
      .slice(0, 8);

    grid.hidden = true;
    results.hidden = false;
    results.textContent = "";
    document.getElementById("fileVisibility").textContent = "SEARCH RESULTS";

    if (!matches.length) {
      const empty = document.createElement("article");
      empty.className = "profile-item";
      empty.textContent = "No matching personnel records located.";
      results.appendChild(empty);
      return;
    }

    matches.forEach((member) => {
      results.appendChild(createResult(member, member.memberId === Topi.currentMember.memberId));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const search = document.getElementById("memberSearch");
    if (!search) return;
    search.addEventListener("input", (event) => renderSearch(event.target.value));
  });
})();
