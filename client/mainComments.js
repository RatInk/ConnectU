const token = document.cookie.split("=")[1];



document.addEventListener("DOMContentLoaded", async () => {
  const showAllComments = async () => {
    const tokenCookie = document.cookie.split(";")[1];
    const token = tokenCookie.split("=")[1];
    const usernameCookie = document.cookie.split(";")[0];
    const username = usernameCookie.split("=")[1];
  
    const postId = window.location.search.split("?")[1];
  
    const response = await fetch(`/comments/${postId}`, {
      method: "GET",
      headers: {
        "Authorization": token,
      }
    });
    const comments = await response.json();
    const commentsDiv = document.getElementById("commentsDiv");
    comments.forEach((comment) => {
      const commentElement = createCommentElement(comment);
      commentsDiv.appendChild(commentElement);
    });
  };
  await showAllComments();
});
