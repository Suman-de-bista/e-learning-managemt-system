'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  return (
    <div className="w-full max-w-sm">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription className="text-md">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-bold">Email</Label>
                <Input
                  id="email"
                  className="w-full bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  type="email"
                  placeholder="example@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="font-bold">Password</Label>
                </div>
                <Input
                  id="password"
                  className="w-full bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  type="password"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full border-none text-white bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            Login
          </Button>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
                        Don't have an account?
                        <a href="/register" className="text-sm text-blue-500 hover:underline">
                            Sign up
                        </a>
                    </span>
        </CardFooter>
      </Card>
    </div>
  );
}
