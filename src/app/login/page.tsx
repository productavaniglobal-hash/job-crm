import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage() {
    if (process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true') redirect('/home')
    const cookieStore = await cookies()
    if (cookieStore.get('sb-mock-auth')?.value === 'true') redirect('/home')
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-gray-50 to-white dark:from-blue-900/20 dark:via-[#0a0a0a] dark:to-[#0a0a0a]">
            <Card className="w-full max-w-sm shadow-2xl border-gray-200/50 dark:border-border bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                <form>
                    <CardHeader className="space-y-2 pb-6 pt-8 text-center">
                        <div className="mx-auto bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-6 h-6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-foreground">Welcome Back</CardTitle>
                        <CardDescription className="text-slate-500 dark:text-muted-foreground font-medium px-4">
                            Sign in with your Pipero credentials to access the dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-5 px-8">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="font-semibold text-slate-700 dark:text-muted-foreground">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="you@company.com" required className="bg-gray-100/50 dark:bg-secondary/50 border-gray-200 dark:border-border/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 rounded-xl transition-all h-11" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="font-semibold text-slate-700 dark:text-muted-foreground">Password</Label>
                            <Input id="password" name="password" type="password" required className="bg-gray-100/50 dark:bg-secondary/50 border-gray-200 dark:border-border/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 rounded-xl transition-all h-11" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3 px-8 pb-8 pt-4">
                        <Button className="w-full h-11 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all" formAction={login}>Sign In</Button>
                        <p className="text-center text-xs text-slate-400 dark:text-muted-foreground">
                            Don&apos;t have access? Contact your admin to get an invite.
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
