"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Calendar, Download, Filter, Search, SortAsc, SortDesc } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample transaction data
const transactions = [
  {
    id: "TRX-001",
    user: "John Doe",
    type: "deposit",
    amount: 5000,
    date: "2023-07-15",
    description: "Loan Disbursement",
  },
  {
    id: "TRX-002",
    user: "Jane Smith",
    type: "withdrawal",
    amount: 1200,
    date: "2023-07-14",
    description: "Installment Payment",
  },
  {
    id: "TRX-003",
    user: "Robert Johnson",
    type: "deposit",
    amount: 7500,
    date: "2023-07-12",
    description: "Loan Disbursement",
  },
  {
    id: "TRX-004",
    user: "Emily Davis",
    type: "withdrawal",
    amount: 850,
    date: "2023-07-10",
    description: "Installment Payment",
  },
  {
    id: "TRX-005",
    user: "Michael Wilson",
    type: "deposit",
    amount: 3000,
    date: "2023-07-08",
    description: "Loan Disbursement",
  },
  {
    id: "TRX-006",
    user: "Sarah Brown",
    type: "withdrawal",
    amount: 1500,
    date: "2023-07-05",
    description: "Installment Payment",
  },
  {
    id: "TRX-007",
    user: "David Miller",
    type: "deposit",
    amount: 12000,
    date: "2023-07-03",
    description: "Loan Disbursement",
  },
  {
    id: "TRX-008",
    user: "Lisa Taylor",
    type: "withdrawal",
    amount: 2000,
    date: "2023-07-01",
    description: "Installment Payment",
  },
]

// Sample user balances
const userBalances = [
  {
    user: "John Doe",
    balance: 3800,
    loans: 1,
    lastActivity: "2023-07-15",
  },
  {
    user: "Jane Smith",
    balance: 8800,
    loans: 1,
    lastActivity: "2023-07-14",
  },
  {
    user: "Robert Johnson",
    balance: 7500,
    loans: 1,
    lastActivity: "2023-07-12",
  },
  {
    user: "Emily Davis",
    balance: 14150,
    loans: 1,
    lastActivity: "2023-07-10",
  },
  {
    user: "Michael Wilson",
    balance: 3000,
    loans: 1,
    lastActivity: "2023-07-08",
  },
]

export default function BalancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortField, setSortField] = useState<"date" | "amount">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Filter transactions based on search term and type
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || transaction.type === typeFilter

    return matchesSearch && matchesType
  })

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    } else {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
    }
  })

  // Calculate total balance
  const totalBalance = userBalances.reduce((sum, user) => sum + user.balance, 0)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Balance Management</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold">${totalBalance.toLocaleString()}</p>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Total Deposits</p>
              <p className="text-2xl font-bold">$27,500</p>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">+8.2% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Total Withdrawals</p>
              <p className="text-2xl font-bold">$5,550</p>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowDown className="mr-1 h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">-3.4% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{userBalances.length}</p>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">+5.1% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>View all financial transactions in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    </SelectContent>
                  </Select>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortField("date")}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Sort by Date
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortField("amount")}>
                        <ArrowUp className="mr-2 h-4 w-4" />
                        Sort by Amount
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}>
                        {sortDirection === "asc" ? (
                          <SortAsc className="mr-2 h-4 w-4" />
                        ) : (
                          <SortDesc className="mr-2 h-4 w-4" />
                        )}
                        {sortDirection === "asc" ? "Ascending" : "Descending"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No transactions found. Try adjusting your search or filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>{transaction.user}</TableCell>
                          <TableCell className="hidden md:table-cell">{transaction.date}</TableCell>
                          <TableCell>
                            <div
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                transaction.type === "deposit"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {transaction.type === "deposit" ? (
                                <ArrowUp className="mr-1 h-3 w-3" />
                              ) : (
                                <ArrowDown className="mr-1 h-3 w-3" />
                              )}
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={transaction.type === "deposit" ? "text-green-600" : "text-red-600"}>
                              {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toLocaleString()}
                            </span>
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

        <Card>
          <CardHeader>
            <CardTitle>User Balances</CardTitle>
            <CardDescription>Current balance for each user in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="hidden md:table-cell">Active Loans</TableHead>
                    <TableHead className="hidden md:table-cell">Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userBalances.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.user}</TableCell>
                      <TableCell className="text-right">${user.balance.toLocaleString()}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.loans}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.lastActivity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

