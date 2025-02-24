import React from 'react';
import { Link } from 'react-router-dom';

export default function Success() {
  return (
    <div className="col-sm-6 col-sm-offset-3">
      <br />
      <h1 className="text-white">Success!</h1>
      <p className="text-white">
        A password reset email has been sent to your email address.
      </p>
      <br />
      <Link to="/login" className="btn btn-primary">
        Back to Login
      </Link>
    </div>
  );
}
