import React from "react";

const SignOut = ({ signOut, user }) => {
  return (
    <div className="signoutContainer">
      <h1> Hello {user}</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default SignOut;
