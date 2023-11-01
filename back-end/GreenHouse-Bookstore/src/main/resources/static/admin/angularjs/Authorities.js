app.controller("AuthoritiesController", function ($scope, $http) {
    $scope.getData = function () {
        $http.get("/rest/authorities").then(resp => {
            $scope.db = resp.data;
        })
    }

    $scope.index_of = function (username, role) {
        return $scope.db.authorities
            .findIndex(a => a.account.username == username && a.role.roleId == role);
    }


    $scope.updateAuthorities = function (username, role) {
        var index = $scope.index_of(username, role);
        var authoritiesId;
        if (index >= 0) {
            authoritiesId = $scope.db.authorities[index].authoritiesId;
            $http.delete(`/rest/authorities/${authoritiesId}`).then(function (resp) {
                $scope.getData();
                swal.fire('Thành công!', 'Đã cập nhật thành công.', 'success');
            });
        } else {
            var data = {
                username: username,
                roleId: role
            };
            $http.post('/rest/authorities', data).then(function (resp) {
                $scope.getData();
                swal.fire('Thành công!', 'Đã cập nhật thành công.', 'success');
            });
        }
    };


    $scope.getData();
})