app.controller("headerController", headerController);

function headerController($http, $window, $scope, jwtHelper) {
  var token = localStorage.getItem("token");
  // Khởi tạo biến $scope.username với giá trị mặc định
  $scope.username = "Tài khoản";
  if (token) {
    var decodedToken = jwtHelper.decodeToken(token);
    var username = decodedToken.sub;
    $scope.isCustomer = false; // Mặc định không phải là khách hàng
    $scope.roles = decodedToken.roles;

    if (username) {
      $scope.username = username;
    }

    $scope.isCustomer = $scope.roles.some(function (role) {
      return role.authority === "ROLE_CUSTOMER";
    });

    $scope.isAdmin = $scope.roles.some(function (role) {
      return role.authority === "ROLE_ADMIN";
    });
  }

  $scope.admin = function () {
    window.location.href =
        "/admin/index?token=" + token + "&username=" + username;
  };

  $scope.logout = function () {
    $window.localStorage.removeItem("token");
    window.location.href = "/login";
  };
}
