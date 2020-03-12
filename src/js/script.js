window.onload = function () {

    document.getElementById('call-form').addEventListener('submit', function (e) {
        e.preventDefault();
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (4 === this.readyState && 200 === this.status) {
                console.log(this.responseText);
            }
        };
        xhttp.open('POST', '/backend/form-handler.php', true);
        xhttp.send();
    });

    document.getElementById('contact-form').addEventListener('submit', function (e) {
        e.preventDefault();
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (4 === this.readyState && 200 === this.status) {
                console.log(this.responseText);
            }
        };
        xhttp.open('POST', '/backend/form-handler.php', true);
        xhttp.send();
    });

};