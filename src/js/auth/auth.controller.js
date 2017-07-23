class AuthCtrl {
    constructor(User, $state) {
        'ngInject';

        this._User = User;
        this.title = $state.current.title;
        this.authType = $state.current.name.replace('app.','');
    }

    submitForm() {
        this.isSubmitting = true;
        
        this._User.attemptAuth(this.authType, this.formData).then(
            (res) => {
                this.submitting = false;
                console.log(res);
            },
            (err) => {
                this.submitting = false;
                this.errors = err.data.errors;
            }
        )
    }
}

export default AuthCtrl;