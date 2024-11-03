import { useAuth } from '@/contexts/AuthContext';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

interface AuthCheckProps {
  children: React.ReactNode;
}

export function AuthCheck({ children }: AuthCheckProps) {
  const { user, loading, signInAnonymously } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      signInAnonymously().catch(console.error);
    }
  }, [loading, user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
