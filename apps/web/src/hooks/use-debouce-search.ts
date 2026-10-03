import { useEffect, useState } from "react";

export const useDebounceSearch = ({
  query,
  delay = 800,
}: {
  query: string;
  delay?: number;
}) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, delay]);

  return debouncedQuery;
};
