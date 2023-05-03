const { token } = await response.json();

const secretResponse = await fetch("/", {
  headers: {
    Authorization: `${token}`,
  },
});
//check status 401
if (response.status === 401) {
  window.location.href = "./index.html";
} else {
  window.location.href = "./mainpage.html";
}

const getALlPost  = () => {
    return fetch(`${API}/posts`,{
        method: "GET"
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}