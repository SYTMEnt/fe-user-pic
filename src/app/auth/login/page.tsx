'use client'
import { useState, ChangeEvent, FormEvent } from "react";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1ztOjIUO9hp
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface FormState {
    username: string;
    password: string;
}

export default function Component() {
    const router = useRouter()
    const [form, setForm] = useState<FormState>({
        username: "",
        password: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    // Function to handle form submission (optional)
    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const login = await fetch(
            `${process.env.NEXT_PUBLIC_BE_URL}/login`,
            {
                method : "POST",
                body : JSON.stringify({
                    userName: form.username,
                    password: form.password
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )
        if(login.status === 200) {
            const data = await login.json()
            console.log(JSON.stringify(data))
            localStorage.setItem("token",data.token)
            router.push("/")
        }
        else {
            alert("wrong username password")
        }
        console.log('Form submitted with:', form);
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit}>
                <Card className="mx-auto w-80">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="username"
                                required
                                type="text"
                                value={form.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                required
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full hover:bg-blue-500 transition-colors" type="submit">
                            Sign in
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
