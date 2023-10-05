app.controller("singinController", singinController);
function singinController($http, $scope, signupAPI) {
  const host = signupAPI;
  $scope.formData = {}; // Dữ liệu từ biểu mẫu sẽ được lưu ở đây

  $scope.passwordErrors = {
    minLength: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialCharacter: false,
    noSpace: false
  };

  $scope.checkPassword = function () {
    var password = $scope.formData.password;

    $scope.passwordErrors = {
      minLength: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialCharacter: /[!@#$%^&*()_+={}\[\]:;<>,.?~\\-]/.test(password),
      noSpace: !/\s/.test(password)
    };
  };

  $scope.signup = function () {
    // Gửi dữ liệu đến backend thông qua HTTP POST request
    $http.post(host, $scope.formData).then(function (response) {
      var status = response.data.status;
      var message = response.data.message;
      if (status == 201) {
        Swal.fire({
          title: "Thông báo",
          text: message,
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            // Nếu người dùng nhấn nút "OK", thực hiện chuyển hướng đến /login
            window.location.href = "/login";
          }
        });
      } else {
        Swal.fire({
          title: "Thông báo",
          text: message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    });
  };
}
