import { TempoDaten } from "@/db/data";
import axios from "axios";

export interface Player {
  id: number;
  name: string;
  shortName: string;
  position: string;
  jerseyNumber: string;
  height: number;
  preferredFoot: string;
  dateOfBirthTimestamp: number;
  country: {
    name: string;
  };
  team: {
    name: string;
  };
  tournament: string;
}
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const XRapidAPIHost = process.env.NEXT_PUBLIC_XRAPIDAPI_HOST;

const TEAM_IDS: { [key: string]: number } = {
  /*   "Manchester City": 17,
  "Bayern Munich": 2672,
  "Real Madrid": 2829,
  Barcelona: 2817,
  Arsenal: 42, */
  "Manchester United": 35,
  "Inter Milan": 2697,
  PSG: 1644,
  Chelsea: 38,
  Tottenham: 33,
};

const POSITION_MAP: { [key: string]: string } = {
  F: "Forward",
  M: "Midfielder",
  D: "Defender",
  G: "Goalkeeper",
};

const TOP_LEAGUES = [
  "Premier League",
  "LaLiga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
];

export const fetchTeamsData = async (): Promise<Player[]> => {
  /*   try {
    const requests = Object.entries(TEAM_IDS).map(
      async ([teamName, teamId]) => {
        const response = await axios.get(
          `${baseUrl}/teams/get-squad/?teamId=${teamId}`,
          {
            headers: {
              "X-RapidAPI-Key": API_KEY,
              "X-RapidAPI-Host": XRapidAPIHost,
            },
          },
        );
        return response.data.players
          .filter(
            (playerData: any) =>
              playerData.player &&
              playerData.player.position !== "G" &&
              TOP_LEAGUES.includes(playerData.player.team?.tournament?.name),
          )
          .map((playerData: any) => {
            const position = playerData.player.position || "Unknown";
            const fullPosition = POSITION_MAP[position] || position;
            return {
              id: playerData.player.id || 0,
              name: playerData.player.name || "Unknown",
              shortName: playerData.player.shortName || "Unknown",
              position: fullPosition,
              jerseyNumber: playerData.player.jerseyNumber || "N/A",
              height: playerData.player.height || 0,
              preferredFoot: playerData.player.preferredFoot || "Unknown",
              dateOfBirthTimestamp: playerData.player.dateOfBirthTimestamp || 0,
              tournament: playerData.player.team?.tournament?.name || "Unknown",
              country: {
                name: playerData.player.country?.name || "Unknown",
              },
              team: {
                name: teamName,
              },
            };
          });
      },
    );

    const results = await Promise.all(requests);
    return results.flat();
  } catch (error) {
    console.error("Error fetching player data:", error);
    return [];
  } */

  return TempoDaten;
};
