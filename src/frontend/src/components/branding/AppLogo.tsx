interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function AppLogo({ size = 'md' }: AppLogoProps) {
  const dimensions = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  };

  return (
    <div className="flex items-center gap-2">
      <img
        src="/assets/generated/chorequest-logo.dim_512x512.png"
        alt="ChoreQuest"
        className={`${dimensions[size]} w-auto`}
      />
      <span className={`font-bold ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-lg'} bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent`}>
        ChoreQuest
      </span>
    </div>
  );
}
