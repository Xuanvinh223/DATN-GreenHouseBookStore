app.controller("headerController", headerController);

function headerController($http, $window, $scope, jwtHelper) {
  var fullName = localStorage.getItem("fullName");
  var imageStorge = localStorage.getItem("image");
  // Khởi tạo biến $scope.username với giá trị mặc định
  $scope.fullName = fullName;
  $scope.image = "https://tse1.explicit.bing.net/th?id=OIP.Hv9ZwItRTU5Kd68xiwSkMwHaHa&pid=Api&P=0&h=220";

  if (imageStorge !== "undefined") {
    $scope.image = imageStorge;
  } else if (imageStorge == undefined) {
    $scope.image = "https://tse1.explicit.bing.net/th?id=OIP.Hv9ZwItRTU5Kd68xiwSkMwHaHa&pid=Api&P=0&h=220";
  }

  $scope.logout = function () {
    $window.localStorage.removeItem("token");
    $window.localStorage.removeItem("username");
    $window.localStorage.removeItem("fullName");
    window.location.href = "/logout";
  };
}
