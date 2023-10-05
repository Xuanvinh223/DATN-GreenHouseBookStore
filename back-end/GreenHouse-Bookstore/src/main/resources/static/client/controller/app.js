const app = angular.module("myApp", ['angular-jwt']);

app.constant('authenticateAPI', 'http://localhost:8081/authenticate');
app.constant('signupAPI', 'http://localhost:8081/sign-up');
app.constant('checkOutAPI', 'http://localhost:8081/customer/rest/check-out');

app.run(function ($rootScope, $http, $templateCache) {
  var jsFiles = ['js/custom.js', 'js/code.js', 'js/login-register.js', 'js/plugins.js']; // Danh sách các tệp JavaScript

  function loadAndAppendScript(jsFile) {
    return $http.get(jsFile)
      .then(function (response) {
        $templateCache.put(jsFile, response.data);
        var scriptElement = document.createElement('script');
        scriptElement.innerHTML = $templateCache.get(jsFile);
        document.body.appendChild(scriptElement);
        return Promise.resolve();
      });
  }

  $rootScope.$on('$viewContentLoaded', function () {
    Promise.all(jsFiles.map(loadAndAppendScript));
  });
});

