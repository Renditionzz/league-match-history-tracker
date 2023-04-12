import { api, username, amountOfMatches } from "./environment.js";
import { domBuilder, createMatchElement } from "./domBuilder.js";

// Create storage for initial player data to reduce excess calls
let oldMatches;
let oldStats;

// handles all other function calls
async function axiosHandler(username, key) {
  const playerId = await getPlayerId(username, key);

  const matches = await getMatches(playerId, key, amountOfMatches);
  if (oldMatches != matches) {
    const stats = await getPlayerData(playerId, key, matches);
    let oldStats = stats;
    return stats;
  }
  return stats;
}

// Call the handler and domBuilder
async function main() {
  const playerStats = await axiosHandler(username, api);
  domBuilder(playerStats);
}

// Set a 60 second timer for the api calls to reduce excess calls
const timer = 1000 * 60;
main();
setInterval(main, 60000);

// Gets the puuid from the username to access the Match V5 API
async function getPlayerId(username, key) {
  const playerUrl = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${key}`;
  const playerInfo = await axios.get(playerUrl);

  return playerInfo.data.puuid;
}

// Get a list of the matches from the Match V5 API
async function getMatches(puuid, key, count) {
  const matchListUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}&api_key=${key}`;
  const matchListInfo = await axios.get(matchListUrl);
  return matchListInfo.data;
}

// Get the match data from the list of matches
async function getPlayerData(puuid, key, matches) {
  let userStats = [];
  let matchCount = 0;

  for (const match of matches) {
    const participants = await getMatchData(match, key);
    for (const participant of participants) {
      if (participant.puuid == puuid) {
        userStats.push(participant);
      }
    }
  }
  return userStats;
}

// Gets all the game data from a match, and returns the participant data
async function getMatchData(match, key) {
  const matchUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/${match}?api_key=${key}`;
  const matchInfo = await axios.get(matchUrl);

  return matchInfo.data.info.participants;
}
