import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { deletePost } from "../graphql/mutations";

const DeletePost = ({ postId }) => {
  const onPostDelete = async () => {
    const input = {
      id: postId,
    };
    await API.graphql(graphqlOperation(deletePost, { input }));
  };
  return (
    <button style={{ backgroundColor: "crimson" }} onClick={onPostDelete}>
      Delete Post
    </button>
  );
};

export default DeletePost;
