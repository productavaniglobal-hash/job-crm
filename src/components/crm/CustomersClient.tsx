'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createCustomer, deleteCustomer } from '@/app/actions/crm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Item = { id: string; name?: string; email?: string | null; phone?: string | null }
type Customer = {
  id: string
  status?: string | null
  notes?: string | null
  companies?: Item | null
  contacts?: Item | null
  leads?: Item | null
}

export default function CustomersClient({ customers, companies, contacts, leads }: { customers: Customer[]; companies: Item[]; contacts: Item[]; leads: Item[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const onCreate = (form: HTMLFormElement) => {
    const fd = new FormData(form)
    startTransition(async () => {
      const res = await createCustomer(fd)
      if ('error' in res) return alert(res.error)
      form.reset()
      router.refresh()
    })
  }

  const onDelete = (id: string) => {
    if (!confirm('Delete this customer?')) return
    startTransition(async () => {
      const res = await deleteCustomer(id)
      if ('error' in res) return alert(res.error)
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Customer (convert manually)</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-3" onSubmit={(e) => { e.preventDefault(); onCreate(e.currentTarget) }}>
            <div>
              <Label>Company ID</Label>
              <Input name="company_id" placeholder="Optional UUID" />
            </div>
            <div>
              <Label>Contact ID</Label>
              <Input name="contact_id" placeholder="Optional UUID" />
            </div>
            <div>
              <Label>Source Lead ID</Label>
              <Input name="source_lead_id" placeholder="Optional UUID" />
            </div>
            <div>
              <Label>Status</Label>
              <Input name="status" defaultValue="active" />
            </div>
            <div className="md:col-span-4">
              <Label>Notes</Label>
              <Input name="notes" placeholder="Optional notes" />
            </div>
            <div className="md:col-span-4">
              <Button type="submit" disabled={isPending}>Create Customer</Button>
            </div>
          </form>
          <p className="text-xs text-muted-foreground mt-3">
            Available IDs - Companies: {companies.slice(0, 4).map((x) => x.name).join(', ') || 'none'}; Contacts: {contacts.slice(0, 4).map((x) => x.name).join(', ') || 'none'}; Leads: {leads.slice(0, 4).map((x) => x.name).join(', ') || 'none'}.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Source Lead</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.companies?.name || '-'}</TableCell>
                  <TableCell>{c.contacts?.name || '-'}</TableCell>
                  <TableCell>{c.leads?.name || '-'}</TableCell>
                  <TableCell>{c.status || '-'}</TableCell>
                  <TableCell>{c.notes || '-'}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(c.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
