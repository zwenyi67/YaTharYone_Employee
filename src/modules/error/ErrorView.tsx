import { Button } from "@/components/ui/button";
import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";

export default function ErrorView() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error(error);

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center min-h-screen">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p className="text-2xl">
          <i>
            {error.status} {error.statusText}
          </i>
        </p>
        <Button
          variant={"secondary"}
          onClick={() => {
            navigate("/");
          }}
        >
          Back to home
        </Button>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center min-h-screen">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p className="text-2xl">
          <i>{error.message}</i>
        </p>
        <Button
          variant={"secondary"}
          onClick={() => {
            navigate("/");
          }}
        >
          Back to home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 justify-center min-h-screen">
      <h1>Oops!</h1>
      <p>Sorry, an unknown error has occurred.</p>
      <Button
        variant={"secondary"}
        onClick={() => {
          navigate("/");
        }}
      >
        Back to home
      </Button>
    </div>
  );
}
