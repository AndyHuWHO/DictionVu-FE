// hooks/useSearchAction.ts
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { addSearch } from "@/redux/features/recentSearchSlice";


export function useSearchAction() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const performSearch = useCallback(
    (term: string) => {
        const normalized = term.trim().toLowerCase();
        if (!normalized) {
          return;
        }

        dispatch(addSearch(normalized));
        const route = { pathname: "/diction/[term]", params: { term:normalized } };
        router.dismissAll();
        router.push(route);
    },
    [dispatch, router]
  )


  return { performSearch };
}