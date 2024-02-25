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
