import { useQuery } from "@tanstack/react-query";
import { fetchTeamsData } from "./index";

export const useGetTeamData = (teamId: string) => {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: () => fetchTeamsData(teamId),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
