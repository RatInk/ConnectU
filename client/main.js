const token = document.cookie.split("=")[1];

const displayPosts = (post) => {
  const postDiv = document.createElement("div");
  postDiv.classList.add("postDiv");


  const usernameElement = document.createElement("p");
  usernameElement.textContent = post.username;

  const titleElement = document.createElement("h1");
  titleElement.textContent = post.title;

  const contentElement = document.createElement("p");
  contentElement.textContent = post.content;

  const editButon = document.createElement("button");
  editButon.textContent = "Edit Post";
  editButon.addEventListener("click", () => {
    window.location.href = `/editPost.html?${post.post_id}`;
  });
  const deleteButon = document.createElement("button");
  deleteButon.textContent = "Delete Post";
  deleteButon.addEventListener("click", async () => {
    const tokenCookie = document.cookie.split(";")[1];
    const token = tokenCookie.split("=")[1];
    const usernameCookie = document.cookie.split(";")[0];
    const username = usernameCookie.split("=")[1];
    const postId = window.location.pathname.split("/")[2];
    const response = await fetch(`/post/${post.post_id}`, {
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

  const showComments = document.createElement("button");
  showComments.textContent = "Show Comments";
  showComments.addEventListener("click", async () => {
    window.location.href = `/comments.html?${post.post_id}`;
  });


  postDiv.appendChild(titleElement)
  postDiv.appendChild(contentElement);
  postDiv.appendChild(usernameElement);
  postDiv.appendChild(editButon);
  postDiv.appendChild(deleteButon);
  postDiv.appendChild(showComments);

  return postDiv;
}

const displayAllPosts = async () => {
  const tokenCookie = document.cookie.split(";")[1];
  const token = tokenCookie.split("=")[1];
  const usernameCookie = document.cookie.split(";")[0];
  const response = await fetch("/posts", {
    method: "GET",
    headers: {
      "Authorization": token
    }
  });
  const posts = await response.json();
  const postsDiv = document.getElementById("postdiv");
  posts.forEach((post) => {
    const postElement = displayPosts(post);
    postsDiv.appendChild(postElement);
  });
};

displayAllPosts();

document.addEventListener("DOMContentLoaded", () => {
  const formCreatePost = document.getElementById("formCreate");
  formCreatePost.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const title = formData.get("title");
    const content = formData.get("content");
    const tokenCookie = document.cookie.split(";")[1];
    const token = tokenCookie.split("=")[1];
    const usernameCookie = document.cookie.split(";")[0];
    const username = usernameCookie.split("=")[1];
    if (!title || !content) return;
    const response = await fetch("/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify({ title, content, username }),
    });
  });
});

//fetch all coments for a post with the post_id in the url
