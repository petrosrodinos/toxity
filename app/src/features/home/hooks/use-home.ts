import { useQuery } from "@tanstack/react-query";
import { get_home_feed } from "../services/home.services";

export const useGetHomeFeed = () => {
    return useQuery({
        queryKey: ["home"],
        queryFn: get_home_feed,
        refetchOnWindowFocus: true,
    });
};
