app.controller("singinController", singinController);
function singinController($http, $scope, signupAPI) {
  const host = signupAPI;
  $scope.formData = {}; // Dữ liệu từ biểu mẫu sẽ được lưu ở đây
  $scope.signup = function () {
    // Gửi dữ liệu đến backend thông qua HTTP POST request
    $http
      .post(host, $scope.formData)
      .then(function (response) {
        // Xử lý kết quả từ backend (nếu cần)
        Swal.fire({
          title: "Thông báo",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch(function (error) {
        // Xử lý lỗi nếu có
        var status = error.status;
        var message = error.data.message;
        if (status == 400) {
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
