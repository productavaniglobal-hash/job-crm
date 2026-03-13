'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronRight, Bookmark, Radio, Zap } from 'lucide-react'
import { MOCK_LEADS, type ProspectLead, type IntentScore } from '@/mock/leads'
import { Badge } from '@/components/ui/badge'

function IntentBadge({ score }: { score: IntentScore }) {
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

const LEAD_FILTERS = [
  'Lead Name',
  'Job Title',
  'Department',
  'Seniority',
  'Lead Location',
  'HQ Location',
  'Industry',
  'Technologies',
  'Revenue Range',
  'Employee Range',
  'Target Company Domains',
  'Company Keywords',
  'Funding Stage',
  'Founded Year',
] as const

const PAGE_SIZE = 10

export default function ProspectLeadsPage() {
  const [activeTab, setActiveTab] = useState('filters')
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set())
  const [sortKey, setSortKey] = useState<keyof ProspectLead | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)

  const toggleFilter = (name: string) => {
    setExpandedFilters((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const sortedLeads = useMemo(() => {
    const list = [...MOCK_LEADS]
    if (!sortKey) return list
    list.sort((a, b) => {
      const aVal = a[sortKey] ?? ''
      const bVal = b[sortKey] ?? ''
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [sortKey, sortDir])

  const totalPages = Math.ceil(sortedLeads.length / PAGE_SIZE)
  const paginatedLeads = useMemo(
    () => sortedLeads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sortedLeads, page]
  )

  const handleSort = (key: keyof ProspectLead) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Prospect Leads</h1>
        <p className="text-muted-foreground text-sm mt-1">Discover potential buyers and decision makers.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted rounded-lg p-[3px] h-9 w-fit">
          <TabsTrigger value="filters" className="rounded-md px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Search with filters
          </TabsTrigger>
          <TabsTrigger value="ai" className="rounded-md px-3 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Zap className="h-3.5 w-3.5 text-purple-500" />
            Search with AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="filters" className="mt-6">
          <div className="flex gap-6 flex-col lg:flex-row">
            <Card className="lg:w-72 shrink-0 rounded-xl border bg-card shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Filters</CardTitle>
                <CardDescription className="text-xs">Refine your lead search</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pt-0">
                <div className="border rounded-lg divide-y border-border overflow-hidden">
                  {LEAD_FILTERS.map((name) => {
                    const isOpen = expandedFilters.has(name)
                    return (
                      <div key={name} className="bg-background">
                        <button
                          type="button"
                          onClick={() => toggleFilter(name)}
                          className="w-full flex items-center justify-between gap-2 py-2.5 px-3 text-left text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                        >
                          <span>{name}</span>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-3 pb-3 pt-0">
                            <Input
                              placeholder={`Enter ${name.toLowerCase()}`}
                              className="h-9 text-sm"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 min-w-0 rounded-xl border bg-card shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b">
                        <TableHead>
                          <button
                            type="button"
                            className="font-medium text-left flex items-center gap-1"
                            onClick={() => handleSort('name')}
                          >
                            Name {sortKey === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
                          </button>
                        </TableHead>
                        <TableHead>
                          <button
                            type="button"
                            className="font-medium text-left flex items-center gap-1"
                            onClick={() => handleSort('title')}
                          >
                            Title {sortKey === 'title' && (sortDir === 'asc' ? '↑' : '↓')}
                          </button>
                        </TableHead>
                        <TableHead>
                          <button
                            type="button"
                            className="font-medium text-left flex items-center gap-1"
                            onClick={() => handleSort('company')}
                          >
                            Company {sortKey === 'company' && (sortDir === 'asc' ? '↑' : '↓')}
                          </button>
                        </TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Company Size</TableHead>
                        <TableHead>Funding Stage</TableHead>
                        <TableHead>
                          <button
                            type="button"
                            className="font-medium text-left flex items-center gap-1"
                            onClick={() => handleSort('lastActivity')}
                          >
                            Last Activity {sortKey === 'lastActivity' && (sortDir === 'asc' ? '↑' : '↓')}
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
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedLeads.map((lead) => (
                        <TableRow key={lead.id} className="border-b hover:bg-muted/50">
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell className="text-muted-foreground">{lead.title}</TableCell>
                          <TableCell>{lead.company}</TableCell>
                          <TableCell className="text-muted-foreground">{lead.location}</TableCell>
                          <TableCell>{lead.industry}</TableCell>
                          <TableCell className="text-muted-foreground">{lead.companySize}</TableCell>
                          <TableCell>{lead.fundingStage}</TableCell>
                          <TableCell className="text-muted-foreground">{lead.lastActivity}</TableCell>
                          <TableCell>
                            <IntentBadge score={lead.intentScore} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                                <Bookmark className="h-3.5 w-3.5" />
                                Save
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                                <Radio className="h-3.5 w-3.5" />
                                Track
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, sortedLeads.length)} of {sortedLeads.length}
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
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <Card className="rounded-xl border bg-card shadow-sm">
            <CardContent className="py-12 text-center">
              <Zap className="h-10 w-10 text-purple-500 mx-auto mb-3" />
              <p className="text-muted-foreground">Search with AI — describe your ideal lead in natural language. (Demo)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
