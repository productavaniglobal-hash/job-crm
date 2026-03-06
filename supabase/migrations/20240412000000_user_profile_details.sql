

1/1

Next.js 16.1.6
Turbopack
Recoverable Error


Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:
- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

See more info here: https://nextjs.org/docs/messages/react-hydration-error


  ...
    <LoadingBoundary name="leads/" loading={null}>
      <HTTPAccessFallbackBoundary notFound={undefined} forbidden={undefined} unauthorized={undefined}>
        <RedirectBoundary>
          <RedirectErrorBoundary router={{...}}>
            <InnerLayoutRouter url="/leads" tree={[...]} params={{}} cacheNode={{rsc:<Fragment>, ...}} ...>
              <SegmentViewNode type="page" pagePath="(dashboard...">
                <SegmentTrieNode>
                <LeadsPage>
                  <LeadsClient initialLeads={[...]} searchParams={{}}>
                    <div className="space-y-6">
                      <Dialog>
                      <div className="flex justi...">
                        <div>
                          <h1>
                          <div className="flex gap-4...">
                            <span>
                            <span>
                            <span>
                            <span>
                              <strong className="text-slate...">
+                               579,579
-                               5,79,579
                        ...
                      ...
              ...
            ...
src/components/leads/LeadsClient.tsx (356:46) @ LeadsClient


  354 |                             {leads.filter(l => (l.tasks || []).some((t: any) => t.status === 'pending')).length}
  355 |                         </strong> need follow-up</span>
> 356 |                         <span>Est. Pipeline: <strong className="text-slate-900 dark:text-foreground">
      |                                              ^
  357 |                             ${leads.reduce((sum, l) => sum + (l.deals || []).reduce((s: number, d: any) => s + (Number(d.value) || 0), 0), 0).toLocaleString()}
  358 |                         </strong></span>
  359 |                     </div>
Call Stack
14

Show 11 ignore-listed frame(s)
strong
<anonymous>
LeadsClient
src/components/leads/LeadsClient.tsx (356:46)
LeadsPage
src\app\(dashboard)\leads\page.tsx (10:12)
1
2
meratutor.ai

Dashboard
Follow-ups
Leads
Forwarded
Pipeline
Notifications
Inbox
Tasks
Analytics
Attendance
Rep Monitor
Activity Log
Settings
© 2026 meratutor.ai
Search leads, deals, contacts...
Fri, Feb 27, 2026

Current: Black. Click to switch to White

K
Leads
2 total leads
0 hot leads
0 need follow-up
Est. Pipeline: $579,579
Table
Board
Import CSV
Export CSV
Add Lead
Filters

All Statuses
Search leads...
Advanced
Clear
All Leads
Hot
Warm
Cold
	
Company
Contact Person
Phone	
Location
Status
Temp
Score
Tags	
Added On
		krishna	Soumya Mishra	8248322396	
India
New	
cold
50
No tags
Feb 27, 2026	Open menu
		krishna	prasad	8248322396	
kerala
New	
cold
50
No tags
Feb 27, 2026	Open menu
