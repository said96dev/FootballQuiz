import axios from "axios";

const baseUrl = "https://sofascore.p.rapidapi.com";
const API_KEY = "3bd124bdc6msh2c0a3685a39e8f2p16f5d7jsnf166efa981b4";

export const fetchTeamsData = async (teamId: string) => {
  const { data } = await axios.get(
    `${baseUrl}/teams/get-squad?teamId=${teamId}`,
    {
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "sofascore.p.rapidapi.com",
      },
    },
  );
  return data;
};
