import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "./features/apiSlice";
import type { AppDispatch, RootState } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useAuth = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { isLoading, isFetching, isUninitialized } = useGetMeQuery();

  const isChecking = isUninitialized || isLoading || (isFetching && !user);

  return {
    user,
    isAuthenticated: !!user,
    isChecking,
  };
};

