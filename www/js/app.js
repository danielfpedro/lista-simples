// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
// 

prod = true;

angular.module('starter', [
    'ionic',
    'starter.controllers',
    'starter.services',
    'ngCordova',
    'firebase',
    'angular-storage'
])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })
    .state('tab.listas', {
        url: '/listas',
        views: {
            'tab-listas': {
                templateUrl: 'templates/tab-listas.html',
                controller: 'ListasController'
            }
        },
        resolve: {
            authData: function(Login){
                return Login.authData();
            }
        }
    })
        .state('tab.lista-add', {
            url: '/lista-add',
            views: {
                'tab-listas': {
                    templateUrl: 'templates/lista-add.html',
                    controller: 'ListaAddController'
                }
            }
        })
        .state('tab.lista', {
            url: '/lista/:listId',
            views: {
                'tab-listas': {
                    templateUrl: 'templates/lista.html',
                    controller: 'ListaController'
                }
            }
        })
            .state('tab.todo-add', {
                url: '/todo-add/:listId',
                views: {
                    'tab-listas': {
                        templateUrl: 'templates/todo-add.html',
                        controller: 'TodoAddController'
                    }
                }
            })
            .state('tab.lista-usuarios', {
                url: '/lista-usuarios/:listId',
                views: {
                    'tab-listas': {
                        templateUrl: 'templates/lista-usuarios.html',
                        controller: 'ListaUsuariosController'
                    }
                }
            })

    .state('tab.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/tab-chats.html',
                    controller: 'ChatsCtrl'
                }
            }
        })
        .state('tab.chat-detail', {
            url: '/chats/:chatId',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/chat-detail.html',
                    controller: 'ChatDetailCtrl'
                }
            }
        })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

});
