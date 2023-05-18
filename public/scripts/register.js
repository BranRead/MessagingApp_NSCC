const login = document.querySelector(".formSubmit");
const form = document.querySelector("form");

login.addEventListener("click", e => {
    if (!form.checkValidity()) {
        e.preventDefault()
    }

    
    form.classList.add('was-validated');

})