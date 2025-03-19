"use client"

import { useState } from "react"
import { Calendar, Check, Download, Filter, MoreHorizontal, Plus, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample installment data
const installments = [
  {
    id: "INS-001",
    loanId: "L-2023-002",
    user: "Jane Smith",
    amount: 500,
    dueDate: "2023-08-10",
    status: "paid",
    paidDate: "2023-08-08",
  },
  {
    id: "INS-002",
    loanId: "L-2023-004",
    user: "Emily Davis",
    amount: 450,
    dueDate: "2023-08-15",
    status: "pending",
    paidDate: null,
  },
  {
    id: "INS-003",
    loanId: "L-2023-002",
    user: "Jane Smith",
    amount: 500,
    dueDate: "2023-09-10",
    status: "pending",
    paidDate: null,
  },
  {
    id: "INS-004",
    loanId: "L-2023-004",
    user: "Emily Davis",
    amount: 450,
    dueDate: "2023-09-15",
    status: "pending",
    paidDate: null,
  },
  {
    id: "INS-005",
    loanId: "L-2023-007",
    user: "David Miller",
    amount: 400,
    dueDate: "2023-08-12",
    status: "paid",
    paidDate: "2023-08-10",
  },
  {
    id: "INS-006",
    loanId: "L-2023-007",
    user: "David Miller",
    amount: 400,
    dueDate: "2023-09-12",
    status: "pending",
    paidDate: null,
  },
  {
    id: "INS-007",
    loanId: "L-2023-008",
    user: "Lisa Taylor",
    amount: 500,
    dueDate: "2023-08-20",
    status: "overdue",
    paidDate: null,
  },
  {
    id: "INS-008",
    loanId: "L-2023-008",
    user: "Lisa Taylor",
    amount: 500,
    dueDate: "2023-09-20",
    status: "pending",
    paidDate: null,
  },
]

export default function InstallmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false)
  const [selectedInstallment, setSelectedInstallment] = useState<string | null>(null)

  // Filter installments based on search term and status
  const filteredInstallments = installments.filter((installment) => {
    const matchesSearch =
      installment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      installment.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      installment.user.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || installment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleRecordPayment = () => {
    // In a real app, you would call an API to update the installment status
    console.log(`Recording payment for installment with ID: ${selectedInstallment}`)
    setIsRecordPaymentOpen(false)
    setSelectedInstallment(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <Check className="mr-1 h-3 w-3" />
            Paid
          </div>
        )
      case "pending":
        return (
          <div className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <Calendar className="mr-1 h-3 w-3" />
            Pending
          </div>
        )
      case "overdue":
        return (
          <div className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <X className="mr-1 h-3 w-3" />
            Overdue
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Installment Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsRecordPaymentOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Installments</CardTitle>
          <CardDescription>Track loan installments and payment status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search installments..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstallments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No installments found. Try adjusting your search or filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInstallments.map((installment) => (
                      <TableRow key={installment.id}>
                        <TableCell className="font-medium">{installment.id}</TableCell>
                        <TableCell>{installment.loanId}</TableCell>
                        <TableCell>{installment.user}</TableCell>
                        <TableCell className="hidden md:table-cell">{installment.dueDate}</TableCell>
                        <TableCell className="text-right">${installment.amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(installment.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {installment.status !== "paid" && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedInstallment(installment.id)
                                    setIsRecordPaymentOpen(true)
                                  }}
                                >
                                  <Check className="mr-2 h-4 w-4 text-green-600" />
                                  <span className="text-green-600">Record Payment</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Record Payment Dialog */}
      <Dialog open={isRecordPaymentOpen} onOpenChange={setIsRecordPaymentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>Record a payment for an installment. Fill in the details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="installment-id" className="text-right">
                Installment
              </Label>
              <Select defaultValue={selectedInstallment || ""}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select installment" />
                </SelectTrigger>
                <SelectContent>
                  {installments
                    .filter((installment) => installment.status !== "paid")
                    .map((installment) => (
                      <SelectItem key={installment.id} value={installment.id}>
                        {installment.id} - {installment.user} (${installment.amount})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                defaultValue={selectedInstallment ? installments.find((i) => i.id === selectedInstallment)?.amount : ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-date" className="text-right">
                Payment Date
              </Label>
              <Input
                id="payment-date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-method" className="text-right">
                Payment Method
              </Label>
              <Select defaultValue="bank">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input id="notes" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecordPaymentOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleRecordPayment}>
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

