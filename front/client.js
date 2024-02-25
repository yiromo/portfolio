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
                    <div id="${item._id}" class="portfolio-item">
                     ${renderImages(item.files)}
                        <h3 class="information">${item.information}</h3>
                        <p class="description">${item.description}</p>
                    </div>
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
// Fetch portfolio items when the page loads
fetchPortfolioItems();
