const inputContainer = document.getElementById('postagem');
const resultContainer = document.getElementById('resultado');
const loadingElement = document.getElementById('loading')

async function getComments(){
    loadingElement.classList.remove('hide')
    resultContainer.innerHTML = ''

    try {
        const postID = inputContainer.value
        const url = `https://jsonplaceholder.typicode.com/comments?postId=${postID}`;

        const response = await fetch(url);
        const data = await response.json();

        loadingElement.classList.add('hide')

        data.map((dataComments) => {
            const email = document.createElement('p')
            const body = document.createElement('p')

            email.textContent = dataComments.email
            body.textContent = dataComments.body

            resultContainer.appendChild(email);
            resultContainer.appendChild(body);
        });
    } catch (error) {
        console.log(error)
    }
    
};