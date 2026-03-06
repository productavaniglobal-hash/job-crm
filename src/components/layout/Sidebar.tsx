'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, Users, Share2, Kanban, Bell, Inbox, CheckSquare, LineChart, ClipboardList, History, Settings, BellRing, ChevronLeft, ChevronRight, Zap, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
    { name: 'Dashboard', href: '/home', icon: LayoutDashboard },
    { name: 'Attendance', href: '/attendance', icon: ClipboardList },
    { name: 'Inbox', href: '/inbox', icon: Inbox },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Pipeline', href: '/deals', icon: Kanban },
    { name: 'Follow-ups', href: '/follow-ups', icon: BellRing },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Rep Monitor', href: '/reps', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: LineChart },
    { name: 'Forwarded', href: '/forwarded', icon: Share2 },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Lead Logs', href: '/lead-logs', icon: History },
    { name: 'Activity Log', href: '/activity-log', icon: History },
    { name: 'Automations', href: '/settings/automations', icon: Zap },
    { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar({ workspaceName = 'Workspace' }: { workspaceName?: string }) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <motion.aside
            initial={false}
            animate={{
                width: isCollapsed ? '5rem' : '16rem',
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`bg-slate-50/80 dark:bg-sidebar/90 backdrop-blur-xl text-slate-600 dark:text-sidebar-foreground flex flex-col h-full border-r border-gray-200/60 dark:border-white/10 relative z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]`}
        >
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/60 dark:border-white/5 relative overflow-hidden shrink-0">
                <AnimatePresence mode="popLayout">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex items-center gap-2 px-2"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-500 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 truncate max-w-[130px]" title={workspaceName}>
                                {workspaceName}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 transition-colors mx-auto shrink-0 z-10 bg-white/50 dark:bg-black/20 shadow-sm border border-black/5 dark:border-white/5"
                >
                    <motion.div
                        animate={{ rotate: isCollapsed ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </motion.div>
                </motion.button>
            </div>

            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 scrollbar-none px-3 relative">
                {/* Subtle gradient background for nav area */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

                <ul className="grid gap-1.5 relative z-10 w-full">
                    {navItems.map((item) => {
                        const isActive = item.href === '/home'
                            ? pathname === '/home'
                            : pathname.startsWith(item.href)

                        return (
                            <li key={item.name} className="relative group">
                                {isActive && !isCollapsed && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full top-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <Link
                                    href={item.href}
                                    title={isCollapsed ? item.name : undefined}
                                    className={`flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl transition-all relative overflow-hidden ${isActive
                                        ? 'bg-blue-50/80 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold shadow-sm ring-1 ring-blue-500/20'
                                        : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {/* Hover highlight effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-transparent opacity-0 group-hover:via-blue-500/5 dark:group-hover:via-blue-400/10 transition-opacity duration-300" />

                                    <div className="relative z-10 shrink-0">
                                        <item.icon
                                            className={`${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'} transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'group-hover:text-blue-500 dark:group-hover:text-blue-400'}`}
                                        />
                                        {/* Glow effect under active icon */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-blue-500 blur-md opacity-40 rounded-full" />
                                        )}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: "auto" }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="truncate relative z-10 origin-left"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6 text-xs text-slate-400 dark:text-muted-foreground shrink-0 truncate border-t border-gray-200/50 dark:border-white/5"
                        title={workspaceName}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                            <span className="font-semibold text-slate-500 dark:text-slate-300">System Online</span>
                        </div>
                        &copy; {new Date().getFullYear()} {workspaceName}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.aside>
    )
}


