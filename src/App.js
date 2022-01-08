import "./App.css";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import CreatePost from "./components/CreatePost";
import DisplayPosts from "./components/DisplayPosts";
import SignOut from "./components/SignOut";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsExports);
function App({ signOut, user }) {
  return (
    <div className="App">
      <SignOut signOut={signOut} user={user.username} />
      <CreatePost />
      <DisplayPosts />
    </div>
  );
}

export default withAuthenticator(App);
