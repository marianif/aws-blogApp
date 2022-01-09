import React, { useEffect, useState } from "react";
import { listPosts, listComments } from "../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import { onCreateComment, onCreatePost } from "../graphql/subscriptions";
import CreateComment from "./CreateComment";
import Comment from "./Comment";

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // getPosts();
    // getComments();
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

    // const createCommentListener = API.graphql(
    //   graphqlOperation(onCreateComment)
    // ).subscribe({
    //   next: (commentData) => {
    //     const createdComment = commentData.value.data.onCreateComment;
    //     let postsList = [...posts];
    //     for (let post of postsList) {
    //       if (post.id === createdComment.post.id) {
    //         post.comments.items.push(createdComment);
    //       }
    //     }
    //     setPosts(postsList);
    //   },
    // });
    return () => {
      createPostListener.unsubscribe();
    };
  }, []);

  // const getPosts = async () => {
  //   const result = await API.graphql(graphqlOperation(listPosts));
  //   // console.log("Posts:" + JSON.stringify(result.data.listPosts.items));
  //   const postsList = await result.data.listPosts.items;
  //   setPosts(postsList);
  // };

  // const getComments = async () => {
  //   const result = await API.graphql(graphqlOperation(listComments));
  //   // console.log("Comments:" + JSON.stringify(result.data.listComments.items));
  //   // console.log(result.data.listComments.items);
  //   let comments = await result.data.listComments.items;
  //   comments.forEach((comment) => {
  //     posts.map((post) => {
  //       if (post.id === comment.post.id) {
  //         post.comments.items.push(comment);
  //       }
  //     });
  //   });
  // };

  const getPostAndComments = async (type) => {
    if (type === "posts") {
      const result = await API.graphql(graphqlOperation(listPosts));
      // console.log("Posts:" + JSON.stringify(result.data.listPosts.items));
      const postsList = await result.data.listPosts.items;
      setPosts(postsList);
    } else if (type === "comments") {
      const result = await API.graphql(graphqlOperation(listComments));
      // console.log("Comments:" + JSON.stringify(result.data.listComments.items));
      // console.log(result.data.listComments.items);
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
