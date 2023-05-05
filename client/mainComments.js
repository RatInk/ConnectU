const token = document.cookie.split("=")[1];

const displayComments = (comment) => {
  const commentContainer = document.createElement("div");
  commentContainer.className = "comment-container";

  const commentContent = document.createElement("p");
  commentContent.textContent = comment.content;
  commentContainer.appendChild(commentContent);

  const commentUsername = document.createElement("p");
  commentUsername.textContent = comment.username;
  commentContainer.appendChild(commentUsername);

  const editCommentButton = document.createElement("button");
  editCommentButton.textContent = "Edit Comment";
  commentContainer.appendChild(editCommentButton);
  editCommentButton.addEventListener("click", () => {
    window.location.href = `/editComment.html?${comment.comment_id}`;
  });

  const deleteCommentButton = document.createElement("button");
  deleteCommentButton.textContent = "Delete Comment";
  commentContainer.appendChild(deleteCommentButton);
  deleteCommentButton.addEventListener("click", async () => {
    const token = document.cookie.split("=")[1];
    const post_id = window.location.search.split("?")[1];
    const response = await fetch(`/comment/${comment.comment_id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      window.location.href = `/comments.html?${post_id}`;
      alert("Comment deleted successfully");
    }
    else {
      alert("Comment not deleted");
    }
  });

return commentContainer;
};


document.addEventListener("DOMContentLoaded", async () => {
  const showAllComments = async () => {
    const token = document.cookie.split("=")[1];

  
    const post_id = window.location.search.split("?")[1];
  
    const response = await fetch(`/comments/${post_id}`, {
      method: "GET",
      headers: {
        "Authorization": token,
      }
    });
    const comments = await response.json();

    const commentsDiv = document.getElementById("comments");
    comments.forEach((comment) => {
      const commentElement = displayComments(comment);
      commentsDiv.appendChild(commentElement);
    });
  };
  showAllComments();
});

document.addEventListener("DOMContentLoaded", () => {
  const addCommentForm = document.getElementById("addCommentForm");
  addCommentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const token = document.cookie.split("=")[1];
    const post_id = window.location.search.split("?")[1];
    const content = document.getElementById("commentContent").value;
    const response = await fetch("/comment", {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, token, post_id}),
    });
    if (response.status === 200) {
      window.location.href = `/comments.html?${post_id}`;
      alert("Comment added successfully");
    }
    else {
      alert("Comment not added");
    }
  });
}
);

document.addEventListener("DOMContentLoaded", () => {
  const editCommentForm = document.getElementById("formEditComment");
  editCommentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const token = document.cookie.split("=")[1];
    const comment_id = window.location.search.split("?")[1];
    const content = document.getElementById("comment").value;
    const response = await fetch(`/comment/${comment_id}`, {
      method: "PUT",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, token, comment_id }),
    });
    
    const { post_id } = await response.json();

    if (response.status === 200) {
      window.location.href = `/comments.html?${post_id}`;
      alert("Comment edited successfully");
    }
    else {
      alert("Comment not edited");
    }
  });
}
);