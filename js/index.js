document.addEventListener('DOMContentLoaded', () => {
    const listPanel = document.getElementById('list');
    const showPanel = document.getElementById('show-panel');
    const apiUrl = 'http://localhost:3000/books';

    // fetch 
    fetchBooks();

    //my async function to help in fetching books
    async function fetchBooks() {
        try {
            const response = await fetch(apiUrl);
            const books = await response.json();

            books.forEach(book => {
                const li = document.createElement('li');
                li.textContent = book.title;
                li.addEventListener('click', () => showBookDetails(book));
                listPanel.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    // a function that works on books inner html details as required
    function showBookDetails(book) {
        showPanel.innerHTML = ''; 

        const bookTitle = document.createElement('h2');
        bookTitle.textContent = book.title;

        const bookThumbnail = document.createElement('img');
        bookThumbnail.src = book.thumbnailUrl;
        bookThumbnail.alt = `${book.title} Thumbnail`;

        const bookDescription = document.createElement('p');
        bookDescription.textContent = book.description;

        const likeButton = document.createElement('button');
        likeButton.textContent = 'LIKE';

        const usersList = document.createElement('ul');
        book.users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.textContent = user.username;
            usersList.appendChild(userItem);
        });

        // add a listener that listen to a click
        likeButton.addEventListener('click', () => toggleLike(book, likeButton, usersList));

        //ensure now we bring all these elements to the parent html element so us for all we have done for it to work
        showPanel.appendChild(bookTitle);
        showPanel.appendChild(bookThumbnail);
        showPanel.appendChild(bookDescription);
        showPanel.appendChild(likeButton);
        showPanel.appendChild(usersList);
    }

    // Toggle the LIKE functionality
    async function toggleLike(book, likeButton, usersList) {
        const currentUser = { id: 1, username: 'pouros' }; 

        // Check if the current user has already liked the book
        const isLiked = book.users.some(user => user.username === currentUser.username);

        if (isLiked) {
            // Remove the user from the likes list
            book.users = book.users.filter(user => user.username !== currentUser.username);
            likeButton.textContent = 'LIKE'; 
        } else {
            // Add the user to the likes list
            book.users.push(currentUser);
            likeButton.textContent = 'UNLIKE'; 
        }

        try {
            // Send a PATCH request to update the book's users
            await fetch(`${apiUrl}/${book.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ users: book.users })
            });

            // Update the displayed users list
            usersList.innerHTML = '';
            book.users.forEach(user => {
                const userItem = document.createElement('li');
                userItem.textContent = user.username;
                usersList.appendChild(userItem);
            });
        } catch (error) {
            console.error('Error updating book:', error);
        }
    }
});
