import { useContext } from 'react';

import { AuthContext } from '@/provider/auth-provider';

export function useAuth() {
  return useContext(AuthContext);
}
