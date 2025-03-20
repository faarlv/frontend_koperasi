"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import axios from "axios";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    const name = (document.getElementById("username") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;
  
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/signin",
        { name: name, password: password }, // Use "name" because your backend expects it
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Ensure cookies are sent if your backend uses sessions
        }
      );
  
      console.log("Login success:", response.data);
      localStorage.setItem("auth-token", response.data.token);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Dashboard</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="username">Username</Label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <User className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        id="username"
        placeholder="Enter your username"
        type="text"
        autoCapitalize="none"
        autoComplete="username"
        autoCorrect="off"
        className="pl-10"
        required
      />
    </div>
  </div>
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label htmlFor="password">Password</Label>
      <Button variant="link" className="px-0 font-normal h-auto" type="button">
        Forgot password?
      </Button>
    </div>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Lock className="h-5 w-5 text-gray-400" />
      </div>
      <Input id="password" type={showPassword ? "text" : "password"} className="pl-10 pr-10" required />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-gray-400" />
        ) : (
          <Eye className="h-4 w-4 text-gray-400" />
        )}
        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
      </Button>
    </div>
  </div>
</CardContent>

          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
