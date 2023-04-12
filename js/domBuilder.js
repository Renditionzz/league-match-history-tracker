// Build a match container element for each match called
function domBuilder(playerStats) {
  console.log("dombuilder ran");
  document.querySelectorAll(".match").forEach((element) => element.remove());
  for (let i = 0; i < playerStats.length; i++) {
    const stats = playerStats[i];
    createMatchElement(stats);
  }
}

// Builds an individual match element
// TODO: Refactor this function into smaller functions for readability
function createMatchElement(stats) {
  const container = document.querySelector(".container");

  const matchDiv = document.createElement("div");
  matchDiv.classList.add("match");

  const championElement = document.createElement("img");
  championElement.src = `https://raw.communitydragon.org/t/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${stats.championId}.png`;
  championElement.classList.add("champion");

  const statsDiv = document.createElement("div");
  statsDiv.classList.add("stats");

  const matchStateHeading = document.createElement("h2");
  matchStateHeading.classList.add("matchState");

  if (stats.win) {
    matchStateHeading.textContent = "VICTORY";
    matchDiv.classList.add("victory");
    matchStateHeading.classList.add("matchStateVictory");
  } else {
    matchStateHeading.textContent = "DEFEAT";
    matchDiv.classList.add("defeat");
    matchStateHeading.classList.add("matchStateDefeat");
  }

  statsDiv.appendChild(matchStateHeading);

  const kdaParagraph = document.createElement("p");
  kdaParagraph.classList.add("kda");

  for (let i = 0; i < 3; i++) {
    const kda = ["kills", "deaths", "assists"];
    const kdaSpan = document.createElement("span");
    kdaSpan.classList.add(kda[i]);
    if (i == 0) {
      kdaSpan.textContent = stats.kills;
    } else if (i == 1) {
      kdaSpan.textContent = stats.deaths;
    } else {
      kdaSpan.textContent = stats.assists;
    }
    kdaParagraph.appendChild(kdaSpan);
    if (i != 2) {
      const slashNode = document.createTextNode(" / ");
      kdaParagraph.appendChild(slashNode);
    }
  }
  statsDiv.appendChild(kdaParagraph);
  matchDiv.appendChild(championElement);
  matchDiv.appendChild(statsDiv);
  container.appendChild(matchDiv);
}

// Export the functions into axios.js to create DOM elements
export { domBuilder, createMatchElement };
