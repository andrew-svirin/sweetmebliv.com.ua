window.onload = function () {
    Array.prototype.forEach.call( document.getElementsByTagName('form'), (form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            sendForm(form);
        });
    })
};

function sendForm(form) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (4 === this.readyState && 200 === this.status) {
            form.innerHTML = this.responseText;
        }
    };
    let input = document.createElement('input');
    input.value = form.id;
    input.type = 'hidden';
    input.name = 'form';
    form.appendChild(input);
    let data = new FormData(form);
    xhttp.open('POST', '/backend/form-handler.php', true);
    xhttp.send(data);
}