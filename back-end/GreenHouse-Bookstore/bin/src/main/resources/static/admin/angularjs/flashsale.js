app.controller('flashsaleController', flashsaleController);

let host = "http://localhost:8081/rest";

function flashsaleController($scope, $http) {
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.page.setTitle(current.$$route.title || ' Quản Lý Flash-Sale');
    });
    // ... Các mã xử lý khác trong controller
    $scope.flashsales = [];
    $scope.searchText = "";
    // $scope.searchFlashsales = [];
    $scope.sortField = null;
    $scope.reverseSort = false;
    // Khai báo danh sách tùy chọn cho số mục trên mỗi trang
    $scope.itemsPerPageOptions = [5, 12, 24, 32, 64, 128];
    $scope.selectedItemsPerPage = 5; // Khởi tạo giá trị mặc định cho số mục trên mỗi trang

  
    //load table
    $scope.load_All = function () {
        var url = `${host}/flashsales`;
        $http.get(url).then(resp => {
            $scope.flashsales = resp.data;

            $scope.totalItems = $scope.flashsales.length;
            // $scope.changeFilterTo = function (pr) {
            //     if ($scope.search) {
            // ............

            // Dữ liệu bạn muốn hiển thị
            $scope.data = resp.data;

            // Số mục trên mỗi trang
            $scope.itemsPerPage = 5;
            // Tính toán tổng số mục
            $scope.totalItems = $scope.data.length;
            // Trang hiện tại
            $scope.currentPage = 1;

            // Tính toán số trang
            $scope.pageCount = Math.ceil($scope.data.length / $scope.itemsPerPage);

            // Cập nhật danh sách mục trang hiện tại khi trang thay đổi
            $scope.$watch('currentPage + selectedItemsPerPage', function () {
                var begin = ($scope.currentPage - 1) * $scope.selectedItemsPerPage;
                var end = begin + $scope.selectedItemsPerPage;
                $scope.flashsales = $scope.data.slice(begin, end);
            });

            $scope.showLastDots = true; // Biến trạng thái để kiểm soát hiển thị dấu chấm "..." hoặc nút "Last"

            $scope.firstPage = function () {
                if ($scope.currentPage > 1) {
                    $scope.currentPage = 1;
                    $scope.showLastDots = true;
                    updateVisiblePages();
                }
            };

            $scope.prevPage = function () {
                if ($scope.currentPage > 1) {
                    $scope.currentPage--;
                    $scope.showLastDots = true;
                    updateVisiblePages();
                }
            };

            $scope.nextPage = function () {
                if ($scope.currentPage < $scope.pageCount) {
                    $scope.currentPage++;
                    $scope.showLastDots = true;
                    updateVisiblePages();
                }
            };

            $scope.lastPage = function () {
                if ($scope.currentPage < $scope.pageCount) {
                    $scope.currentPage = $scope.pageCount;
                    $scope.showLastDots = false;
                    updateVisiblePages();
                }
            };

            // Đặt trang hiện tại
            $scope.setPage = function (page) {
                $scope.currentPage = page;
                updateVisiblePages();
            };

            // Cập nhật danh sách trang hiển thị
            function updateVisiblePages() {
                var totalPages = $scope.pageCount;
                var currentPage = $scope.currentPage;
                var visiblePageCount = 3; // Số trang bạn muốn hiển thị
                var startPage, endPage;

                if (totalPages <= visiblePageCount) {
                    startPage = 1;
                    endPage = totalPages;
                } else {
                    if (currentPage <= Math.ceil(visiblePageCount / 2)) {
                        startPage = 1;
                        endPage = visiblePageCount;
                    } else if (currentPage + Math.floor(visiblePageCount / 2) > totalPages) {
                        startPage = totalPages - visiblePageCount + 1;
                        endPage = totalPages;
                    } else {
                        startPage = currentPage - Math.floor(visiblePageCount / 2);
                        endPage = currentPage + Math.floor(visiblePageCount / 2);
                    }
                }

                $scope.visiblePages = [];
                for (var i = startPage; i <= endPage; i++) {
                    $scope.visiblePages.push(i);
                }
            }

            // Ban đầu, cập nhật danh sách trang hiển thị
            updateVisiblePages();
            
            $scope.onItemsPerPageChange = function () {
                // Cập nhật số lượng phần tử trên mỗi trang
                $scope.itemsPerPage = $scope.selectedItemsPerPage;
                // Tính toán lại số trang dựa trên số lượng phần tử mới
                $scope.pageCount = Math.ceil($scope.data.length / $scope.itemsPerPage);
                // Đặt lại trang hiện tại về 1
                $scope.currentPage = 1;
                // Cập nhật danh sách trang hiển thị
                updateVisiblePages();
        
            };
            console.log("Success", resp)
        }).catch(error => {
            console.log("Error", error);
        });
    }

    // Sắp xếp
    $scope.sortBy = function (field) {
        if ($scope.sortField === field) {
            $scope.reverseSort = !$scope.reverseSort;
        } else {
            $scope.sortField = field;
            $scope.reverseSort = false;
        }
    };




    $scope.load_All();
} 
