"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, Calendar, DollarSign, Download, Filter, Plus, Search, SortAsc, SortDesc, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"



export default function BalancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isAddTransaction, setIsAddTransaction] = useState(false);
  const [users, setUsers] = useState([]); // Available users for transactions
  const [transactions, setTransactions] = useState([]); // Store transaction data
  const [userBalances, setUserBalances] = useState([]); // User balance data
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<"deposit" | "withdraw">("deposit");
  const [loading, setLoading] = useState<boolean>(false);

  const [stats, setStats] = useState([
    { title: "Total Users", value: "0", icon: Users },
    { title: "Total Balance", value: "0", icon: DollarSign },
  ]);

  // Fetch users, balances, and transactions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, balanceRes, transactionsRes, userBalancesRes] = await Promise.all([
          axios.get("http://localhost:3001/user/all"),
          axios.get("http://localhost:3001/balance/total"),
          axios.get("http://localhost:3001/transaction/all"),
          axios.get("http://localhost:3001/balance/all"),
        ]);
  
        const usersMap = usersRes.data.reduce((acc, user) => {
          acc[user.id] = user.name; // Map userId to name
          return acc;
        }, {} as Record<string, string>);
  
        const formattedTransactions = transactionsRes.data.map((transaction) => ({
          ...transaction,
          userName: usersMap[transaction.userId] || "Unknown User",
          formattedId: transaction.id.slice(0, 8), // Shorten UUID
          formattedAmount: new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(Number(transaction.amount)), // Format amount as currency
          formattedDate: new Date(transaction.createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }), // Format date
          createAt: new Date(transaction.createdAt).toLocaleDateString("id-ID", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
          }), // Format date
        }));

        const formattedUserBalances = userBalancesRes.data.map((balance) => ({
          ...balance,
          user: usersMap[balance.userId] || "Unknown User", // Attach username
          id: balance.id.slice(0, 8), // Shorten UUID
          balance: new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(Number(balance.totalBalance)), // Format balance
          updateAt: new Date(balance.updatedAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }));
        
        setUserBalances(formattedUserBalances)
        setUsers(usersRes.data);
        setTransactions(formattedTransactions);
        setStats([
          { title: "Total Users", value: usersRes.data.length.toString(), icon: Users },
          {
            title: "Total Balance",
            value: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
              balanceRes.data.totalBalance
            ),
            icon: DollarSign,
          },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
  
    fetchData();
  }, []);
  

  // Filter transactions based on search term and type
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
  });

  // Calculate total balance
  const totalBalance = userBalances.reduce((sum, user) => sum + user.balance, 0);

  const handleSubmit = async () => {
    if (!selectedUserId || !amount || !type) {
      alert("Please fill in all fields.");
      return;
    }
  
    const transactionData = {
      userId: selectedUserId,
      amount: Number(amount),
      type,
      date: new Date(),
    };
  
    setLoading(true);
  
    try {
      const response = await axios.post("http://localhost:3001/transaction/add", transactionData);
  
      if (response.status === 201) {
        setTransactions((prev) => [...prev, response.data]); // Add new transaction to the list
        setIsAddTransaction(false); // Close the modal
        setSelectedUserId("");
        setAmount("");
        setType("deposit");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Balance Management</h1>
        <Button onClick={() => setIsAddTransaction(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {stats
          .map((stat, index) => (
            <Card key={index} className="w-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.formattedId}</TableCell>
                          <TableCell>{transaction.userName}</TableCell>
                          <TableCell className="hidden md:table-cell">{transaction.createAt}</TableCell>
                          <TableCell>
                            <div
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${transaction.type === "deposit"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}
                            >
                              {transaction.type === "deposit" ? (
                                <ArrowUp className="mr-1 h-3 w-3" />
                              ) : (
                                <ArrowDown className="mr-1 h-3 w-3" />
                              )}
                              {transaction.type}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={transaction.type === "deposit" ? "text-green-600" : "text-red-600"}>
                              {transaction.type === "deposit" ? "+" : "-"}{transaction.formattedAmount}
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
                    <TableHead>Id</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-left">Balance</TableHead>
                    <TableHead className="hidden md:table-cell">Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userBalances.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell className="font-medium">{user.user}</TableCell>
                      <TableCell className="text-left">{user.balance.toLocaleString()}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.updateAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>


      <Dialog open={isAddTransaction} onOpenChange={setIsAddTransaction}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>Choose a user and enter transaction details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* User Dropdown */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} {/* Display name, but send user.id */}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Amount</Label>
              <Input
                type="number"
                className="col-span-3"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Transaction Type Dropdown */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdraw">Withdraw</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : "Add Transaction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>


  )
}

