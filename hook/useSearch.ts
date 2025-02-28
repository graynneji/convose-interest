import { apiInterest } from "@/services/apiInterest";
import { useEffect, useState } from "react";
import { ListType } from "@/app/index";

export function useSearch(query: string) {
  const [response, setResponse] = useState<{ autocomplete?: ListType[] }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    const getSearch = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await apiInterest.get(
          `/autocomplete/interests?q=${query}&limit=12&from=0`
        );
        setResponse(result.data);
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    getSearch();
  }, [query]);
  return { data: response, loading, error };
}
