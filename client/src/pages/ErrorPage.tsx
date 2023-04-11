import classes from "./ErrorPage.module.scss";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

// Error page that is beeing displayed if app throws an error while rendering, loading data, or performing data mutations.
// Code explanation: https://github.com/remix-run/react-router/discussions/9628

const ErrorPage = () => {
  let error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className={classes.errorPage}>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          {error.status} {error.statusText}
        </p>
      </div>
    );
  }

  return (
    <div className={classes.errorPage}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  );
};

export default ErrorPage;
