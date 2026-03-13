'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, Bookmark, Radio } from 'lucide-react'
import { MOCK_COMPANIES, type ProspectCompany, type IntentScore } from '@/mock/companies'

const EXAMPLE_QUERIES = [
  'SaaS companies hiring sales reps in the US',
  'Fintech startups that raised funding in the last 12 months',
  'EdTech companies expanding globally',
  'AI startups hiring product managers',
]

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

function CompanyCard({ company }: { company: ProspectCompany }) {
  const initial = company.name.slice(0, 1)
  return (
    <Card className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12 rounded-lg shrink-0 bg-muted">
            <AvatarFallback className="rounded-lg text-lg font-semibold">{initial}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{company.name}</h3>
            <p className="text-sm text-muted-foreground">{company.industry}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
              <span>{company.employees} employees</span>
              <span>·</span>
              <span>{company.fundingStage}</span>
              <span>·</span>
              <span>{company.hqLocation}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">{company.signals} signals detected</span>
              <IntentBadge score={company.intentScore} />
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Bookmark className="h-3.5 w-3.5" />
                Save to Prospects
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Radio className="h-3.5 w-3.5" />
                Track Signals
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AIProspectSearchPage() {
  const [query, setQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = () => {
    setHasSearched(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">AI Prospect Search</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Describe the companies you want to find. AI matches your criteria to prospects.
        </p>
      </div>

      <Card className="rounded-xl border bg-card shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Describe the companies you want to find..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 min-w-0 h-11 text-base"
            />
            <Button onClick={handleSearch} className="shrink-0 gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Try an example:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {EXAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => { setQuery(q); setHasSearched(true) }}
                className="text-xs px-3 py-1.5 rounded-md border border-border bg-muted/50 hover:bg-muted text-foreground transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <div>
          <h2 className="text-lg font-medium text-foreground mb-3">Results</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {MOCK_COMPANIES.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
