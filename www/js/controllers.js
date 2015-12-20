angular.module('starter.controllers', [])

.controller('ListasController', function(
    $scope,
    $firebaseArray,
    FirebaseRef,
    Lista
) {
    $scope.listas = Lista.getFromCache();

    $scope.loading = ($scope.listas.length > 0) ? false : true;

    var ref = FirebaseRef;
    
    var query = ref
        .child('listas')
        .limitToLast(100);

    var newData = $firebaseArray(query);
    newData.$loaded()
        .then(function(){
            Lista.setToCache($scope.listas);
            $scope.listas = newData;

            $scope.listas.$watch(function(){
                Lista.setToCache($scope.listas);
            });

            $scope.loading = false;
        });

})
.controller('ListaAddController', function(
    $scope,
    Lista,
    $ionicHistory
) {
    $scope.newList = {};

    $scope.save = function(){
        Lista
            .save($scope.newList)
            .then(function(){
                $scope.newList = {};
                $ionicHistory.goBack();
            });
    };
})
.controller('ListaController', function(
    $scope,
    $stateParams,
    $firebaseArray,
    FirebaseRef,
    Todo,
    Lista
) {
    $scope.noData = false;
    console.log($stateParams);
    $scope.lista = Lista.getFromCache()[$stateParams.listId];
    $scope.todos = [];
    console.log($scope.lista);
    $scope.loading = ($scope.lista.length > 0) ? false : true;

    var ref = FirebaseRef;
    
    var query = ref
        .child('todos/' + $scope.lista.$id)
        .limitToLast(500);

    var newData = $firebaseArray(query);
    newData.$loaded()
        .then(function(){
            //Lista.setToCache($scope.listas);
            $scope.todos = newData;

            $scope.todos.$watch(function(){
                //Lista.setToCache($scope.listas);
                if ($scope.todos.length < 1) {
                    console.log('AQUIIIIIIIIIII');
                    $scope.noData = true;
                } else {
                    $scope.noData = false;
                }
            });
            if ($scope.todos.length < 1) {
                console.log('nao tem');
                $scope.noData = true;
            } else {
                console.log('Tem');
                $scope.noData = false;
            }
            $scope.loading = false;
        });
    $scope.done = function(todoId){
        Todo.done($scope.lista.$id, todoId);
    };
})
.controller('TodoAddController', function(
    $scope,
    Todo,
    $stateParams,
    $ionicHistory
) {
    $scope.newTodo = {};
    $scope.save = function(){
        Todo
            .save($stateParams.listId, $scope.newTodo)
            .then(function(){
                $scope.newTodo = {};
                $ionicHistory.goBack();
            });
    };
})
.controller('ListaUsuariosController', function(
    $scope,
    FirebaseRef,
    $firebaseArray,
    $stateParams,
    $firebaseObject
) {
    $scope.users = [];
    var ref = FirebaseRef;
    ref = ref.child('listas_usuarios/' + $stateParams.listId);
    var customFirebaseArray = $firebaseArray.$extend({
    });
    var temp = customFirebaseArray(ref);
    temp.$loaded().then(function(){
        $scope.users = [];
        angular.forEach(temp, function(value, key){
            var ref = FirebaseRef;
            ref = ref.child('users/' + value.user_id);
            console.log('aqui');
            $scope.users.push($firebaseObject(ref));
        });
        temp.$watch(function(){
            $scope.users = [];
            angular.forEach(temp, function(value, key){
                var ref = FirebaseRef;
                ref = ref.child('users/' + value.user_id);
                console.log('aqui');
                $scope.users.push($firebaseObject(ref));
            });
        });
        console.log('Users:');
        console.log($scope.users);
    });
    console.log($scope.users);
})
.controller('Proto', function(
    $scope,
    FirebaseRef
) {
});
