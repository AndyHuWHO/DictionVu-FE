// hooks/useSearchAction.ts
import { useRouter } from "expo-router";
import { useCallback } from "react";

export function useSearchAction() {
  const router = useRouter();

  const performSearch = useCallback(
    (term: string,fromSearch: boolean) => {
      const normalized = term.trim().toLowerCase();
      if (!normalized) {
        return;
      }

      if (fromSearch) {
        router.back();
      }

      setTimeout(() => {
        router.push({
          pathname: "/diction/(word-result)/[term]",
          params: { term: normalized },
        });
      }, 0);
    },
    [router]
  );

  return { performSearch };
}
