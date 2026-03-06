import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Search, Bell, User } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { NotificationBell } from './NotificationBell'
import { getNotifications, getMockableUser } from '@/app/actions/notifications'

export async function GlobalHeader() {
    const notifications = await getNotifications()
    const user = await getMockableUser()

    async function signOut() {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()

        // Clear mock cookie
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        cookieStore.delete('sb-mock-auth')

        redirect('/login')
    }

    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-border bg-white/70 dark:bg-card/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex-1 flex max-w-xl">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search leads, deals, contacts..."
                        className="w-full bg-gray-100/50 dark:bg-muted/50 border border-gray-200 dark:border-border rounded-xl pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-muted transition-all shadow-sm dark:shadow-none"
                    />
                </div>
            </div>
            <div className="flex items-center gap-6 text-gray-500 dark:text-muted-foreground">
                <div className="hidden md:block text-[13px] font-medium tracking-wide">
                    {new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <NotificationBell initialNotifications={notifications} userId={user?.id} />
                <ThemeToggle />
                <form action={signOut} className="flex items-center">
                    <button type="submit" title={`Logged in as ${user?.full_name || user?.email || 'User'}. Click to Sign Out`} className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 shadow-sm transition-colors text-gray-600 dark:text-gray-200 overflow-hidden">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : user?.full_name ? (
                            <span className="text-xs font-bold">{user.full_name.charAt(0).toUpperCase()}</span>
                        ) : user?.email ? (
                            <span className="text-xs font-bold">{user.email.charAt(0).toUpperCase()}</span>
                        ) : (
                            <User className="h-4 w-4" />
                        )}
                    </button>
                </form>
            </div>
        </header>
    )
}

