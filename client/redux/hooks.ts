import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "./features/apiSlice";
import type { AppDispatch, RootState } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useAuth = () => {
  const user = useAppSelector((state) => state.auth.user);
  const sessionReady = useAppSelector((state) => state.auth.sessionReady);
  const { isLoading, isFetching, isUninitialized } = useGetMeQuery(undefined, {
    skip: !sessionReady,
  });

  const isChecking =
    !sessionReady || isUninitialized || isLoading || (isFetching && !user);

  return {
    user,
    isAuthenticated: !!user,
    isChecking,
    sessionReady,
  };
};

