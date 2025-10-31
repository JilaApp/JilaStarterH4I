import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    const userType = user.publicMetadata?.userType;
    if (userType !== "admin") {
      router.push("/sign-in");
      return;
    }
  }, [isLoaded, user, router]);
  return <>{isLoaded && user && children}</>;
};

export default AuthWrapper;
