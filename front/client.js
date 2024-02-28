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
                        <h3 class="information">${item.information}</h3>
                        <p class="description">${item.description}</p>
                        ${renderImages(item.files)}
                        <hr>
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

document.addEventListener('DOMContentLoaded', () => {
    fetch('/news')
        .then(response => response.json())
        .then(articles => {
            const newsContainer = document.getElementById('news');
            articles.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.innerHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank">Read more</a>
                `;
                newsContainer.appendChild(articleDiv);
            });
        })
        .catch(error => console.error('Error fetching news:', error));
});

// Fetch portfolio items when the page loads
fetchPortfolioItems();


// Assuming you have an element with the ID 'news' where you want to display the news articles
const newsContainer = document.getElementById('news');

// Assuming 'articles' is an array of news articles obtained from the NewsAPI response
articles.forEach(article => {
    // Create a new <div> element to hold each news article
    const articleDiv = document.createElement('div');

    // Create an <img> element for the article image
    const image = document.createElement('img');
    image.src = article.urlToImage; // Set the image source to the URL from the NewsAPI response
    image.alt = 'Article Image'; // Provide an alternative text for accessibility

    // Append the image to the article <div>
    articleDiv.appendChild(image);

    // You may also want to include other information like title, description, etc.
    // Create <h2> element for the article title
    const title = document.createElement('h2');
    title.textContent = article.title; // Set the title text to the title from the NewsAPI response

    // Create <p> element for the article description
    const description = document.createElement('p');
    description.textContent = article.description; // Set the description text to the description from the NewsAPI response

    // Append title and description to the article <div>
    articleDiv.appendChild(title);
    articleDiv.appendChild(description);

    // Append the article <div> to the news container
    newsContainer.appendChild(articleDiv);
});




