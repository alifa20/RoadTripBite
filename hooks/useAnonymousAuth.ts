import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export const useAnonymousAuth = () => {
  const { signInAnonymously, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const authenticateAnonymously = async () => {
      try {
        if (!user) {
          await signInAnonymously();
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to sign in anonymously")
        );
      } finally {
        setLoading(false);
      }
    };

    authenticateAnonymously();
  }, [signInAnonymously, user]);

  return { loading, error, user };
};
