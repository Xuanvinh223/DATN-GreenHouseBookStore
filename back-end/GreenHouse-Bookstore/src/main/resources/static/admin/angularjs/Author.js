app.controller('AuthorController', AuthorController);

function AuthorController($scope, $http) {
    $scope.authors = [];
    $scope.newAuthor = {};
    $scope.editingAuthor = null;
    $scope.isEditing = false;

    // Hàm để lấy danh sách tác giả
    $scope.getAuthors = function () {
        $http
            .get("/api/authors")
            .then(function (response) {
                $scope.authors = response.data;
            })
            .catch(function (error) {
                console.error("Lỗi khi lấy danh sách tác giả:", error);
            });
    };

    // Hàm để sao chép thông tin tác giả vào biến editingAuthor và bật chế độ chỉnh sửa
    $scope.editAuthor = function (author) {
        $scope.editingAuthor = angular.copy(author);
        $scope.isEditing = true;
    };

    // Hàm để lưu tác giả (thêm mới hoặc cập nhật)
    $scope.saveAuthor = function () {
        if ($scope.editingAuthor) {
            // Nếu đang chỉnh sửa, gọi hàm cập nhật tác giả ở đây
            $http
                .put("/api/authors/" + $scope.editingAuthor.authorId, $scope.editingAuthor)
                .then(function () {
                    // Sau khi cập nhật thành công, làm mới danh sách tác giả và đặt lại form
                    $scope.getAuthors();
                    $scope.resetForm();
                })
                .catch(function (error) {
                    console.error("Lỗi khi cập nhật tác giả:", error);
                });
        } else {
            // Nếu thêm mới, gọi hàm thêm tác giả mới ở đây
            $http
                .post("/api/authors", $scope.newAuthor)
                .then(function () {
                    // Sau khi thêm thành công, làm mới danh sách tác giả và đặt lại form
                    $scope.getAuthors();
                    $scope.resetForm();
                })
                .catch(function (error) {
                    console.error("Lỗi khi thêm tác giả:", error);
                });
        }
    };

    // Hàm để hủy bỏ chế độ chỉnh sửa và đặt lại form
    $scope.cancelEdit = function () {
        $scope.isEditing = false;
        $scope.editingAuthor = null;
    };

    // Hàm để đặt lại form
    $scope.resetForm = function () {
        $scope.isEditing = false;
        $scope.editingAuthor = null;
        $scope.newAuthor = {};
    };

    $scope.getAuthors();
}
