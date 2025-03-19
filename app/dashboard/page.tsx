"use client"

import { ArrowDown, ArrowUp, DollarSign, Users, FileText, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipItem,
  ChartTooltipLabel,
  ChartTooltipValue,
  ChartLegend,
  ChartLegendItem,
  ChartLegendItemColor,
  ChartLegendItemLabel,
  ChartGrid,
  ChartLine,
  ChartXAxis,
  ChartYAxis,
  ChartArea,
  ChartBar,
} from "@/components/ui/chart"

export default function DashboardPage() {
  // Sample data for the dashboard
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12.5%",
      changeType: "positive",
      icon: Users,
    },
    {
      title: "Active Loans",
      value: "1,235",
      change: "+5.2%",
      changeType: "positive",
      icon: FileText,
    },
    {
      title: "Total Balance",
      value: "$584,325",
      change: "+18.7%",
      changeType: "positive",
      icon: DollarSign,
    },
    {
      title: "Pending Approvals",
      value: "42",
      change: "-8.4%",
      changeType: "negative",
      icon: Clock,
    },
  ]

  // Sample data for charts
  const loanData = [
    { month: "Jan", approved: 65, rejected: 28, pending: 15 },
    { month: "Feb", approved: 59, rejected: 32, pending: 18 },
    { month: "Mar", approved: 80, rejected: 27, pending: 12 },
    { month: "Apr", approved: 81, rejected: 21, pending: 19 },
    { month: "May", approved: 56, rejected: 36, pending: 22 },
    { month: "Jun", approved: 55, rejected: 30, pending: 13 },
    { month: "Jul", approved: 72, rejected: 25, pending: 18 },
  ]

  const transactionData = [
    { month: "Jan", amount: 12500 },
    { month: "Feb", amount: 18200 },
    { month: "Mar", amount: 15800 },
    { month: "Apr", amount: 22400 },
    { month: "May", amount: 19800 },
    { month: "Jun", amount: 24600 },
    { month: "Jul", amount: 28200 },
  ]

  const userGrowthData = [
    { month: "Jan", users: 1200 },
    { month: "Feb", users: 1350 },
    { month: "Mar", users: 1500 },
    { month: "Apr", users: 1680 },
    { month: "May", users: 1750 },
    { month: "Jun", users: 1950 },
    { month: "Jul", users: 2100 },
  ]

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`rounded-full p-2 ${stat.changeType === "positive" ? "bg-green-100" : "bg-red-100"}`}>
                  <stat.icon
                    className={`h-5 w-5 ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.changeType === "positive" ? (
                  <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDown className="mr-1 h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change} from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="loans" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="loans">Loan Activity</TabsTrigger>
          <TabsTrigger value="transactions">Transaction Volume</TabsTrigger>
          <TabsTrigger value="users">User Growth</TabsTrigger>
        </TabsList>
        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>Loan Activity</CardTitle>
              <CardDescription>
                Monthly breakdown of loan approvals, rejections, and pending applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer>
                  <Chart>
                    <ChartLegend>
                      <ChartLegendItem>
                        <ChartLegendItemColor className="bg-primary" />
                        <ChartLegendItemLabel>Approved</ChartLegendItemLabel>
                      </ChartLegendItem>
                      <ChartLegendItem>
                        <ChartLegendItemColor className="bg-red-500" />
                        <ChartLegendItemLabel>Rejected</ChartLegendItemLabel>
                      </ChartLegendItem>
                      <ChartLegendItem>
                        <ChartLegendItemColor className="bg-yellow-500" />
                        <ChartLegendItemLabel>Pending</ChartLegendItemLabel>
                      </ChartLegendItem>
                    </ChartLegend>
                    <ChartGrid />
                    <ChartBar
                      data={loanData}
                      dataKey="month"
                      categories={["approved", "rejected", "pending"]}
                      colors={["hsl(var(--primary))", "hsl(var(--destructive))", "hsl(var(--warning))"]}
                      valueFormatter={(value) => `${value} loans`}
                      stack
                    />
                    <ChartXAxis dataKey="month" />
                    <ChartYAxis />
                    <ChartTooltip>
                      <ChartTooltipContent>
                        <ChartTooltipLabel />
                        <ChartTooltipItem name="Approved" color="hsl(var(--primary))" />
                        <ChartTooltipItem name="Rejected" color="hsl(var(--destructive))" />
                        <ChartTooltipItem name="Pending" color="hsl(var(--warning))" />
                      </ChartTooltipContent>
                    </ChartTooltip>
                  </Chart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume</CardTitle>
              <CardDescription>Monthly transaction volume in dollars</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer>
                  <Chart>
                    <ChartGrid />
                    <ChartArea
                      data={transactionData}
                      dataKey="month"
                      categories={["amount"]}
                      colors={["hsl(var(--primary))"]}
                      valueFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <ChartLine
                      data={transactionData}
                      dataKey="month"
                      categories={["amount"]}
                      colors={["hsl(var(--primary))"]}
                      valueFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <ChartXAxis dataKey="month" />
                    <ChartYAxis />
                    <ChartTooltip>
                      <ChartTooltipContent>
                        <ChartTooltipLabel />
                        <ChartTooltipValue />
                      </ChartTooltipContent>
                    </ChartTooltip>
                  </Chart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user growth trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer>
                  <Chart>
                    <ChartGrid />
                    <ChartLine
                      data={userGrowthData}
                      dataKey="month"
                      categories={["users"]}
                      colors={["hsl(var(--primary))"]}
                      valueFormatter={(value) => `${value.toLocaleString()} users`}
                    />
                    <ChartXAxis dataKey="month" />
                    <ChartYAxis />
                    <ChartTooltip>
                      <ChartTooltipContent>
                        <ChartTooltipLabel />
                        <ChartTooltipValue />
                      </ChartTooltipContent>
                    </ChartTooltip>
                  </Chart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Loan Applications</CardTitle>
            <CardDescription>Latest loan applications submitted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-muted-foreground">
                        ${(Math.random() * 10000).toFixed(2)} - {Math.floor(Math.random() * 36) + 6} months
                      </p>
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      i % 3 === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : i % 3 === 1
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {i % 3 === 0 ? "Pending" : i % 3 === 1 ? "Approved" : "Rejected"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{i % 2 === 0 ? "Loan Disbursement" : "Installment Payment"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${i % 2 === 0 ? "text-green-600" : "text-blue-600"}`}>
                    {i % 2 === 0 ? "+" : "-"}${(Math.random() * 1000).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

