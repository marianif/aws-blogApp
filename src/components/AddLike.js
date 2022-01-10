import React, { useState, useEffect } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { API, graphqlOperation } from "aws-amplify";
import { Auth } from "aws-amplify";
import { createLike } from "../graphql/mutations";

const AddLike = ({ postId }) => {
  const [user, setUser] = useState({
    id: "",
    username: "",
  });

  useEffect(() => {
    (async () => {
      await Auth.currentUserInfo().then((user) => {
        const { attributes, username } = user;
        setUser({
          id: attributes.sub,
          username,
        });
      });
    })();
  }, []);

  const onLikeCreation = async () => {
    const input = {
      likeOwnerId: user.id,
      likeOwnerUsername: user.username,
      postLikesId: postId,
      numberLikes: 1,
    };
    await API.graphql(graphqlOperation(createLike, { input }));
  };
  return (
    <button className="like-button" onClick={onLikeCreation}>
      <FaThumbsUp />
    </button>
  );
};

export default AddLike;
