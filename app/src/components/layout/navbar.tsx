import { Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandMark } from '@/components/brand/brand-mark';
import { useThemeContext } from '@/components/providers/theme-provider';
import { Routes } from '@/routes/routes';

export default function Navbar() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="bg-surface border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
      <Link to={Routes.home.root} className="min-w-0 rounded-xl transition-opacity hover:opacity-90">
        <BrandMark size="md" />
      </Link>

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="p-2 rounded-lg text-muted hover:bg-surface-secondary hover:text-foreground transition-colors duration-200"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </header>
  );
}
