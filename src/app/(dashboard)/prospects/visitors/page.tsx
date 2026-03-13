'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MOCK_VISITORS, type AnonymousVisitor, type IntentScore } from '@/mock/visitors'

const PAGE_SIZE = 10

function IntentBadge({ score }: { score: IntentScore }) {
  const variant = score === 'High' ? 'default' : score === 'Medium' ? 'secondary' : 'outline'
  const className =
    score === 'High'
      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
      : score === 'Medium'
        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
        : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
  return (
    <Badge variant="outline" className={className}>
      {score}
    </Badge>
  )
}

export default function AnonymousVisitorsPage() {
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<keyof AnonymousVisitor | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sortedVisitors = useMemo(() => {
    const list = [...MOCK_VISITORS]
    if (!sortKey) return list
    list.sort((a, b) => {
      const aVal = a[sortKey] ?? ''
      const bVal = b[sortKey] ?? ''
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [sortKey, sortDir])

  const totalPages = Math.ceil(sortedVisitors.length / PAGE_SIZE)
  const paginated = useMemo(
    () => sortedVisitors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sortedVisitors, page]
  )

  const handleSort = (key: keyof AnonymousVisitor) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Anonymous Website Visitors</h1>
        <p className="text-muted-foreground text-sm mt-1">Identify companies visiting your website.</p>
      </div>

      <Card className="rounded-xl border bg-card shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead>
                    <button
                      type="button"
                      className="font-medium text-left flex items-center gap-1"
                      onClick={() => handleSort('companyName')}
                    >
                      Company Name {sortKey === 'companyName' && (sortDir === 'asc' ? '↑' : '↓')}
                    </button>
                  </TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Pages Visited</TableHead>
                  <TableHead>Time on Site</TableHead>
                  <TableHead>
                    <button
                      type="button"
                      className="font-medium text-left flex items-center gap-1"
                      onClick={() => handleSort('lastVisit')}
                    >
                      Last Visit {sortKey === 'lastVisit' && (sortDir === 'asc' ? '↑' : '↓')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      className="font-medium text-left flex items-center gap-1"
                      onClick={() => handleSort('intentScore')}
                    >
                      Intent Score {sortKey === 'intentScore' && (sortDir === 'asc' ? '↑' : '↓')}
                    </button>
                  </TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((visitor) => (
                  <TableRow key={visitor.id} className="border-b hover:bg-muted/50">
                    <TableCell className="font-medium">{visitor.companyName}</TableCell>
                    <TableCell className="text-muted-foreground">{visitor.industry}</TableCell>
                    <TableCell className="text-muted-foreground">{visitor.employees}</TableCell>
                    <TableCell className="text-muted-foreground">{visitor.location}</TableCell>
                    <TableCell>{visitor.pagesVisited}</TableCell>
                    <TableCell className="text-muted-foreground">{visitor.timeOnSite}</TableCell>
                    <TableCell className="text-muted-foreground">{visitor.lastVisit}</TableCell>
                    <TableCell>
                      <IntentBadge score={visitor.intentScore} />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        Convert
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, sortedVisitors.length)} of {sortedVisitors.length}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
