'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function AnalyticsCards() {
  const data = [
    { day: 'Mon', opens: 42, replies: 9, clicks: 14, bounces: 2 },
    { day: 'Tue', opens: 55, replies: 12, clicks: 19, bounces: 3 },
    { day: 'Wed', opens: 49, replies: 10, clicks: 16, bounces: 1 },
    { day: 'Thu', opens: 61, replies: 15, clicks: 22, bounces: 2 },
    { day: 'Fri', opens: 58, replies: 13, clicks: 18, bounces: 2 },
  ]

  const kpis = [
    { label: 'Open rate', value: '48.2%' },
    { label: 'Reply rate', value: '13.4%' },
    { label: 'Bounce rate', value: '2.1%' },
    { label: 'Click rate', value: '19.6%' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <Card key={k.label} className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm">{k.label}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold">{k.value}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2"><CardTitle>Email performance over time</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="opens" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="replies" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="clicks" fill="#a855f7" radius={[6, 6, 0, 0]} />
              <Bar dataKey="bounces" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

