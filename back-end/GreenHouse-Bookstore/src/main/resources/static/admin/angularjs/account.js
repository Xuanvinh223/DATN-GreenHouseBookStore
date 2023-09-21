app.controller("AccountController", function ($scope, $location, $http) {
  let host = "http://localhost:8081/rest/accounts"; // Thay đổi địa chỉ URL nếu cần
  $scope.editingAccounts = {};
  $scope.isEditing = false;

  $scope.accounts = [];
  $scope.loadAccounts = function () {
    var url = `${host}`;
    $http
      .get(url)
      .then((resp) => {
        $scope.accounts = resp.data;
      })
      .catch((Error) => {
        console.log("Error", Error);
      });
  };

  $scope.saveAccounts = function () {
    var accounts = {
      username: $scope.editingAccounts.username || "",
      password: $scope.editingAccounts.password || "",
      fullname: $scope.editingAccounts.fullname || "",
      email: $scope.editingAccounts.email || "",
      gender: $scope.editingAccounts.gender || false,
      birthday: $scope.editingAccounts.birthday || "",
      phone: $scope.editingAccounts.phone || "",
      image: $scope.editingAccounts.image || "",
      active: $scope.editingAccounts.active || false,
    };

    if ($scope.isEditing) {
      var url = `${host}/${accounts.username}`;
      $http
        .put(url, accounts)
        .then((resp) => {
          $scope.loadAccounts();
          $scope.resetForm();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: `Cập nhật tài khoản ${accounts.username}`,
          });
        })
        .catch((Error) => {
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: `Cập nhật tài khoản ${accounts.username} thất bại`,
          });
          console.log(Error)
        });
    } else {
      console.log("thanhf cong");
      var url = `${host}`;
      $http
        .post(url, accounts)
        .then((resp) => {
          $scope.loadAccounts();
          $scope.resetForm();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: `Thêm tài khoản ` + accounts.username,
          });
        })
        .catch((Error) => {
          console.log("iiiiiii");
          if (Error.data) {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: `Thêm tài khoản thất bại`,
            });
          }
        });
    }
  };

  $scope.editAccounts = function (username, index) {
    var url = `${host}/${username}`;
    $http
      .get(url)
      .then(function (resp) {
        $scope.editingAccounts = angular.copy(resp.data);
        $scope.isEditing = true;

      })
      .catch(function (error) {
        console.log("Error", error);
      });
  };

  $scope.deleteAccounts = function (username) {
    var url = `${host}/${username}`;

    // Sử dụng $http để gửi yêu cầu DELETE đến API
    $http
      .delete(url)
      .then((resp) => {
        $scope.loadAccounts(); // Nạp lại danh sách thương hiệu sau khi xóa
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: `Xóa tài khoản ${username} thành công`,
        });
      })
      .catch((Error) => {
        if (Error.status === 409) {
          // Kiểm tra mã trạng thái lỗi
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: `Tài khoản mã ${key} đang hoạt động và không thể xóa.`,
          });
        } else
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: `Xóa tài khoản ${username} thất bại`,
          });
      });
  };


  $scope.cancelEdit = function () {
    $scope.resetForm();
  };

  $scope.resetForm = function () {
    $scope.editAccounts = {};
    $scope.isEditing = false;
  };

  $scope.loadAccounts();
});