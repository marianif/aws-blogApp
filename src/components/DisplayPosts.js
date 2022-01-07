import React, { useEffect, useState } from "react";
import { listPosts } from "../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import { onCreatePost } from "../graphql/subscriptions";

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
    const createPostListener = API.graphql(
      graphqlOperation(onCreatePost)
    ).subscribe({
      next: (postData) => {
        const newPost = postData.value.data.onCreatePost;
        const prevPosts = posts.filter((post) => post.id !== newPost.id);
        const newPostsList = [newPost, ...prevPosts];
        console.log(newPostsList);
        setPosts(newPostsList);
      },
    });
    return () => {
      createPostListener.unsubscribe();
    };
  }, [posts]);

  const getPosts = async () => {
    const result = await API.graphql(graphqlOperation(listPosts));
    // console.log("Posts:" + JSON.stringify(result.data.listPosts.items));
    setPosts(result.data.listPosts.items);
  };

  return posts.map((post) => {
    const { id, postTitle, postOwnerUsername, postBody, createdAt } = post;
    return (
      <div className="posts" key={id}>
        <h1>{postTitle}</h1>
        <span>
          {`Author: ${postOwnerUsername}`}
          {" - on:  "}
          <time style={{ fontStyle: "italic" }}>{`${new Date(
            createdAt
          ).toDateString()}`}</time>
        </span>
        <p>{postBody}</p>
        <br></br>
        <div className="btnContainer">
          <EditPost />
          <DeletePost />
        </div>
      </div>
    );
  });
};

export default DisplayPosts;
