"use client"

import { useEffect, useState } from "react"
import { Check, Download, Edit, MoreHorizontal, Plus, Search, Trash, Upload, User, X } from "lucide-react"

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
import axios from "axios"
import { format } from "date-fns"

export default function UsersPage() {
  const [users, setUsers] = useState([]); // Store users from API
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", password: "" });
  const [editedUser, setEditedUser] = useState({ name: "", email: "", phone: "", password: "" });


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/user/all"); // Replace with your actual API
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  

  const handleAddUser = async () => {
    try {
      const response = await axios.post("http://localhost:3001/user/add", newUser);
      console.log(newUser)
      setUsers([...users, response.data]); // Update the user list
      setIsAddUserOpen(false);
      setNewUser({ name: "", email: "", phone: "", password: "" }); // Reset form
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  // Filter users based on search term and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || user.role === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteUser = async () => {
    console.log(selectedUser)
    if (selectedUser !== null) {
      try {
        await axios.delete(`http://localhost:3001/user/delete/${selectedUser}`); // Send DELETE request
        setUsers(users.filter((user) => user.id !== selectedUser)); // Update state
        console.log(`Deleted user with ID: ${selectedUser}`);
      } catch (err) {
        console.error("Error deleting user:", err);
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
      }
    }
  };

  const openEditDialog = (user) => {
    setSelectedUser(user.id); // Set selected user ID
    setEditedUser({ ...user }); // Ensure a new object is created
    setIsEditUserOpen(true);
  };
  
  

  // Handle Edit User
  const handleEditUser = async (updatedUser) => {
    try {
      const response = await axios.put(`http://localhost:3001/user/update/${updatedUser.id}`, updatedUser);
      setUsers(users.map((user) => (user.id === updatedUser.id ? response.data : user))); // Update user list
      setIsEditUserOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };
  

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={() => setIsAddUserOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts, view details, and control access.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
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
                    <SelectItem value="MEMBER">member</SelectItem>
                    <SelectItem value="ADMIN">admin</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => document.getElementById("import-file")?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Import Users
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export Users
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <input
                  id="import-file"
                  type="file"
                  accept=".csv,.xlsx"
                  className="hidden"
                  onChange={(e) => {
                    // Handle file import
                    console.log("Importing file:", e.target.files?.[0]?.name)
                  }}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Join Date</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No users found. Try adjusting your search or filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.phone}</TableCell>
                        <TableCell className="hidden md:table-cell">{format(new Date(user.createdAt), "PPpp")   }</TableCell>
                        <TableCell className="hidden md:table-cell">{user.password}</TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.role === "ADMIN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
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
                            <DropdownMenuContent align="end" >
                              <DropdownMenuItem onClick={()=>{
                              openEditDialog(user)
                            }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedUser(user.id)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete User
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

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" className="col-span-3" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" className="col-span-3" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" className="col-span-3" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="text" className="text-right">
                password
              </Label>
              <Input id="password" className="col-span-3"  value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}/>
            </div>
            
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Save User</Button>         
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit User</DialogTitle>
      <DialogDescription>Edit user account. Click save when you're done.</DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input 
          id="name" 
          className="col-span-3" 
          value={editedUser?.name || ""} 
          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })} 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">Email</Label>
        <Input 
          id="email" 
          type="email" 
          className="col-span-3" 
          value={editedUser?.email || ""} 
          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })} 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">Phone</Label>
        <Input 
          id="phone" 
          className="col-span-3" 
          value={editedUser?.phone || ""} 
          onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })} 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">Password</Label>
        <Input 
          id="password" 
          className="col-span-3"  
          value={editedUser?.password || ""} 
          onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })} 
        />
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
      <Button onClick={() => handleEditUser(editedUser)}>Save Changes</Button>         
    </DialogFooter>
  </DialogContent>
</Dialog>


      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

