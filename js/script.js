const URL_base = 'https://jsonplaceholder.typicode.com/posts';
const URL_users = 'https://jsonplaceholder.typicode.com/users';
const users = ['###'];

// Elementos do DOM.
const loadingElement = document.querySelector('#loading');
const postsContainer = document.querySelector('#posts-Container');
const postContainer = document.querySelector('#post-container');

const postPage = document.querySelector('#post-page');
const postCommentsContainer = document.querySelector('#post-comments');
const postFormComment = document.querySelector('#form-comment');
const emailInput = document.querySelector('#email');
const bodyInput = document.querySelector('#body');

const formAddPost = document.querySelector('#form-add-post');
const userInputAddPost = document.querySelector('#author');
const titleInputAddPost = document.querySelector('#title');
const bodyInputAddPost = document.querySelector('#description');
const addPostButton = document.querySelector('#form-add-post-button');

// Pega o ID da URL para saber o local atual.
const urlSearchParams = new URLSearchParams(window.location.search)
const postID = urlSearchParams.get('id');

addPostButton.addEventListener('click', (e) => {
    e.preventDefault();

    let dataPost = {
        user: userInputAddPost.value,
        id: crypto,
        title: titleInputAddPost.value,
        body: bodyInputAddPost.value
    };

    dataPost = JSON.stringify(dataPost);
    addNewPost(dataPost);
});

function hideAddFormPost(){
    formAddPost.classList.toggle('hide-Element')
};

async function addNewPost(thePost){
    const response = await fetch(URL_base, {
        method: 'POST',
        body: thePost,
        headers: {
            "Content-type": "application/json"
        }
    });

    const data = await response.json();

    const post = document.createElement('div');
    const userName = document.createElement('p');
    const postTitle = document.createElement('h2');
    const postBody = document.createElement('p');
    const seeMore = document.createElement('a');

    userName.textContent = `Usuário: ${data.user}`;
    postTitle.textContent = data.title;
    postBody.textContent = data.body;
    seeMore.textContent = 'Ler';
    
    post.appendChild(userName);
    post.appendChild(postTitle);
    post.appendChild(postBody);
    post.appendChild(seeMore);

    postsContainer.appendChild(post);
};

// Função assíncrona - requisição no servidor para obter todas as postagens dos usuários.
async function getAllPosts(){
    loadingElement.classList.add('hide-Element')

    const [postsResponse, usersResponse] = await Promise.all([
        fetch(URL_base),
        fetch(URL_users)
    ]);

    const dataPosts = await postsResponse.json();
    const dataUsers = await usersResponse.json();

    dataUsers.map((dataUsers) => {
        users.push(dataUsers.name);
    });

    dataPosts.map((dataPost) => {
        const post = document.createElement('div');
        const userName = document.createElement('p');
        const postTitle = document.createElement('h2');
        const postBody = document.createElement('p');
        const seeMore = document.createElement('a');
        
        userName.textContent = `Usuário: ${users[dataPost.userId]}`
        postTitle.textContent = dataPost.title.charAt(0).toUpperCase() + dataPost.title.slice(1);
        postBody.textContent = dataPost.body;
        seeMore.textContent = 'Ler';
        seeMore.setAttribute('href', `/post.html?id=${dataPost.id}`);

        post.appendChild(userName);
        post.appendChild(postTitle);
        post.appendChild(postBody);
        post.appendChild(seeMore);
        
        postsContainer.appendChild(post);
    });
};

// Função assíncrona - requisição no servidor para obter uma postagem individual e seus comentários.
async function getPost(id){
    const [responsePost, responseComments] = await Promise.all([
        fetch(`${URL_base}/${id}`),
        fetch(`${URL_base}/${id}/comments`)
    ]);

    const dataPost = await responsePost.json();
    const dataComments = await responseComments.json();

    const postTitle = document.createElement('h1');
    const postBody = document.createElement('p');
    
    postTitle.textContent = dataPost.title.charAt(0).toUpperCase() + dataPost.title.slice(1);
    postBody.textContent = dataPost.body;
    
    postContainer.appendChild(postTitle);
    postContainer.appendChild(postBody);
    
    loadingElement.classList.add('hide-Element');
    postPage.classList.remove('hide-Element');

    dataComments.map((comment) => {
        createComment(comment);
    });
};

// Criar um comentário no post.
function createComment(comment){
    const commentContainer = document.createElement('div')
    const emailContainer = document.createElement('h3');
    const bodyContainer = document.createElement('p');
    
    emailContainer.textContent = comment.email;
    bodyContainer.textContent = comment.body;
    
    commentContainer.appendChild(emailContainer);
    commentContainer.appendChild(bodyContainer);

    commentContainer.classList.add('comment-container')
    
    postCommentsContainer.appendChild(commentContainer)
};

// Função assíncrona - requisição no servidor utilizando o método "POST" para adicionar um comentário em uma postagem.
async function postComment(comment){
    const response = await fetch(`${URL_base}/${postID}/comments`, {
        method: 'POST',
        body: comment,
        headers: {
            "Content-type": "application/json",
        },
    });

    const data = await response.json();

    createComment(data);
};


if (!postID){
    getAllPosts();
} else {
    getPost(postID);
    postFormComment.addEventListener('submit', (e) => {
        e.preventDefault()
        let comment = {
            email: emailInput.value,
            body: bodyInput.value
        };

        comment = JSON.stringify(comment)
        postComment(comment);
    });
};

