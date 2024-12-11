import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function AuthLayout() {
    const { theme, systemTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState<string>("light");

    useEffect(() => {
        if (theme === "system") {
            setCurrentTheme(systemTheme === "dark" ? "dark" : "light");
        } else {
            setCurrentTheme(theme === "dark" ? "dark" : "light");
        }
    }, [theme, systemTheme]);

    return (
        <main className={cn('relative h-screen w-screen bg-cover bg-center ', currentTheme == 'light' ? "bg-[url('/bg_auth.webp')]" : "bg-[url('/bg_auth_dark.webp')]")}>
            <div className="container mx-auto p-2 flex h-full w-full flex-col items-center justify-center relative z-10">
                <Outlet />
            </div>
        </main>
    );
}