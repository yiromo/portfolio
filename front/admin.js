document.getElementById('addPortfolioForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const information = formData.get('information');
    const description = formData.get('description');
    const files = [];

    // Iterate through each file in the FormData
    for (let file of formData.getAll('files')) {
        // Check if the file is an image
        if (file.type.startsWith('image')) {
            // Create a URL for the image and push it to the files array
            const imageURL = URL.createObjectURL(file);
            files.push(imageURL);
        }
    }

    fetch('/api/portfolio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            information: information,
            description: description,
            files: files  // Include the array of image URLs
        })
    })
        .then(response => response.json())
        .then(data => {
            // Handle success (e.g., display newly added item)
            console.log(data);
            fetchPortfolioItems(); // Refresh the list of portfolio items
        })
        .catch(error => console.error('Error:', error));
});

// Function to fetch and display portfolio items
function fetchPortfolioItems() {
    fetch('/api/portfolio')
        .then(response => response.json())
        .then(data => {
            // Display portfolio items dynamically
            const portfolioItemsDiv = document.getElementById('portfolioItems');
            portfolioItemsDiv.innerHTML = ''; // Clear existing items
            data.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.innerHTML = `
                    <h3>${item.information}</h3>
                    <p>${item.description}</p>
                     ${renderImages(item.files)}
                    <button onclick="editPortfolioItem('${item._id}')" >Edit</button>
                    <button onclick="deletePortfolioItem('${item._id}')" >Delete</button>
                `;
                portfolioItemsDiv.appendChild(itemDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}

function renderImages(files) {
    if (!files || files.length === 0) {
        return ''; // No files to render
    }

    // Generate <img> elements for each image URL
    const imagesHTML = files.map(file => `<img src="${file}" alt="Portfolio Image">`).join('');
    return `<div class="images">${imagesHTML}</div>`;
}

function editPortfolioItem(itemId) {
    const itemDiv = document.getElementById(itemId);
    if (!itemDiv) {
        console.error('Item not found:', itemId);
        return;
    }

    const information = itemDiv.querySelector('.information').textContent;
    const description = itemDiv.querySelector('.description').textContent;

    const editForm = document.createElement('form');
    editForm.innerHTML = `
        <input type="text" name="information" value="${information}">
        <textarea name="description">${description}</textarea>
        <button onclick="savePortfolioItem('${itemId}')">Save</button>
    `;

    itemDiv.innerHTML = ''; // Clear the item content
    itemDiv.appendChild(editForm);
}

// Function to save the edited portfolio item
function savePortfolioItem(itemId) {
    const itemDiv = document.getElementById(itemId);
    const formData = new FormData(itemDiv.querySelector('form'));
    const information = formData.get('information');
    const description = formData.get('description');

    fetch(`/api/portfolio/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            information: information,
            description: description
        })
    })
        .then(response => response.json())
        .then(data => {
            // Handle success (e.g., display success message)
            console.log(data);
            fetchPortfolioItems(); // Refresh the list of portfolio items
        })
        .catch(error => console.error('Error:', error));
}

// Function to delete a portfolio item
function deletePortfolioItem(itemId) {
    fetch(`/api/portfolio/${itemId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                // Handle success (e.g., remove item from UI)
                const itemDiv = document.getElementById(itemId);
                itemDiv.remove();
            } else {
                // Handle error
                console.error('Error:', response.statusText);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Fetch portfolio items when the page loads
fetchPortfolioItems();
