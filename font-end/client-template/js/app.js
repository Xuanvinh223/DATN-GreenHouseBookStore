const app = angular.module("myApp", ["ngRoute"]);
    
app.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when("/index.html", {
      templateUrl: "page/home.html",
    })
    .when("/lienhe", {
      templateUrl: "page/contact.html",
    })
    .when("/taikhoan", {
      templateUrl: "page/account.html",
    })
    .when("/flash-sale", {
      templateUrl: "page/flash-sale.html",
    })
    .when("/giohang", {
      templateUrl: "page/cart.html",
    })
    .when("/thanhtoan", {
      templateUrl: "page/checkout.html",
    })
    .when("/tttc", {
      templateUrl: "page/order-complete.html",
    })
    .otherwise({
      redirectTo: "/index.html"
    });
});

app.run(function ($rootScope, $http, $templateCache) {
  var jsFiles = ['js/custom.js', 'js/code.js']; // Danh sách các tệp JavaScript

  function loadAndAppendScript(jsFile) {
    return $http.get(jsFile)
      .then(function (response) {
        // Thêm nội dung JavaScript vào $templateCache
        $templateCache.put(jsFile, response.data);

        // Tạo một thẻ <script> và thực thi nó
        var scriptElement = document.createElement('script');
        scriptElement.innerHTML = $templateCache.get(jsFile);

        // Thêm thẻ <script> vào trang
        document.body.appendChild(scriptElement);

        // Trả về một Promise đã hoàn thành khi tệp JavaScript đã được thực thi
        return Promise.resolve();
      });
  }

  // Sử dụng Promise.all để đảm bảo tất cả các tệp JavaScript đã được tải và thực thi trước khi xử lý sự kiện
  $rootScope.$on('$viewContentLoaded', function () {
    var promises = jsFiles.map(function (jsFile) {
      return loadAndAppendScript(jsFile);
    });

    Promise.all(promises).then(function () {
      // Các tệp JavaScript đã được tải và thực thi hoàn tất
      // Bạn có thể xử lý sự kiện ở đây
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
    });
  });
});

