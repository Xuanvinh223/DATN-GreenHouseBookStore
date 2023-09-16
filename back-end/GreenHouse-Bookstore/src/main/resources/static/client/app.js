var app = angular.module('todoApp', ['ngRoute']);
app.config(function($routeProvider) {
	$routeProvider
		.when('/tasks', {
			templateUrl: '/templates/client/views/tasks.html',
			controller: 'TaskController'
		})
		.when('/task/:taskId', {
			templateUrl: '/templates/client/views/taskDetail.html',
			controller: 'TaskDetailController'
		})
		.otherwise({ redirectTo: '/' });
});

app.controller('MainController', function($scope) {
	console.log("main");
});

app.controller('TaskController', function($scope) {
	console.log("TaskController");
});

app.controller('TaskDetailController', function($scope, $routeParams) {
	$scope.taskId = $routeParams.taskId;
	console.log("TaskDetailController");
});
