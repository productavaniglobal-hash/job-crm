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
import { ChevronDown, ChevronRight, Zap } from 'lucide-react'
import { MOCK_COMPANIES, type ProspectCompany, type IntentScore } from '@/mock/companies'
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

const COMPANY_FILTERS = [
  'Company Name',
  'Location',
  'Industry',
  'Technologies',
  'Keywords',
  'Revenue Range',
  'Company Size',
  'Funding Stage',
  'Founded Year',
] as const

const PAGE_SIZE = 10

export default function ProspectCompaniesPage() {
  const [activeTab, setActiveTab] = useState('filters')
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set())
  const [sortKey, setSortKey] = useState<keyof ProspectCompany | null>(null)
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

  const sortedCompanies = useMemo(() => {
    const list = [...MOCK_COMPANIES]
    if (!sortKey) return list
    list.sort((a, b) => {
      const aVal = a[sortKey] ?? ''
      const bVal = b[sortKey] ?? ''
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [sortKey, sortDir])

  const totalPages = Math.ceil(sortedCompanies.length / PAGE_SIZE)
  const paginatedCompanies = useMemo(
    () => sortedCompanies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sortedCompanies, page]
  )

  const handleSort = (key: keyof ProspectCompany) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Prospect Companies</h1>
        <p className="text-muted-foreground text-sm mt-1">Identify companies that match your ICP.</p>
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
                <CardDescription className="text-xs">Refine your company search</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pt-0">
                <div className="border rounded-lg divide-y border-border overflow-hidden">
                  {COMPANY_FILTERS.map((name) => {
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
                            Company Name {sortKey === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
                          </button>
                        </TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>HQ Location</TableHead>
                        <TableHead>Employees</TableHead>
                        <TableHead>Funding Stage</TableHead>
                        <TableHead>Revenue Range</TableHead>
                        <TableHead>Signals</TableHead>
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
                      {paginatedCompanies.map((company) => (
                        <TableRow key={company.id} className="border-b hover:bg-muted/50">
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell className="text-muted-foreground">{company.industry}</TableCell>
                          <TableCell>{company.hqLocation}</TableCell>
                          <TableCell className="text-muted-foreground">{company.employees}</TableCell>
                          <TableCell>{company.fundingStage}</TableCell>
                          <TableCell className="text-muted-foreground">{company.revenueRange}</TableCell>
                          <TableCell>{company.signals}</TableCell>
                          <TableCell>
                            <IntentBadge score={company.intentScore} />
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              View
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
                      Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, sortedCompanies.length)} of {sortedCompanies.length}
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
              <p className="text-muted-foreground">Search with AI — describe your ideal company profile. (Demo)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
