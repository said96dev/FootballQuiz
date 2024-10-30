import axios from "axios";

interface Player {
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
}
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const XRapidAPIHost = process.env.NEXT_PUBLIC_XRAPIDAPI_HOST;

const TEAM_IDS: { [key: string]: number } = {
  "Manchester City": 17,
  "Manchester United": 35,
  Barcelona: 2817,
  "Real Madrid": 2829,
  Arsenal: 42,
  /*  
  Chelsea: 38,
  Tottenham: 33,
  "Inter Milan": 2697,
  PSG: 1644,
  "Bayern Munich": 2672, */
};

const POSITION_MAP: { [key: string]: string } = {
  F: "Forward",
  M: "Midfielder",
  D: "Defender",
  G: "Goalkeeper",
};

export const fetchTeamsData = async (): Promise<Player[]> => {
  try {
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
          .filter((playerData: any) => playerData.player.position !== "G")
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
  }
};
