"use client"

import { useState } from "react"
import { Download, FileSpreadsheet, FileText, Filter, MoreHorizontal, Plus, Search, Upload } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample report data
const reports = [
  {
    id: "REP-001",
    name: "Monthly Loan Summary - July 2023",
    type: "loan",
    createdAt: "2023-08-01",
    createdBy: "Admin",
    format: "xlsx",
  },
  {
    id: "REP-002",
    name: "User Growth Report - Q2 2023",
    type: "user",
    createdAt: "2023-07-15",
    createdBy: "Admin",
    format: "xlsx",
  },
  {
    id: "REP-003",
    name: "Payment Collection Report - July 2023",
    type: "payment",
    createdAt: "2023-08-02",
    createdBy: "Admin",
    format: "pdf",
  },
  {
    id: "REP-004",
    name: "Loan Disbursement Report - July 2023",
    type: "loan",
    createdAt: "2023-08-02",
    createdBy: "Admin",
    format: "xlsx",
  },
  {
    id: "REP-005",
    name: "Overdue Payments Report - July 2023",
    type: "payment",
    createdAt: "2023-08-03",
    createdBy: "Admin",
    format: "pdf",
  },
]

// Sample templates
const templates = [
  {
    id: "TPL-001",
    name: "Monthly Loan Summary",
    description: "Summary of all loans processed in a month",
    type: "loan",
  },
  {
    id: "TPL-002",
    name: "User Growth Report",
    description: "Analysis of user growth over a period",
    type: "user",
  },
  {
    id: "TPL-003",
    name: "Payment Collection Report",
    description: "Summary of all payments collected in a period",
    type: "payment",
  },
  {
    id: "TPL-004",
    name: "Loan Disbursement Report",
    description: "Details of all loans disbursed in a period",
    type: "loan",
  },
  {
    id: "TPL-005",
    name: "Overdue Payments Report",
    description: "List of all overdue payments",
    type: "payment",
  },
]

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false)
  const [isUploadExcelOpen, setIsUploadExcelOpen] = useState(false)

  // Filter reports based on search term and type
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || report.type === typeFilter

    return matchesSearch && matchesType
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Excel Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsUploadExcelOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Excel
          </Button>
          <Button onClick={() => setIsGenerateReportOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reports">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>View and download previously generated reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search reports..."
                      className="w-full pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="loan">Loan Reports</SelectItem>
                        <SelectItem value="user">User Reports</SelectItem>
                        <SelectItem value="payment">Payment Reports</SelectItem>
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
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Type</TableHead>
                        <TableHead className="hidden md:table-cell">Created</TableHead>
                        <TableHead className="hidden md:table-cell">Format</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No reports found. Try adjusting your search or filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.id}</TableCell>
                            <TableCell>{report.name}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  report.type === "loan"
                                    ? "bg-blue-100 text-blue-800"
                                    : report.type === "user"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{report.createdAt}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="inline-flex items-center gap-1">
                                {report.format === "xlsx" ? (
                                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                                ) : (
                                  <FileText className="h-4 w-4 text-red-600" />
                                )}
                                <span className="uppercase">{report.format}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
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
        </TabsContent>
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Available templates for generating new reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between">
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            template.type === "loan"
                              ? "bg-blue-100 text-blue-800"
                              : template.type === "user"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                        </div>
                        <Button size="sm" onClick={() => setIsGenerateReportOpen(true)}>
                          Generate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Report Dialog */}
      <Dialog open={isGenerateReportOpen} onOpenChange={setIsGenerateReportOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
            <DialogDescription>Select a template and set parameters to generate a new report.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template" className="text-right">
                Template
              </Label>
              <Select defaultValue="TPL-001">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-name" className="text-right">
                Report Name
              </Label>
              <Input id="report-name" className="col-span-3" defaultValue="Monthly Loan Summary - August 2023" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date-range" className="text-right">
                Date Range
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input type="date" defaultValue="2023-08-01" />
                <span className="flex items-center">to</span>
                <Input type="date" defaultValue="2023-08-31" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="format" className="text-right">
                Format
              </Label>
              <Select defaultValue="xlsx">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="include-charts" className="text-right">
                Options
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <input type="checkbox" id="include-charts" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                <Label htmlFor="include-charts" className="text-sm font-normal">
                  Include charts and visualizations
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateReportOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setIsGenerateReportOpen(false)}>
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Excel Dialog */}
      <Dialog open={isUploadExcelOpen} onOpenChange={setIsUploadExcelOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Excel File</DialogTitle>
            <DialogDescription>Upload an Excel file to import data into the system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file-type" className="text-right">
                File Type
              </Label>
              <Select defaultValue="users">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="users">User Data</SelectItem>
                  <SelectItem value="loans">Loan Data</SelectItem>
                  <SelectItem value="payments">Payment Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file-upload" className="text-right">
                File
              </Label>
              <div className="col-span-3">
                <Input id="file-upload" type="file" accept=".xlsx,.xls,.csv" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="options" className="text-right">
                Options
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="overwrite" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="overwrite" className="text-sm font-normal">
                    Overwrite existing data
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="validate" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                  <Label htmlFor="validate" className="text-sm font-normal">
                    Validate data before import
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadExcelOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setIsUploadExcelOpen(false)}>
              Upload & Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

