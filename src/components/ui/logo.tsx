export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
        <span className="text-primary-foreground font-bold text-xl">स</span>
      </div>
      <div>
        <h1 className="text-xl font-bold text-foreground">Smart Saauji | स्मार्ट साहुजी</h1>
        <p className="text-xs text-muted-foreground">Your Digital Shop Partner | तपाईंको डिजिटल पसल साथी</p>
      </div>
    </div>
  );
};