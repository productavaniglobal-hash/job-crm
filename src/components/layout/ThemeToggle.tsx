"use client"

import { useUI, ColorTheme } from "@/components/providers/UIProvider"
import { Sun, CloudSun, Cloudy, Moon, MoonStar } from "lucide-react"

// Rotation order: White → Slate → Gray → Blue → Black → White → ...
const THEMES: ColorTheme[] = ['white', 'slate', 'gray', 'blue', 'black']

const THEME_META: Record<ColorTheme, { icon: React.ElementType; label: string }> = {
    white: { icon: Sun, label: 'White' },
    slate: { icon: CloudSun, label: 'Slate' },
    gray: { icon: Cloudy, label: 'Gray' },
    blue: { icon: Moon, label: 'Blue' },
    black: { icon: MoonStar, label: 'Black' },
}

export function ThemeToggle() {
    const { colorTheme, setColorTheme } = useUI()

    const currentIndex = THEMES.indexOf(colorTheme)
    const nextIndex = (currentIndex + 1) % THEMES.length
    const nextTheme = THEMES[nextIndex]
    const CurrentIcon = THEME_META[colorTheme]?.icon ?? Sun

    return (
        <button
            onClick={() => setColorTheme(nextTheme)}
            title={`${THEME_META[colorTheme]?.label ?? colorTheme} → click for ${THEME_META[nextTheme].label}`}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-black/5 dark:hover:bg-white/10"
        >
            <CurrentIcon className="w-[18px] h-[18px] text-slate-500 dark:text-muted-foreground transition-all duration-300" />
            <span className="sr-only">
                Current: {THEME_META[colorTheme]?.label}. Click to switch to {THEME_META[nextTheme].label}
            </span>
        </button>
    )
}
