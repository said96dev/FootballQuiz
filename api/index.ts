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

const TempoDatem: Player[] = [
  {
    id: 839956,
    name: "Erling Haaland",
    shortName: "E. Haaland",
    position: "Forward",
    jerseyNumber: "9",
    height: 194,
    preferredFoot: "Left",
    dateOfBirthTimestamp: 964137600,
    tournament: "Premier League",
    country: {
      name: "Norway",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 934386,
    name: "Jérémy Doku",
    shortName: "J. Doku",
    position: "Forward",
    jerseyNumber: "11",
    height: 173,
    preferredFoot: "Right",
    dateOfBirthTimestamp: 1022457600,
    tournament: "Premier League",
    country: {
      name: "Belgium",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 70996,
    name: "Kevin De Bruyne",
    shortName: "K. De Bruyne",
    position: "Midfielder",
    jerseyNumber: "17",
    height: 181,
    preferredFoot: "Right",
    dateOfBirthTimestamp: 678067200,
    tournament: "Premier League",
    country: {
      name: "Belgium",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 859765,
    name: "Phil Foden",
    shortName: "P. Foden",
    position: "Midfielder",
    jerseyNumber: "47",
    height: 171,
    preferredFoot: "Left",
    dateOfBirthTimestamp: 959472000,
    tournament: "Premier League",
    country: {
      name: "England",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 827606,
    name: "Rodri",
    shortName: "Rodri",
    position: "Midfielder",
    jerseyNumber: "16",
    height: 191,
    preferredFoot: "Right",
    dateOfBirthTimestamp: 835401600,
    tournament: "Premier League",
    country: {
      name: "Spain",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 45853,
    name: "İlkay Gündoğan",
    shortName: "İ. Gündoğan",
    position: "Midfielder",
    jerseyNumber: "19",
    height: 180,
    preferredFoot: "Right",
    dateOfBirthTimestamp: 656726400,
    tournament: "Premier League",
    country: {
      name: "Germany",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 331209,
    name: "Bernardo Silva",
    shortName: "B. Silva",
    position: "Midfielder",
    jerseyNumber: "20",
    height: 173,
    preferredFoot: "Left",
    dateOfBirthTimestamp: 776476800,
    tournament: "Premier League",
    country: {
      name: "Portugal",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 189061,
    name: "Jack Grealish",
    shortName: "J. Grealish",
    position: "Midfielder",
    jerseyNumber: "10",
    height: 180,
    preferredFoot: "Right",
    dateOfBirthTimestamp: 810691200,
    tournament: "Premier League",
    country: {
      name: "England",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 136710,
    name: "Mateo Kovačić",
    shortName: "M. Kovačić",
    position: "Midfielder",
    jerseyNumber: "8",
    height: 178,
    preferredFoot: "Right",
    dateOfBirthTimestamp: 768182400,
    tournament: "Premier League",
    country: {
      name: "Croatia",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 1046795,
    name: "Savinho",
    shortName: "Savinho",
    position: "Midfielder",
    jerseyNumber: "26",
    height: 176,
    preferredFoot: "Left",
    dateOfBirthTimestamp: 1081555200,
    tournament: "Premier League",
    country: {
      name: "Brazil",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 945122,
    name: "Matheus Nunes",
    shortName: "M. Nunes",
    position: "Midfielder",
    jerseyNumber: "27",
    height: 183,
    preferredFoot: "Right",
    dateOfBirthTimestamp: 904176000,
    tournament: "Premier League",
    country: {
      name: "Portugal",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 1136731,
    name: "Rico Lewis",
    shortName: "R. Lewis",
    position: "Midfielder",
    jerseyNumber: "82",
    height: 170,
    preferredFoot: "Right",
    dateOfBirthTimestamp: 1100995200,
    tournament: "Premier League",
    country: {
      name: "England",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 1065216,
    name: "Oscar Bobb",
    shortName: "O. Bobb",
    position: "Midfielder",
    jerseyNumber: "52",
    height: 174,
    preferredFoot: "Left",
    dateOfBirthTimestamp: 1057968000,
    tournament: "Premier League",
    country: {
      name: "Norway",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 1003334,
    name: "James McAtee",
    shortName: "J. Mcatee",
    position: "Midfielder",
    jerseyNumber: "87",
    height: 180,
    preferredFoot: "Left",
    dateOfBirthTimestamp: 1034899200,
    tournament: "Premier League",
    country: {
      name: "England",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 964994,
    name: "Joško Gvardiol",
    shortName: "J. Gvardiol",
    position: "Defender",
    jerseyNumber: "24",
    height: 186,
    preferredFoot: "Left",
    dateOfBirthTimestamp: 1011744000,
    tournament: "Premier League",
    country: {
      name: "Croatia",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 318941,
    name: "Rúben Dias",
    shortName: "R. Dias",
    position: "Defender",
    jerseyNumber: "3",
    height: 188,
    preferredFoot: "Right",
    dateOfBirthTimestamp: 863568000,
    tournament: "Premier League",
    country: {
      name: "Portugal",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 44614,
    name: "Kyle Walker",
    shortName: "K. Walker",
    position: "Defender",
    jerseyNumber: "2",
    height: 183,
    preferredFoot: "Right",
    dateOfBirthTimestamp: 643852800,
    tournament: "Premier League",
    country: {
      name: "England",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 152077,
    name: "John Stones",
    shortName: "J. Stones",
    position: "Defender",
    jerseyNumber: "5",
    height: 188,
    preferredFoot: "Right",
    dateOfBirthTimestamp: 770083200,
    tournament: "Premier League",
    country: {
      name: "England",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 149663,
    name: "Nathan Aké",
    shortName: "N. Aké",
    position: "Defender",
    jerseyNumber: "6",
    height: 180,
    preferredFoot: "Left",
    dateOfBirthTimestamp: 793065600,
    tournament: "Premier League",
    country: {
      name: "Netherlands",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 383560,
    name: "Manuel Akanji",
    shortName: "M. Akanji",
    position: "Defender",
    jerseyNumber: "25",
    height: 187,
    preferredFoot: "Right",
    dateOfBirthTimestamp: 806112000,
    tournament: "Premier League",
    country: {
      name: "Switzerland",
    },
    team: {
      name: "Manchester City",
    },
  },
  {
    id: 1017915,
    name: "Josh Wilson-Esbrand",
    shortName: "J. Wilson-Esbrand",
    position: "Defender",
    jerseyNumber: "5",
    height: 176,
    preferredFoot: "Left",
    dateOfBirthTimestamp: 1040860800,
    tournament: "Premier League",
    country: {
      name: "England",
    },
    team: {
      name: "Manchester City",
    },
  },
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
