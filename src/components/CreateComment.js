import { Auth } from "aws-amplify";
import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createComment } from "../graphql/mutations";

const CreateComment = ({ postId }) => {
  const [comment, setComment] = useState({
    commentOwnerId: "",
    commentOwnerUsername: "",
    content: "",
    postCommentsId: postId,
  });

  useEffect(() => {
    (async () => {
      await Auth.currentUserInfo().then((user) => {
        const { attributes, username } = user;
        setComment((prev) => ({
          ...prev,
          commentOwnerId: attributes.sub,
          commentOwnerUsername: username,
          createdAt: new Date().toISOString(),
        }));
      });
    })();
  }, []);

  const onCommentAdd = async (event) => {
    event.preventDefault();
    const input = comment;
    await API.graphql(graphqlOperation(createComment, { input }));
    setComment((prev) => ({ ...prev, content: "" }));
  };

  return (
    <div>
      <form onSubmit={onCommentAdd} className="add-post">
        <textarea
          name="comment"
          cols="40"
          rows="5"
          required
          placeholder="Add Your Comment..."
          value={comment.content}
          onChange={(e) =>
            setComment((prev) => ({ ...prev, content: e.target.value }))
          }
        ></textarea>
        <input className="btn" value="Add Comment" type="submit" />
      </form>
    </div>
  );
};

export default CreateComment;
