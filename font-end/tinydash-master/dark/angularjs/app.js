var app = angular.module('admin-app', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "page/home/index.html"
        })
        .when("/account-form", {
            templateUrl: "page/account-manager/form_account.html",

        })
        .when("/account-table", {
            templateUrl: "page/account-manager/table_account.html",
            controller: ""
        })
        .when("/author-form", {
            templateUrl: "page/author-manager/form_author.html",

        })
        .when("/author-table", {
            templateUrl: "page/author-manager/table_author.html",
            controller: ""
        })
        .when("/brand-form", {
            templateUrl: "page/brand-manager/form_brand.html",
            controller:"brandController"
        })
        .when("/brand-table", {
            templateUrl: "page/brand-manager/table_brand.html",
            controller:"brandController"
        })
        .when("/category-form", {
            templateUrl: "page/category-manager/form_category.html",
            controller: ""
        })
        .when("/category-table", {
            templateUrl: "page/category-manager/table_category.html",
            controller: ""
        })
        .when("/categorytype-form", {
            templateUrl: "page/category-manager/form_categorytype.html",
            controller: ""
        })
        .when("/categorytype-table", {
            templateUrl: "page/category-manager/table_categorytype.html",
            controller: ""
        })
        .when("/discount-form", {
            templateUrl: "page/coupon-manager/form_discount.html",
            controller: ""
        })
        .when("/discount-table", {
            templateUrl: "page/coupon-manager/table_discount.html",
            controller: ""
        })
        .when("/voucher-form", {
            templateUrl: "page/coupon-manager/form_voucher.html",
            controller: ""
        })
        .when("/voucher-table", {
            templateUrl: "page/coupon-manager/table_voucher.html",
            controller: ""
        })
        .when("/inventory-form", {
            templateUrl: "page/inventory-manager/inventory_form.html",
            controller: ""
        })
        .when("/inventory-table", {
            templateUrl: "page/inventory-manager/inventory_table.html",
            controller: ""
        })
        //đơn hàng
        .when("/order-manager", {
            templateUrl: "page/order-manager/table_order.html",
            controller: ""
        })
        .when("/product-table", {
            templateUrl: "page/product-manager/table_product.html",
            controller: ""
        })
        .when("/product-form", {
            templateUrl: "page/product-manager/form_product.html",
            controller: ""
        })
        .when("/product-learning-table", {
            templateUrl: "page/product-manager/form_product_learning.html",
            controller: ""
        })
        //nhà xuất bản
        .when("/publisher-form", {
            templateUrl: "page/publisher-manager/form_publishers.html",
            controller: ""
        })
        .when("/publisher-table", {
            templateUrl: "page/publisher-manager/table_publishers.html",
            controller: ""
        })
        //nhà cung cấp
        .when("/supplier-form", {
            templateUrl: "page/supplier-manager/form_supplier.html",
            controller: ""
        })
        .when("/supplier-table", {
            templateUrl: "page/supplier-manager/table_supplier.html",
            controller: ""
        })
})

app.run(['$rootScope', function ($rootScope) {
    $rootScope.page = {
        setTitle: function (title) {
            this.title = 'GreenHouse |' + title;

        }
    }

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.page.setTitle(current.$$route.title || ' Trang quản trị');

    });
}]);