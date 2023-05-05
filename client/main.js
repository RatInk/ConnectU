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
    postId = post.id;
    window.location.href = `/editPost.html/${postId}`;
  });
  const deleteButon = document.createElement("button");
  deleteButon.textContent = "Delete Post";
  postId = post.id;
  deleteButon.addEventListener("click", async () => {
    const response = await fetch(`/post/${postId}`, {
      method: "DELETE",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    if (response.status === 200) {
      window.location.href = "/";
      alert("Post deleted successfully");
    }
    else {
      alert("Post not deleted");
    }
  });

  postDiv.appendChild(titleElement)
  postDiv.appendChild(contentElement);
  postDiv.appendChild(usernameElement);
  postDiv.appendChild(editButon);
  postDiv.appendChild(deleteButon);

  return postDiv;
}

const displayAllPosts = async () => {
  const tokenCookie = document.cookie.split(";")[1];
  const token = tokenCookie.split("=")[1];
  const usernameCookie = document.cookie.split(";")[0];
  const response = await fetch("/posts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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

document.addEventListener("DOMContentLoaded", () => {
  const formEditPost = document.getElementById("formEdit");
  formEditPost.addEventListener("submit"), async (event) => {

  }
})

const formEditPost = document.getElementById("formEdit");
formEditPost.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const title = formData.get("title");
  const content = formData.get("content");

  const tokenCookie = document.cookie.split(";")[1];
  const token = tokenCookie.split("=")[1];
  const usernameCookie = document.cookie.split(";")[0];
  const username = usernameCookie.split("=")[1];
  const postId = window.location.pathname.split("/")[2];

  if (!title || !content) return;
  const response = await fetch(`/post/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
    body: JSON.stringify({ title, content, username}),
  });
  if (response.status === 200) {
    window.location.href = "/";
    alert("Post edited successfully");
  }
  else {
    alert("Post not edited");
  }
});

