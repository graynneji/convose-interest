import { apiInterest } from "@/services/apiInterest";
import { useEffect, useState } from "react";
import { ListType } from "@/app/index";
import { useQuery } from "@tanstack/react-query";

export function useSearch(query: string) {
  //using react query to for refetch, caching and effective rendering
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const result = await apiInterest.get(
        `/autocomplete/interests?q=${query}&limit=12&from=0`
      );
      return result.data;
    },
    retry: 1,
  });
  return { data, error, isLoading, isError };
}

// export function useSearch(query: string) {
//   const [response, setResponse] = useState<{ autocomplete?: ListType[] }>({});
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   useEffect(() => {
//     const getSearch = async () => {
//       setIsLoading(true);
//       setError("");
//       try {
//         const result = await apiInterest.get(
//           `/autocomplete/interests?q=${query}&limit=12&from=0`
//         );
//         setResponse(result.data);
//       } catch (err) {
//         setError("Something went wrong");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getSearch();
//   }, [query]);
//   return { data: response, isLoading, error };
// }
