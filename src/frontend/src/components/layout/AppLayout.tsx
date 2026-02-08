import { ReactNode } from 'react';
import { useMode } from '../../context/ModeContext';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, Store, Settings, Shield, Sparkles } from 'lucide-react';
import AppLogo from '../branding/AppLogo';
import LoginButton from '../auth/LoginButton';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { mode } = useMode();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  const isKidsMode = mode === 'kids';

  return (
    <div className={`min-h-screen ${isKidsMode ? 'bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950 dark:via-orange-950 dark:to-rose-950' : 'bg-background'}`}>
      <header className={`border-b ${isKidsMode ? 'border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm' : 'border-border bg-background'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AppLogo size={isKidsMode ? 'lg' : 'md'} />
            {identity && (
              <nav className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size={isKidsMode ? 'lg' : 'default'}
                  onClick={() => navigate({ to: isKidsMode ? '/kids' : '/adults' })}
                  className={isKidsMode ? 'text-lg font-bold' : ''}
                >
                  <Home className={isKidsMode ? 'w-6 h-6 mr-2' : 'w-4 h-4 mr-2'} />
                  {isKidsMode ? 'Quests' : 'Dashboard'}
                </Button>
                <Button
                  variant="ghost"
                  size={isKidsMode ? 'lg' : 'default'}
                  onClick={() => navigate({ to: '/store' })}
                  className={isKidsMode ? 'text-lg font-bold' : ''}
                >
                  <Store className={isKidsMode ? 'w-6 h-6 mr-2' : 'w-4 h-4 mr-2'} />
                  {isKidsMode ? 'Treasure Shop' : 'Store'}
                </Button>
                <Button
                  variant="ghost"
                  size={isKidsMode ? 'lg' : 'default'}
                  onClick={() => navigate({ to: '/parent' })}
                  className={isKidsMode ? 'text-lg font-bold' : ''}
                >
                  <Shield className={isKidsMode ? 'w-6 h-6 mr-2' : 'w-4 h-4 mr-2'} />
                  {isKidsMode ? 'Parent Zone' : 'Admin'}
                </Button>
              </nav>
            )}
          </div>
          <div className="flex items-center gap-3">
            {identity && (
              <Button
                variant="ghost"
                size={isKidsMode ? 'lg' : 'default'}
                onClick={() => navigate({ to: '/settings' })}
              >
                <Settings className={isKidsMode ? 'w-6 h-6' : 'w-4 h-4'} />
              </Button>
            )}
            <LoginButton />
          </div>
        </div>
      </header>
      <main className={isKidsMode ? 'container mx-auto px-4 py-8' : 'container mx-auto px-4 py-6'}>
        {children}
      </main>
      <footer className={`border-t mt-12 ${isKidsMode ? 'border-amber-200 dark:border-amber-800 bg-white/60 dark:bg-gray-900/60' : 'border-border bg-muted/30'}`}>
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            © 2026. Built with <Sparkles className="w-4 h-4 text-amber-500" /> using{' '}
            <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
