export default class User{
    constructor(JWT, AppConstants, $http, $state, $q) {
        'ngInject';
        this._JWT = JWT;
        this._AppConstants = AppConstants;
        this._$http = $http;
        this._$state = $state;
        this.current = null;
        this._$q = $q;
    }

    attemptAuth(type, credentials) {
        let route = (type === 'login') ? '/login' : '';
        return this._$http({
            url: this._AppConstants.api + '/users' + route,
            method: 'POST',
            data: {
                user: credentials
            }
        }).then(
            (res) => {
                console.log(res);
                debugger;
                this._JWT.save(res.data.user.token);
                this.current = res.data.user;
                return res;
            }
        );
    }

    logout() {
        this._JWT.destroy();
        this.current = null;
        this._$state.go(this._$state.$current, null, {reload: true});
    }

    verifyAuth() {
        let deferred = this._$q.defer();

        if(!this._JWT.get()) {
            deferred.resolve(false);
            return deferred.promise;
        }

        if(this.current) {
            deferred.resolve(true);
        } else {
            this._$http({
                url: this_AppConstants.api + '/user',
                method: 'GET',
                headers: {
                    Authorization: 'Token ' + this._JWT.get()
                }
            }).then(
                (res) => {
                    this.current = res.data.user;
                    deferred.resolve(true);
                },
                (err) => {
                    this._JWT.destroy();
                    deferred.resolve(false);
                }
            );
            return deferred.promise;
        }
    }

    ensureAuthIs(bool) {
    let deferred = this._$q.defer();

    this.verifyAuth().then((authValid) => {
      // if it's the opposite, redirect home
      if (authValid !== bool) {
        this._$state.go('app.home');
        deferred.resolve(false);
      } else {
        deferred.resolve(true);
      }
    })

    return deferred.promise;
  }
}