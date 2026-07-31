import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";

export function useAuth() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => AuthService.getCurrentUser(),
    enabled: !!token,
    retry: 1
  });

  return {
    user,
    token,
    isLoading,
    isError,
    isAuthenticated: !!user && !!token,
  };
}
