angular.module('starter.services', [])

.factory('FirebaseRef', function() {
    return new Firebase('https://minha-lista.firebaseio.com');
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
});
