import { useQuery } from "@tanstack/react-query";
import { getClassCounts } from "@/lib/registration.functions";

export function useRegistrationStatus() {
  return useQuery({
    queryKey: ["class-counts"],
    queryFn: () => getClassCounts(),
    staleTime: 30_000,
  });
}
