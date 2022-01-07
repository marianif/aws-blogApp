import React, { useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createPost } from "../graphql/mutations";

const CreatePost = () => {
  const [post, setPost] = useState({
    postOwnerId: "123abc",
    postOwnerUsername: "Federica",
    postTitle: "",
    postBody: "",
  });

  const onPostCreation = async (event) => {
    event.preventDefault();
    const input = {
      postOwnerId: post.postOwnerId,
      postBody: post.postBody,
      postTitle: post.postTitle,
      postOwnerUsername: post.postOwnerUsername,
      createdAt: new Date().toISOString(),
    };
    await API.graphql(graphqlOperation(createPost, { input }));
    setPost({
      postOwnerId: "",
      postOwnerUsername: "",
      postTitle: "",
      postBody: "",
    });
  };
  return (
    <form className="add-post" onSubmit={onPostCreation}>
      <input
        style={{ font: "20px" }}
        type="text"
        placeholder="Title"
        name="post-title"
        value={post.postTitle}
        onChange={(e) =>
          setPost((prev) => ({ ...prev, postTitle: e.target.value }))
        }
      />
      <textarea
        style={{ font: "18px" }}
        type="text"
        placeholder="Write Something..."
        name="post-body"
        value={post.postBody}
        onChange={(e) =>
          setPost((prev) => ({ ...prev, postBody: e.target.value }))
        }
      />
      <input type="submit" className="btn" />
    </form>
  );
};

export default CreatePost;
