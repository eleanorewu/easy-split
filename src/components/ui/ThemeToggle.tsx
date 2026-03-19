import { Moon, Sun } from 'lucide-react';
import { useStore } from '../../store/useStore';

export function ThemeToggle() {
  const theme = useStore(state => state.theme);
  const toggleTheme = useStore(state => state.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full bg-apple-bg dark:bg-black/50 text-gray-500 hover:text-apple-blue-heavy transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm active:scale-95 outline-none"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
