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
import { NavLink, useNavigate } from "react-router-dom";
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
      userLogin(data.token, data.role);

      let routeToRedirect = "/";
      if (data.role === "waiter") {
        routeToRedirect = "/waiter/dashboard";
      } else if (data.role === "chef") {
        routeToRedirect = "/chef/dashboard";
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
    <div className="">
      <div className="absolute top-0 left-0 z-10 flex items-center justify-center flex-col w-full h-screen bg-transparent p-2">
        <div className="w-[90vw] p-6 md:p-10 md:px-12 gap-1 flex flex-col items-center justify-center max-w-[480px] my-auto">
          <div className="w-[200px] h-[80px] mb-4">
          </div>

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
              <div className="flex justify-right">
                <NavLink to={"/"} className={"text-xs text-destructive"}>
                  Forget Password?
                </NavLink>
              </div>
              <Button
                type="submit"
                className="bg-black hover:bg-black active:bg-black w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </div>
        {/* <p className="py-1 text-xs text-center">
          Don't have an account?
          <span className="hover:underline active:underline text-destructive font-medium cursor-pointer">
            {" "}
            Create New Account
          </span>
        </p> */}
      </div>

      {/* <ul className="login-boxes z-0">
				{blocks.map((b, i) => {
					return <li key={i} style={b}></li>
				})}
			</ul> */}
    </div>
  );
};

export default LoginView;
