import React, { useEffect, useState } from "react";
import { listPosts, listComments } from "../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import {
  onCreateComment,
  onCreateLike,
  onCreatePost,
} from "../graphql/subscriptions";
import CreateComment from "./CreateComment";
import Comment from "./Comment";
import AddLike from "./AddLike";

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({
    id: "",
    username: "",
  });

  useEffect(() => {
    getPostAndComments("posts");
    getPostAndComments("comments");
    const createPostListener = API.graphql(
      graphqlOperation(onCreatePost)
    ).subscribe({
      next: (postData) => {
        const newPost = postData.value.data.onCreatePost;
        const prevPosts = posts.filter((post) => post.id !== newPost.id);
        const newPostsList = [newPost, ...prevPosts];
        setPosts(newPostsList);
      },
    });

    const createLikesListener = API.graphql(
      graphqlOperation(onCreateLike)
    ).subscribe({
      next: (postData) => {
        const createdLike = postData.value.data.onCreateLike;
        console.log(createdLike);
        let postsList = [...posts];
        postsList.map((post) => {
          if (post.id === createdLike.post.id) {
            post.likes.items.push(createdLike);
          }
        });
        setPosts(postsList);
      },
    });
    return () => {
      createPostListener.unsubscribe();
      createLikesListener.unsubscribe();
    };
  }, []);

  const getPostAndComments = async (type) => {
    if (type === "posts") {
      const result = await API.graphql(graphqlOperation(listPosts));
      const postsList = await result.data.listPosts.items;
      setPosts(postsList);
    } else if (type === "comments") {
      const result = await API.graphql(graphqlOperation(listComments));
      let comments = await result.data.listComments.items;
      comments.forEach((comment) => {
        posts.map((post) => {
          if (post.id === comment.post.id) {
            post.comments.items.push(comment);
          }
        });
      });
    }
  };

  return posts.map((post) => {
    const { id, postTitle, postOwnerUsername, postBody, createdAt } = post;
    return (
      <div className="posts" key={id}>
        <div className="postContainer">
          <span>
            <h1>{postTitle}</h1>
            {`Author: ${postOwnerUsername}`}
            {" - on:  "}
            <time style={{ fontStyle: "italic" }}>{`${new Date(
              createdAt
            ).toDateString()}`}</time>
            <p>{postBody}</p>
          </span>
          <span>
            <AddLike postId={post.id} />
          </span>
        </div>
        <br></br>

        <div className="btnContainer">
          <EditPost postId={post.id} />
          <DeletePost postId={post.id} />
        </div>
        <span>
          <CreateComment postId={post.id} />
          {post.comments.items.length > 0 &&
            post.comments.items.map((comment, index) => {
              const { commentOwnerUsername, createdAt, content } = comment;
              return (
                <Comment
                  key={index}
                  commentOwnerUsername={commentOwnerUsername}
                  createdAt={createdAt}
                  content={content}
                />
              );
            })}
        </span>
      </div>
    );
  });
};

export default DisplayPosts;
