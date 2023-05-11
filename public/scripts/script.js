const login = document.querySelector(".formSubmit");
const form = document.querySelector("form");
// const data = new FormData(form);
// var inputs = form[0].getElementsByTagName("input");
// const signUp = document.querySelector(".sign-up-but");

login.addEventListener("click", e => {
    if (!form.checkValidity()) {
        e.preventDefault()
    }

    
    form.classList.add('was-validated');

})
