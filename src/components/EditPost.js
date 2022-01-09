import { Auth } from "aws-amplify";
import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { updatePost } from "../graphql/mutations";

const EditPost = ({ postId }) => {
  const [show, setShow] = useState(false);
  const [editedPost, setEditedPost] = useState({
    id: postId,
    postOwnerId: "",
    postOwnerUsername: "",
    postTitle: "",
    postBody: "",
  });

  useEffect(() => {
    (async () => {
      await Auth.currentUserInfo().then((user) => {
        setEditedPost((prev) => ({
          ...prev,
          postOwnerId: user.attributes.sub,
          postOwnerUsername: user.username,
        }));
      });
    })();
  }, []);

  const handleModal = () => {
    setShow(!show);
  };

  const onPostUpdate = async (event) => {
    event.preventDefault();
    const input = editedPost;
    await API.graphql(graphqlOperation(updatePost, { input }));
    setShow(false);
  };

  return (
    <>
      {show && (
        <div className="modal">
          <button className="close" onClick={handleModal}>
            x
          </button>
          <form onSubmit={(event) => onPostUpdate(event)} className="add-post">
            <input
              style={{ font: "20px" }}
              type="text"
              placeholder="Title"
              name="post-title"
              value={editedPost.postTitle}
              onChange={(e) =>
                setEditedPost((prev) => ({
                  ...prev,
                  postTitle: e.target.value,
                }))
              }
            />
            <textarea
              style={{ font: "18px" }}
              type="text"
              placeholder="Write Something..."
              name="post-body"
              value={editedPost.postBody}
              onChange={(e) =>
                setEditedPost((prev) => ({ ...prev, postBody: e.target.value }))
              }
            />
            <input type="submit" className="btn" />
          </form>
        </div>
      )}
      <button onClick={handleModal}>Edit Post</button>
    </>
  );
};

export default EditPost;
