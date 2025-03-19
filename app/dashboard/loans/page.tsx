"use client"

import { useState } from "react"
import { Check, Clock, Download, FileText, Filter, MoreHorizontal, Search, ThumbsDown, ThumbsUp } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample loan data
const loans = [
  {
    id: "L-2023-001",
    user: "John Doe",
    amount: 5000,
    term: 12,
    status: "pending",
    date: "2023-07-15",
    purpose: "Home Renovation",
  },
  {
    id: "L-2023-002",
    user: "Jane Smith",
    amount: 10000,
    term: 24,
    status: "approved",
    date: "2023-07-10",
    purpose: "Education",
  },
  {
    id: "L-2023-003",
    user: "Robert Johnson",
    amount: 7500,
    term: 18,
    status: "rejected",
    date: "2023-07-05",
    purpose: "Debt Consolidation",
  },
  {
    id: "L-2023-004",
    user: "Emily Davis",
    amount: 15000,
    term: 36,
    status: "ongoing",
    date: "2023-06-28",
    purpose: "Business",
  },
  {
    id: "L-2023-005",
    user: "Michael Wilson",
    amount: 3000,
    term: 6,
    status: "completed",
    date: "2023-06-15",
    purpose: "Medical Expenses",
  },
  {
    id: "L-2023-006",
    user: "Sarah Brown",
    amount: 8000,
    term: 24,
    status: "pending",
    date: "2023-07-18",
    purpose: "Vehicle Purchase",
  },
  {
    id: "L-2023-007",
    user: "David Miller",
    amount: 12000,
    term: 30,
    status: "approved",
    date: "2023-07-12",
    purpose: "Home Renovation",
  },
  {
    id: "L-2023-008",
    user: "Lisa Taylor",
    amount: 6000,
    term: 12,
    status: "ongoing",
    date: "2023-06-20",
    purpose: "Education",
  },
]

export default function LoansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)

  // Filter loans based on search term, status, and active tab
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || loan.status === statusFilter

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && loan.status === "pending") ||
      (activeTab === "approved" && loan.status === "approved") ||
      (activeTab === "ongoing" && loan.status === "ongoing") ||
      (activeTab === "completed" && loan.status === "completed") ||
      (activeTab === "rejected" && loan.status === "rejected")

    return matchesSearch && matchesStatus && matchesTab
  })

  const handleLoanAction = () => {
    // In a real app, you would call an API to update the loan status
    console.log(`${actionType === "approve" ? "Approving" : "Rejecting"} loan with ID: ${selectedLoan}`)
    setIsActionDialogOpen(false)
    setSelectedLoan(null)
    setActionType(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <div className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </div>
        )
      case "approved":
        return (
          <div className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <ThumbsUp className="mr-1 h-3 w-3" />
            Approved
          </div>
        )
      case "rejected":
        return (
          <div className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <ThumbsDown className="mr-1 h-3 w-3" />
            Rejected
          </div>
        )
      case "ongoing":
        return (
          <div className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
            <FileText className="mr-1 h-3 w-3" />
            Ongoing
          </div>
        )
      case "completed":
        return (
          <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <Check className="mr-1 h-3 w-3" />
            Completed
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Loan Management</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Loans
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="all">All Loans</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>Loan Applications</CardTitle>
              <CardDescription>
                Manage loan applications, approve or reject requests, and track loan status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search loans..."
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
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
                        <TableHead>Loan ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead className="hidden md:table-cell">Purpose</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="hidden md:table-cell">Term</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLoans.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No loans found. Try adjusting your search or filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLoans.map((loan) => (
                          <TableRow key={loan.id}>
                            <TableCell className="font-medium">{loan.id}</TableCell>
                            <TableCell>{loan.user}</TableCell>
                            <TableCell className="hidden md:table-cell">{loan.purpose}</TableCell>
                            <TableCell className="text-right">${loan.amount.toLocaleString()}</TableCell>
                            <TableCell className="hidden md:table-cell">{loan.term} months</TableCell>
                            <TableCell>{getStatusBadge(loan.status)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedLoan(loan.id)
                                      setIsDetailsOpen(true)
                                    }}
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  {loan.status === "pending" && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedLoan(loan.id)
                                          setActionType("approve")
                                          setIsActionDialogOpen(true)
                                        }}
                                      >
                                        <ThumbsUp className="mr-2 h-4 w-4 text-green-600" />
                                        <span className="text-green-600">Approve</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedLoan(loan.id)
                                          setActionType("reject")
                                          setIsActionDialogOpen(true)
                                        }}
                                      >
                                        <ThumbsDown className="mr-2 h-4 w-4 text-red-600" />
                                        <span className="text-red-600">Reject</span>
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {loan.status === "approved" && (
                                    <DropdownMenuItem>
                                      <Clock className="mr-2 h-4 w-4 text-purple-600" />
                                      <span className="text-purple-600">Mark as Ongoing</span>
                                    </DropdownMenuItem>
                                  )}
                                  {loan.status === "ongoing" && (
                                    <DropdownMenuItem>
                                      <Check className="mr-2 h-4 w-4 text-green-600" />
                                      <span className="text-green-600">Mark as Completed</span>
                                    </DropdownMenuItem>
                                  )}
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
        </TabsContent>
      </Tabs>

      {/* Loan Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Loan Details</DialogTitle>
            <DialogDescription>Detailed information about the selected loan.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedLoan && (
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Loan ID</p>
                    <p className="text-lg font-semibold">{selectedLoan}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="text-lg font-semibold">
                      {getStatusBadge(loans.find((loan) => loan.id === selectedLoan)?.status || "")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User</p>
                    <p className="text-lg font-semibold">{loans.find((loan) => loan.id === selectedLoan)?.user}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                    <p className="text-lg font-semibold">{loans.find((loan) => loan.id === selectedLoan)?.date}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Amount</p>
                    <p className="text-lg font-semibold">
                      ${loans.find((loan) => loan.id === selectedLoan)?.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Term</p>
                    <p className="text-lg font-semibold">
                      {loans.find((loan) => loan.id === selectedLoan)?.term} months
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                  <p className="text-lg font-semibold">{loans.find((loan) => loan.id === selectedLoan)?.purpose}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loan Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{actionType === "approve" ? "Approve Loan" : "Reject Loan"}</DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Are you sure you want to approve this loan application?"
                : "Are you sure you want to reject this loan application?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant={actionType === "approve" ? "default" : "destructive"} onClick={handleLoanAction}>
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

