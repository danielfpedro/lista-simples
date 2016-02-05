angular.module('starter.services', [])

.factory('FirebaseRef', function() {
    return new Firebase('https://minha-lista.firebaseio.com');
})
.factory('Auth', function(
    FirebaseRef,
    $firebaseAuth
) {
    return $firebaseAuth(FirebaseRef);
})
.factory('Lista', function(
    $ionicLoading,
    $cordovaToast,
    $q,
    FirebaseRef,
    store
) {
    return {
        listas: [],
        getFromCache: function(){
            return store.get('listas') || [];
        },
        setToCache: function(data){
            this.listas = data;
            store.set('listas', data);
        },
        save: function(data){
            var defer = $q.defer();

            $ionicLoading.show({template: 'Criando lista, aguarde'});

            var ref = FirebaseRef;

            ref
                .child('listas')
                .push(data, function(error){
                    if (!error) {
                        if (prod) {
                            $cordovaToast.show('Lista adicionada.', 'short', 'bottom');    
                        }
                        defer.resolve();
                    } else {
                        if (prod) {
                            $cordovaToast.show('Ocorreu um erro =[, por favor tente novamente.', 'short', 'bottom');    
                        }
                        defer.reject(error);
                    }
                    $ionicLoading.hide();
                });

            return defer.promise;
        }
    };
})
.factory('Todo', function(
    $ionicLoading,
    $cordovaToast,
    $q,
    FirebaseRef,
    store
) {
    return {
        todos: [],
        getFromCache: function(){
            return store.get('todos') || [];
        },
        setToCache: function(data){
            this.todos = data;
            store.set('todos', data);
        },
        done: function(listId, todoId){
            var ref = FirebaseRef;
            ref
                .child('todos/' + listId + '/' + todoId)
                .update({done: true});
        },
        save: function(listId, data){
            var defer = $q.defer();

            $ionicLoading.show({template: 'Criando tarefa, aguarde...'});

            data.done = false;

            var ref = FirebaseRef;
            console.log(data);
            console.log(listId);
            ref
                .child('todos/' + listId)
                .push(data, function(error){
                    if (!error) {
                        if (prod) {
                            $cordovaToast.show('Tarefa adicionada.', 'short', 'bottom');    
                        }
                        defer.resolve();
                    } else {
                        if (prod) {
                            $cordovaToast.show('Ocorreu um erro =[, por favor tente novamente.', 'short', 'bottom');    
                        }
                        console.error('Ocorreu um erro ao tentar salvar a tarefa');
                        defer.reject(error);
                    }
                    $ionicLoading.hide();
                });

            return defer.promise;
        }
    };
})
.factory('Login', function(
    $q,
    $state,
    $firebaseAuth,
    FirebaseRef,
    Auth
) {
    return {
        authData: function(){
            var defer = $q.defer();
            Auth.$onAuth(function(authData){
                if (authData) {
                    defer.resolve(authData.facebook);
                } else {
                    defer.reject();
                }
            });
            return defer.promise;
        },
        doLoginWeb: function(){
            var defer = $q.defer();

            var refAuth = $firebaseAuth(FirebaseRef);

                refAuth.$authWithOAuthPopup("facebook").then(function(authData) {
                    console.log('redirecionando');
                    $state.go('tab.listas');
                    defer.resolve();
                }).catch(function(error) {
                    defer.reject(error);
                });

                return defer.promise;
        },
        doLoginNative: function(){
            var defer = $q.defer();

            this.getAccessToken()
                .then(function(token){
                    var ref = FirebaseRef;
                    ref.authWithOAuthToken("facebook", token, function(error, authData) {
                        if (error) {
                            defer.reject(error);
                        } else {
                            $state.go('tab.listas')
                            defer.resolve();
                        }
                    });
                    
                }, function(error){
                    defer.reject(error);
                });
            return defer.promise;
        },
        getAccessToken: function() {
            var defer = $q.defer();
            var fbLoginSuccess = function (userData) {
                facebookConnectPlugin.getAccessToken(function(token) {
                    defer.resolve(token)
                });
            }

            facebookConnectPlugin.login(["public_profile"], fbLoginSuccess,
                function (error) {
                    defer.reject();
                }
            );

            return defer.promise;
        }
    }
});