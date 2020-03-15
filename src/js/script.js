window.onload = function () {
    document.getElementById('call-form').addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;
        valid = checkNotEmpty(document.getElementById('phone')) && valid;
        if (!valid) {
            return;
        }
        sendForm(this);
    });

    document.getElementById('contact-form').addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;
        valid = checkNotEmpty(document.getElementById('email')) && valid;
        valid = checkNotEmpty(document.getElementById('name')) && valid;
        valid = checkNotEmpty(document.getElementById('message')) && valid;
        if (!valid) {
            return;
        }
        sendForm(this);
    });
};

function sendForm(form) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (4 === this.readyState && 200 === this.status) {
            form.innerHTML = this.responseText;
        }
    };
    addFormName(form);
    let data = new FormData(form);
    xhttp.open('POST', '/backend/form-handler.php', true);
    xhttp.send(data);
}

function addFormName(form) {
    let input = document.createElement('input');
    input.value = form.id;
    input.type = 'hidden';
    input.name = 'form';
    form.appendChild(input);
}

function checkNotEmpty(field) {
    if ('' === field.value) {
        field.closest('.field').classList.add('field-error');
        return false;
    } else {
        field.closest('.field').classList.remove('field-error');
    }
    return true;
}