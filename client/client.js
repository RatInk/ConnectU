if (location.host.includes('localhost')) {
  // Load livereload script if we are on localhost
  document.write(
    '<script src="http://' +
      (location.host || 'localhost').split(':')[0] +
      ':35729/livereload.js?snipver=1"></' +
      'script>'
  )
}

  document.addEventListener("DOMContentLoaded", () => {
        const inputUsername = document.getElementById("username");
        const inputPassword = document.getElementById("password");
        const buttonLogin = document.getElementById("login");
        buttonLogin.addEventListener("click", async () => {
        const username = inputUsername.value.trim();
        const password = inputPassword.value.trim();
        
        if (!username || !password) return console.log("Please enter Right username and password");
        const response = await fetch("/login/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        })
          const { token } = await response.json();
          document.cookie = "token=" + token;
          document.cookie = "username=" + username;

        //check status 401
        if (response.status === 401) {
          window.location.href = "./index.html";
          alert("Incorrect Username or Password");
        } else {
          window.location.href = "./mainpage.html";
        }
      });
    });

    document.addEventListener("DOMContentLoaded", () => {
      const inputUsername = document.getElementById("reUsername");
      const inputPassword = document.getElementById("rePassword");
      const buttonLogin = document.getElementById("register");
      buttonLogin.addEventListener("click", async () => {
      const username = inputUsername.value;
      const password = inputPassword.value;
      if (!username || !password) return;
      const response = await fetch("/Register", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
    })
  })