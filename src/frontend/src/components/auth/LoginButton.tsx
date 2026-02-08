import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { useMode } from '../../context/ModeContext';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { mode } = useMode();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const isKidsMode = mode === 'kids';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={disabled}
      size={isKidsMode ? 'lg' : 'default'}
      variant={isAuthenticated ? 'outline' : 'default'}
      className={isKidsMode ? 'text-lg font-bold px-6' : ''}
    >
      {disabled ? (
        <>
          <Loader2 className={`${isKidsMode ? 'w-6 h-6' : 'w-4 h-4'} mr-2 animate-spin`} />
          {isKidsMode ? 'Logging in...' : 'Loading...'}
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className={`${isKidsMode ? 'w-6 h-6' : 'w-4 h-4'} mr-2`} />
          {isKidsMode ? 'Sign Out' : 'Logout'}
        </>
      ) : (
        <>
          <LogIn className={`${isKidsMode ? 'w-6 h-6' : 'w-4 h-4'} mr-2`} />
          {isKidsMode ? 'Start Adventure' : 'Login'}
        </>
      )}
    </Button>
  );
}
