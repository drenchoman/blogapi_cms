
const myForm = document.getElementById("login");
const main = document.getElementById("main")
const error = document.getElementsByClassName("errorMessage");
const home = document.getElementById("home")
const logout = document.getElementById("logout");

home.addEventListener("click", () => {
  window.location.reload();
});

logout.addEventListener("click", () => {
  localStorage.clear();
})

function init(){
  let token = checkToken()
  if (token){
    updateHome();
    logout.innerHTML = "Logout"
    return;
  }
  logout.innerHTML = "Hello World"
}

init();


myForm.addEventListener("submit", async function (e){
  e.preventDefault();
  const loginData = new FormData(myForm).entries()
  let res = await fetch("https://glacial-thicket-60246.herokuapp.com/api/login",{
    method: "POST",
    headers: {"Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(loginData))
  });

let data = await res.json();
if(res.status === 200){
    saveTokenData(data);
    updateHome();
} else{
  error[0].innerHTML = data.info.message
}

});





function addHomeListeners(){
  const addPost = document.getElementsByClassName("addP");
  const deletePost = document.getElementsByClassName("deleteP");
  const updatePost = document.getElementsByClassName("updateP");
  const deleteComment = document.getElementsByClassName("deleteC");



  addPost[0].addEventListener("click", function (e){
    addPUpdate();
  });
  deletePost[0].addEventListener("click", async function (e){
    let req = await fetch('https://glacial-thicket-60246.herokuapp.com/api/posts');
    let data = await req.json()
    updateDeleteP(data);
  });
  updatePost[0].addEventListener("click", async function (e){
    let req = await fetch('https://glacial-thicket-60246.herokuapp.com/api/posts');
    let data = await req.json();
    updatePostP(data);
  });
  deleteComment[0].addEventListener("click", async function (e){
    let req = await fetch('https://glacial-thicket-60246.herokuapp.com/api/posts');
    let data = await req.json();
    let comments = true
    updateDeleteP(data, comments );
  })

}


function checkToken(){
  let token = localStorage.getItem("token");
  if(token){
    return token
  }
  return;
}


function saveTokenData(data){
  localStorage.setItem("token", data.token)
  localStorage.setItem("username", data.body.username )
}

function updateHome(){
  main.innerHTML = ""
  const div = document.createElement("div")
  const header = document.createElement("h2")
  const name = localStorage.getItem("username")
  header.innerHTML = "Welcome " + name;

  div.appendChild(header)

  main.appendChild(div);
  getOptions();
  addHomeListeners();
}

function updateDeleteComment(data){
  main.innerHTML = "";
  const div = document.createElement("div")

  const header = document.createElement("h2")
  header.innerHTML = "Delete Comment"

  div.appendChild(header);
  main.appendChild(div);
  getCommentDeleteOptions(data);
  addCommentDelete();
}

function updateDeleteP(data, comments){
  if (comments){
    main.innerHTML = "";
    const div = document.createElement("div")

    const header = document.createElement("h2")
    header.innerHTML = "Select Post"

    div.appendChild(header);
    main.appendChild(div);
    getDeleteOptions(data, comments);
    getCommentsFromPostListener();
  } else {
  main.innerHTML = "";
  const div = document.createElement("div")

  const header = document.createElement("h2")
  header.innerHTML = "Delete Post"


  div.appendChild(header);
  main.appendChild(div);
  getDeleteOptions(data, comments);
  addDListener();
}
}

function updatePostP(data){
  main.innerHTML = "";
  const div = document.createElement("div")

  const header = document.createElement("h2")
  header.innerHTML = "Update Post"


  div.appendChild(header);
  main.appendChild(div);
  getUpdateOptions(data);
  addUListener();
}

function getUpdateOptions(data){
  data.forEach((d) => {
    const div = document.createElement("div");
    div.className="updateOptions"
    const form = document.createElement("form");
    form.className="updateForm"
    form.id = d._id
    let titleHeader = document.createElement("span")
    titleHeader.textContent="Title"
    let title = document.createElement("input");
    title.value = d.title
    title.name= "title"

    let contentHeader = document.createElement("span")
    contentHeader.textContent = "Content"
    let content = document.createElement("TEXTAREA");
    content.value = d.content
    content.name= "content"
    content.cols = "40";
    content.rows = "20";

    let button = document.createElement("button");
    button.type="submit"
    button.textContent = "Update"
    button.className = "updateButton"

    form.appendChild(titleHeader);
    form.appendChild(title);
    form.appendChild(contentHeader);
    form.appendChild(content);
    form.appendChild(button);
    div.appendChild(form);
    main.appendChild(div);
  })
}

function getCommentDeleteOptions(data){
  data.forEach((d) =>{
    const div = document.createElement("div");
    div.className= "deleteOptions"
    let title = document.createElement("h3")
    title.innerHTML = d.comment

    let button = document.createElement("button");
    button.textContent = "Delete"
    button.id = d._id
    button.className = "deleteButtonComment"

    div.appendChild(title);
    div.appendChild(button);
    main.appendChild(div)
  })
}

function getDeleteOptions(data, comments){
  if (comments){
    data.forEach((d) => {
    const div = document.createElement("div");
    div.className= "deleteOptionsC";
    div.id = d._id;
    let title = document.createElement("h3");
    title.innerHTML = d.title;
    title.id = d._id;
    div.appendChild(title);
    main.appendChild(div)
  })
} else {
  data.forEach((d) => {
    const div = document.createElement("div");
    div.className= "deleteOptions"
    let title = document.createElement("h3")
    title.innerHTML = d.title
    let content = document.createElement("p");
    content.innerHTML = d.content.substring(0, 100) + "..."

    let button = document.createElement("button");
    button.textContent = "Delete"
    button.id = d._id
    button.className = "deleteButton"

    div.appendChild(title);
    div.appendChild(content);
    div.appendChild(button);
    main.appendChild(div)
  })
}
}

function addPUpdate(){
  main.innerHTML = "";
  const div = document.createElement("div")
  const header = document.createElement("h2")
  header.innerHTML = "Add new post"

  div.appendChild(header);
  main.appendChild(div);
  getPostForm();
  addPListener();

}

function getCommentsFromPostListener(){
  const deleteOptionsC = document.querySelectorAll(".deleteOptionsC");
  for (let i = 0; i < deleteOptionsC.length; i++){
    deleteOptionsC[i].addEventListener("click", async function (e) {
      e.preventDefault();
      localStorage.setItem("postId", e.target.id);
      const token = localStorage.getItem("token");
      const bearer = `Bearer ${token}`;
      let res = await fetch(`https://glacial-thicket-60246.herokuapp.com/api/posts/${e.target.id}/comments`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": bearer,
        },
    })
    const data = await res.json();

    if (res.status === 200){
      updateDeleteComment(data);
      return;
    }
    alert(data.message);
  })
    }
  };

  function addCommentDelete(){
      const deleteButtonsComment = document.querySelectorAll(".deleteButtonComment")
      for( let i = 0; i < deleteButtonsComment.length; i++){
        deleteButtonsComment[i].addEventListener("click", async function (e) {
          e.preventDefault();
          const token = localStorage.getItem("token");
          const postid = localStorage.getItem("postId")
          const bearer = `Bearer ${token}`;
          let res = await fetch(`https://glacial-thicket-60246.herokuapp.com/api/posts/${postid}/comments/${e.target.id}`,{
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": bearer,
            },
        })
        const data = await res.json();

        if (res.status === 200){
          successfulDeleteComment(data);
          addCommentDelete();
          return;
        }
        alert(data.message);
      })
      }
      }


function addDListener(){
  const deleteButtons = document.querySelectorAll(".deleteButton")
  for( let i = 0; i < deleteButtons.length; i++){
    deleteButtons[i].addEventListener("click", async function (e) {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const bearer = `Bearer ${token}`;
      let res = await fetch(`https://glacial-thicket-60246.herokuapp.com/api/posts/${e.target.id}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": bearer,
        },
    })
    const data = await res.json();

    if (res.status === 200){
      successfulDelete(data);
      return;
    }
    alert(data.message);
  })
}
}

function addPListener(){
  const pForm = document.getElementById("pForm")
  pForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;
    const formData = new FormData(pForm).entries()
    let req = await fetch("https://glacial-thicket-60246.herokuapp.com/api/posts",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": bearer,
      },
      body: JSON.stringify(Object.fromEntries(formData))

    }
  );
  const data = await req.json()

  if(req.status === 200){
    successfulPost(data)
    return;
  } else{
  data.errors[1].msg;
  }
})
}

function addUListener(){
  const updateForm = document.querySelectorAll(".updateForm")
  for( let i = 0; i < updateForm.length; i++){
    updateForm[i].addEventListener("submit", async function (e, index) {
      e.preventDefault();
      const updateFormData = new FormData(updateForm[i]).entries()
      const token = localStorage.getItem("token");
      const bearer = `Bearer ${token}`;
      let res = await fetch(`https://glacial-thicket-60246.herokuapp.com/api/posts/${e.target.id}/update`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": bearer,
        },
        body: JSON.stringify(Object.fromEntries(updateFormData))
    });
    const data = await res.json();

    if (res.status === 200){
      succesfulUpdate(data);
      return;
    }
    alert(data.message);
  })
}
}

function successfulDeleteComment(data){
  main.innerHTML = "";
  const div = document.createElement("div")
  div.className = "wrapper"
  const header = document.createElement("h2")
  header.innerHTML = "Delete succesful"

  const title  = document.createElement("h3")
  title.innerHTML = data.message



  div.appendChild(header);
  div.appendChild(title);

  main.appendChild(div);
}

function successfulPost(data){
  main.innerHTML = "";
  const div = document.createElement("div")
  div.className = "wrapper"
  const header = document.createElement("h2")
  header.innerHTML = "Post added success!"

  const title  = document.createElement("h3")
  title.innerHTML = data.post.title;

  const content = document.createElement("p");
  content.innerHTML = data.post.content;

  div.appendChild(header);
  div.appendChild(title);
  div.appendChild(content);

  main.appendChild(div);

}

function succssfulDeleteComment(data){
  main.innerHTML = "";
  const div = document.createElement("div")
  div.className = "wrapper"
  const header = document.createElement("h2")
  header.innerHTML = "Comment deleted"

  const title  = document.createElement("h3")
  title.innerHTML = data.message


  div.appendChild(header);
  div.appendChild(title);


  main.appendChild(div);
}

function successfulDelete(data){
  main.innerHTML = "";
  const div = document.createElement("div")
  div.className = "wrapper"
  const header = document.createElement("h2")
  header.innerHTML = "Post deleted"

  const title  = document.createElement("h3")
  title.innerHTML = data.message

  const content = document.createElement("p");
  content.innerHTML = "Deleted " + data.comments.deletedCount + " comments"

  div.appendChild(header);
  div.appendChild(title);
  div.appendChild(content);

  main.appendChild(div);
}

function succesfulUpdate(data){
    main.innerHTML = "";
    const div = document.createElement("div")
    div.className = "wrapper"
    const header = document.createElement("h2")
    header.innerHTML = "Post Updated"

    const title  = document.createElement("h3")
    title.innerHTML = data.message


    div.appendChild(header);
    div.appendChild(title);

    main.appendChild(div);
}

function getPostForm(){
  const div = document.createElement("div");
  div.className="newPostWrapper"

  const form = document.createElement("FORM")
  const titleLabel = document.createElement("label")
  const contentLabel = document.createElement("label");
  const titleInput = document.createElement("input")
  const contentInput = document.createElement("TEXTAREA");
  const button = document.createElement("button");

  form.className="addPform"
  form.id="pForm"
  button.type="submit"
  button.innerHTML = "Submit"

  titleInput.type = "text"
  titleInput.name = "title"
  contentInput.type = "text"
  contentInput.name = "content"
  contentInput.cols = "40";
  contentInput.rows = "20";
  titleLabel.htmlFor = "title"
  titleLabel.innerHTML = "Title"
  contentLabel.htmlFor = "content"
  contentLabel.innerHTML = "Content"

  form.appendChild(titleLabel)
  form.appendChild(titleInput)
  form.appendChild(contentLabel)
  form.appendChild(contentInput)
  form.appendChild(button)
  div.appendChild(form)
  main.appendChild(div);

}


function getOptions(){
  myOptions = [];
  i = 0;
  numOfOptions = 4;
  let optionsWrapper = document.createElement("div");
  optionsWrapper.className= "optionsWrapper"
  for(i; i < numOfOptions; i++){
    myOptions.push(createOptions());
    optionsWrapper.appendChild(myOptions[i]);
  }
  updateOptions(myOptions);
  main.appendChild(optionsWrapper)
}

function createOptions(){
    const options = document.createElement("div");
    options.className= "options"
    return options
}

function updateOptions(myOptions){

  myOptions[0].innerText= "Add Post"
  myOptions[0].classList.add("addP")

  myOptions[1].innerText= "Delete Post"
  myOptions[1].classList.add("deleteP");

  myOptions[2].innerText= "Update Post"
  myOptions[2].classList.add("updateP");

  myOptions[3].innerText= "Delete Comment"
  myOptions[3].classList.add("deleteC");

}


async function getAdminOption(){

}
