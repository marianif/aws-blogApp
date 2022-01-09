import React from "react";

const Comment = ({ commentOwnerUsername, createdAt, content }) => {
  return (
    <div>
      <div className="comment">
        <span style={{ fontStyle: "italic" }}>
          {`Comment by: ${commentOwnerUsername} on: `}
          <time>{createdAt}</time>
        </span>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Comment;
