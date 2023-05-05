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


  const showComments = document.createElement("button");
  showComments.textContent = "Show Comments";
  showComments.addEventListener("click", async () => {
    window.location.href = `/comments.html?${post.post_id}`;
  });

  const likeCommentButton = document.createElement("button");
  likeCommentButton.textContent = "Like Post";
  likeCommentButton.addEventListener("click", async () => {
    const token = document.cookie.split("=")[1];

    const response = await fetch(`/like`, {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post_id: post.post_id }),

    });

    if (response.status === 200) {
      alert("Post liked successfully");
    }
    else {
      alert("Post not liked");
    }
  });

  const dislikeCommentButton = document.createElement("button");
  dislikeCommentButton.textContent = "DisLike Post";
  dislikeCommentButton.addEventListener("click", async () => {
    const token = document.cookie.split("=")[1];

    const response = await fetch(`/dislike`, {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post_id: post.post_id }),

    });

    if (response.status === 200 ) {
      alert("Post disliked successfully");
    }
    else {
      alert("Post not liked");
    }
  });


  postDiv.appendChild(titleElement)
  postDiv.appendChild(contentElement);
  postDiv.appendChild(usernameElement);
  postDiv.appendChild(editButon);
  postDiv.appendChild(showComments);
  postDiv.appendChild(likeCommentButton);
  postDiv.appendChild(dislikeCommentButton);

  return postDiv;
}

const displayAllPosts = async () => {
  const token = document.cookie.split("=")[1];  
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
    const token = document.cookie.split("=")[1];
    if (!title || !content) return;
    const response = await fetch("/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify({ title, content }),
    });
    if (response.status === 200) {
      window.location.href = "./mainpage.html";
      alert("Post created successfully");
    }
    else {
      alert("Post not created");
    }
  });
});

