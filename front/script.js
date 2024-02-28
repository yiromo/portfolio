function nextSlide() {
    const slides = document.querySelectorAll('.carousel-item');
    let currentSlide = document.querySelector('.carousel-item.active');
    console.log("Current slide:", currentSlide);
    currentSlide.classList.remove('active');
    let index = Array.from(slides).indexOf(currentSlide);
    console.log("Current index:", index);
    index = (index + 1) % slides.length;
    console.log("Next index:", index);
    slides[index].classList.add('active');
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-item');
    let currentSlide = document.querySelector('.carousel-item.active');
    console.log("Current slide:", currentSlide);
    currentSlide.classList.remove('active');
    let index = Array.from(slides).indexOf(currentSlide);
    console.log("Current index:", index);
    index = (index - 1 + slides.length) % slides.length;
    console.log("Previous index:", index);
    slides[index].classList.add('active');
}







document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    // Fetch API to make the POST request
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: document.getElementById('loginUsername').value,
            password: document.getElementById('loginPassword').value
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.role === 'admin') {
                window.location.href = '/admin'; // Redirect to admin page
            } else {
                window.location.href = '/'; // Redirect to home page
            }
        })
        .catch(error => console.error('Error:', error));
});


