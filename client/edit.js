
document.addEventListener("DOMContentLoaded", () => {
    const formEditPost = document.getElementById("formEdit");
    formEditPost.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const title = formData.get("title");
      const content = formData.get("content");
      const token = document.cookie.split("=")[1];
      const post_id = window.location.search.split("?")[1];
      if (!title || !content) return;
      const response = await fetch(`/post/${post_id}`, {
        method: "PUT",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      if (response.status === 200) {
        window.location.href = "./mainpage.html";
        alert("Post edited successfully");
      }
      else {
        alert("Post not edited");
      }
    });
  });
//edit comments
document.addEventListener("DOMContentLoaded", () => {
    const formEditComment = document.getElementById("formEditComment");
    formEditComment.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const comment = formData.get("comment");

      const token = document.cookie.split("=")[1];
      const comment_id = window.location.search.split("?")[1];
      if (!comment) return;
      const response = await fetch(`/comment/${comment_id}`, {
        method: "PUT",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });
      if (response.status === 200) {
        window.location.href = "./mainpage.html";
        alert("Comment edited successfully");
      }
      else {
        alert("Comment not edited");
      }
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const deleteButton = document.getElementById("deleteButton");
    deleteButton.addEventListener("click", async (event) => {
      event.preventDefault();

      const token = document.cookie.split("=")[1];
      const post_id = window.location.search.split("?")[1];
      const response = await fetch(`/post/${post_id}`, {
        method: "DELETE",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        window.location.href = "./mainpage.html";
        alert("Post deleted successfully");
      }
      else {
        alert("Post not deleted");
      }
    });
  }
  );