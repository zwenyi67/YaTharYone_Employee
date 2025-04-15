import api from "@/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const FormSchema = z.object({
  employee_id: z.string().min(3, {
    message: "Employee ID must contain at least 3 characters.",
  }),
  username: z.string().min(3, {
    message: "Username must contain at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must contain at least 6 characters.",
  }),
});

const LoginView = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { toast } = useToast();
  const { userLogin } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      employee_id: "",
      username: "",
      password: "",
    },
  });

  const { mutate: loginUser } = api.auth.loginMutation.useMutation({
    onMutate: () => setIsLoading(true),
    onSuccess: (data) => {
      userLogin(data.token, data.role, data.user);

      let routeToRedirect = "/";
      if (data.role === "waiter") {
        routeToRedirect = "/waiter/dashboard";
      } else if (data.role === "chef") {
        routeToRedirect = "/chef/dashboard";
      }
      else if (data.role === "cashier") {
        routeToRedirect = "/cashier/dashboard";
      }
      navigate(routeToRedirect, { replace: true });

      toast({
        title: `${t("success-title.login")} ${form.getValues().employee_id}`,
        description: t("success-msg.login"),
        variant: "success",
      });
    },
    onError: (error) => {
      console.error("Error during login:", error);

      toast({
        title: t("error-title.login"),
        description: t("error-msg.login"),
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    loginUser(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white">
      <div className="bg-white rounded-2xl shadow-xl w-[90vw] max-w-md px-8 py-10 flex flex-col gap-6 items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/favicon.png"
            alt="YaTharYone Logo"
            className="mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide ms-2 pb-1">YaTharYone</h1>
        </div>

        {/* Login Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="employee_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Employee ID"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div className="flex justify-right">
              <NavLink to={"/"} className={"text-xs text-destructive"}>
                Forget Password?
              </NavLink>
            </div> */}
            <Button
              type="submit"
              className="bg-secondary hover:bg-secondary active:bg-secondary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        {/* Optional bottom link */}
        {/* <p className="text-xs text-muted-foreground">
          Don't have an account?{" "}
          <span className="text-primary hover:underline cursor-pointer font-medium">
            Create New Account
          </span>
        </p> */}
      </div>
    </div>
  );
};

export default LoginView;
