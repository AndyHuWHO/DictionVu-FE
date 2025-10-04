// hooks/useSearchAction.ts
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "expo-router";
import { useCallback } from "react";

export function useSearchAction() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const performSearch = useCallback(
    (term: string) => {
      const normalized = term.trim().toLowerCase();
      if (!normalized) {
        return;
      }

      // const route = {
      //   pathname: "/diction/[term]",
      //   params: { term: normalized },
      // };
      // router.replace(route);

      router.back();
      // router.push("/(tabs)/diction");
      setTimeout(() => {
        router.push({
          pathname: "/(tabs)/diction/(word-result)/[term]",
          params: { term: normalized },
        });
      }, 0);
    },
    [dispatch, router]
  );

  return { performSearch };
}
