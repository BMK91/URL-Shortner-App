import { useSelector } from "react-redux";

export function useAuth() {
  const user = useSelector((state) => state.user);

  return {
    ...user,
  };
}
