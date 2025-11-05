// hooks/useSearchAction.ts
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

export function useSearchAction() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useLocalSearchParams();

  const performSearch = useCallback(
    (term: string) => {
      const normalized = term.trim().toLowerCase();
      if (!normalized) {
        return;
      }
      const isFromWordResult = params.from === "word-result";

      // const route = {
      //   pathname: "/diction/[term]",
      //   params: { term: normalized },
      // };
      // router.replace(route);

      router.back();
      setTimeout(() => {
        const action = isFromWordResult ? router.replace : router.push;
        action({
          pathname: "/(tabs)/diction/(word-result)/[term]",
          params: { term: normalized },
        });
      }, 0);
    },
    [dispatch, router]
  );

  return { performSearch };
}
