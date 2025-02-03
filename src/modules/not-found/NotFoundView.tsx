import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { useNavigate } from "react-router-dom";

const NotFoundView = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();


  const back = () => {
    if (isAuthenticated && role === "waiter") {
      navigate('/waiter/dashboard')
    }

    if (isAuthenticated && role === "chef") {
      navigate('/chef/dashboard')
    }

    if(!isAuthenticated) {
      navigate('/auth/login')
    }
  }

  return (
    <div className="flex flex-col gap-3 items-center justify-center min-h-screen">
      <p className="text-4xl font-bold">
        <i>404</i>
      </p>
      <h1>Oops!</h1>
      <p>Sorry, The page you are looking for doesn't exist.</p>
      <Button
        variant={"secondary"}
        onClick={back}
      >
        Back to home
      </Button>
    </div>
  );
};

export default NotFoundView;
