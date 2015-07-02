﻿
var storeApp = angular.module('MithaiStore', []).
  config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
          when('/store', {
              templateUrl: 'partials/store.htm',
              controller: storeController
          }).
          when('/products/:productSku', {
              templateUrl: 'partials/product.htm',
              controller: storeController
          }).
          when('/cart', {
              templateUrl: 'partials/shoppingCart.htm',
              controller: storeController
          }).
          otherwise({
              redirectTo: '/store'
          });
  }]);

// create a data service that provides a store and a shopping cart that
// will be shared by all views (instead of creating fresh ones for each view).
storeApp.factory("DataService", function () {

    // create store
    var myStore = new store();

    // create shopping cart
    var myCart = new shoppingCart("MithaiStore");

    // enable PayPal checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with PayPal, you have to create a merchant account with 
    // PayPal. You can do that here:
    // https://www.paypal.com/webapps/mpp/merchant
    myCart.addCheckoutParameters("PayPal", "paypaluser@youremail.com");

    // enable Google Wallet checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with Google Wallet, you have to create a merchant account with 
    // Google. You can do that here:
    // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
    myCart.addCheckoutParameters("Google", "xxxxxxx",
        {
            ship_method_name_1: "UPS Next Day Air",
            ship_method_price_1: "20.00",
            ship_method_currency_1: "USD",
            ship_method_name_2: "UPS Ground",
            ship_method_price_2: "15.00",
            ship_method_currency_2: "USD"
        }
    );

    // enable Stripe checkout
    // note: the second parameter identifies your publishable key; in order to use the 
    // shopping cart with Stripe, you have to create a merchant account with 
    // Stripe. You can do that here:
    // https://manage.stripe.com/register
    myCart.addCheckoutParameters("Stripe", "pk_test_xxxx",
        {
            chargeurl: "https://localhost:1234/processStripe.aspx"
        }
    );

    // return data object with store and cart
    return {
        store: myStore,
        cart: myCart
    };
});

storeApp.directive('myFooter', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/footer.htm'
    }
});

storeApp.controller('tabcontroller', function ($scope) {
    var panes = $scope.panes = [];

    $scope.select = function (pane) {
        angular.forEach(panes, function (pane) {
            pane.selected = false;
        });
        pane.selected = true;
    };

    this.addPane = function (pane) {
        if (panes.length == 0) {
            $scope.select(pane);
        }
        panes.push(pane);
    };
});
storeApp.directive('myTabs', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: 'tabcontroller',
        templateUrl: 'partials/my-tabs.html'
    }
});
storeApp.directive('myPane', function () {
    return {
        require: '^myTabs',
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@'
        },
        link: function (scope, element, attrs, tabsCtrl) {
            tabsCtrl.addPane(scope);
        },
        templateUrl: 'partials/my-pane.html'
    };
});