angular.module('app')
  .controller('Nav', Nav)

Nav.$inject = ['$scope', '$timeout', '$state', 'Auth'];

function Nav($scope, $timeout, $state, Auth) {
  const vm = this;
  vm.loginForm = {};
  vm.displayLogin = false;
  vm.displayLoginButton = true;
  vm.displayLogout = false;
  vm.registering = false;
  vm.toggleButton = 'login';

  vm.isUser = Auth.isLoggedIn();

  if (vm.isUser) {
    Auth.getUser().then(function(user) {
      vm.user = user;
    })
    vm.displayLoginButton = false;
    vm.displayLogout = true;
  }

  vm.toggleLogin = function() {
    vm.displayLogin = !vm.displayLogin;
    vm.registering = false;

    vm.loginForm = {};
    $scope.navForm.$setPristine();

    if (vm.toggleButton === 'login') {
      vm.toggleButton = 'close';
    } else {
      vm.toggleButton = 'login';
    }

    if (vm.displayLoginButton === false) {
      $timeout(function(){
        vm.displayLoginButton = true;
      }, 500);
    } else {
      vm.displayLoginButton = false;
    }
  }

  vm.login = function(form) {
    vm.disabled = true;

    if (form.confirmPassword) {
      if (form.password != form.confirmPassword) {
        vm.disabled = false;
        vm.loginForm = {};
      } else {
        delete form.confirmPassword;
        Auth.register(form).then(function() {
          vm.disabled = false;
          vm.loginForm = {};
          vm.displayLogin = false;
          vm.registering = false;
          vm.isUser = Auth.isLoggedIn();
          Auth.getUser().then(function(user) {
            vm.user = user;
          })
          $timeout(function(){
            vm.displayLogout = true;
          }, 500);
        }).catch(function(err) {
          vm.disabled = false;
          vm.loginForm = {};
        })
      }
    } else {
      Auth.login(form).then(function() {
        vm.disabled = false;
        vm.loginForm = {};
        vm.displayLogin = false;
        vm.isUser = Auth.isLoggedIn();
        Auth.getUser().then(function(user) {
          vm.user = user;
        })
        $timeout(function(){
          vm.displayLogout = true;
        }, 500);
      }).catch(function(error) {
        vm.disabled = false;
        vm.loginForm = {};
      })
    }

  }

  vm.logout = function() {
    Auth.logout().then(function() {
      vm.isUser = false;
      vm.displayLogout = false;
      vm.displayLoginButton = true;
    })
  }

  vm.toggleRegister = function() {
    vm.registering = !vm.registering;
  }
}
