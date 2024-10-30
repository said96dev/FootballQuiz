import { useQuery } from "@tanstack/react-query";
import { fetchTeamsData } from "./index";

export const useGetTeamData = () => {
  return useQuery({
    queryKey: ["team"],
    queryFn: () => fetchTeamsData(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
