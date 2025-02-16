import React from "react";
import { Link } from "react-router-dom";

// Error component: displays a 404 error message with a link to Home
function Error() {
  return (
    <div className="wrapper">
      <h2>Page Not Found</h2>
      <p>
        Go back to <Link to="/">Home</Link>
      </p>
    </div>
  );
}

export default Error;
