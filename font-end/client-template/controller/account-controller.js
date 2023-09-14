app.controller('accountController', accountController);

function accountController($scope) {
    // ... Các mã xử lý khác trong controller
    initJavascript();
}

// Mã JavaScript cho Javasricpt
function initJavascript() {

    const statusButtons = document.querySelectorAll('.order-status-button');

    statusButtons.forEach(button => {
        button.addEventListener('click', () => {
            statusButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    const changePasswordCheckbox = document.getElementById("change_password_checkbox");
    const passwordFields = document.getElementById("password_fields");

    changePasswordCheckbox.addEventListener("change", function () {
        if (this.checked) {
            passwordFields.style.display = "block";
        } else {
            passwordFields.style.display = "none";
        }
    });
}