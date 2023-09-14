// Order Start
const statusButtons = document.querySelectorAll('.order-status-button');

statusButtons.forEach(button => {
    button.addEventListener('click', () => {
        statusButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});
// Order End

// changePassword Start
const changePasswordCheckbox = document.getElementById("change_password_checkbox");
const passwordFields = document.getElementById("password_fields");

changePasswordCheckbox.addEventListener("change", function () {
    if (this.checked) {
        passwordFields.style.display = "block";
    } else {
        passwordFields.style.display = "none";
    }
});
// changePassword end