
var httpVerbs = {
    doPost(url, data, callback) {
            return window.fetch(url, {method: "POST",
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(data)})
                            .then(callback);
        },
    doPut(){
        return window.fetch(url, );
    },
    doGet(url, callback){
        return window.fetch(url, {method: "GET"}).then(callback);
    },
    doDelete(){}
};

let userRepository = {
    createUser(email, password, callback){
        return httpVerbs.doPost("./api/user",
        {
            "id": null,
            "boards": [],
            "username": "",
            "password": password,
            "firstName": "",
            "lastName": "",
            "email": email,
            "active": true
        },
        callback);
    },
    updateUser(){},
    deleteUser(){},
    getUserByEmail(email, callback){
        return httpVerbs.doGet("./api/user/email/" + email, callback);
    },
    getUserById(id, callback){
        return httpVerbs.doGet("./api/user/" + id, callback);
    },
    getOAuthUser(id, pass, callback){
        return window.fetch("./api/user/email/", {
        "headers": {
                "Authorization": "Basic " + btoa(id + ":" + pass),
            },
        "method": "GET"}).then(callback);
    },
    getUserAuth(callback){
        return httpVerbs.doGet("./api/user/auth", callback);
    },
    getUserAll(callback){
        return httpVerbs.doGet("./api/user", callback);
    },
    gerUserByName(name, callback){
        return httpVerbs.doGet("./api/user/" + name, callback)
    }
};

let responseUserAuth = (response) => {
    response.text()
        .then((resp) => {
            if (resp) {
                let userAuth = JSON.parse(resp);
                sessionStorage.setItem('id', userAuth.id);
                sessionStorage.setItem('email', userAuth.email);
                window.location.replace('/listBoard.html');
            }
        })
};

userRepository.getUserAuth(responseUserAuth);

var openModal = function(modal) {
    return function() {
        modal.classList.remove('display--none');
    };
};

const REGEXP_EMAIL = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const REGEXP_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const btnIn = document.querySelector('#in');
const btnReg = document.querySelector('#reg');
const modalIn = document.querySelector('#modal-in');
const modalReg = document.querySelector('#modal-reg');
const btnModalIn = modalIn.querySelector('#btn-auth--in');
const btnModalInReg = modalIn.querySelector('#btn-auth--reg');
const btnModalReg = modalReg.querySelector('#btn-reg');

const modalEmailIn = modalIn.querySelector('#emailIn');
const modalPasswordlIn = modalIn.querySelector('#passwordIn');

const modalEmailReg = modalReg.querySelector('#emailReg');
const modalPasswordReg = modalReg.querySelector('#passwordReg');
const modalPasswordRegR = modalReg.querySelector('#passwordRegRepeat');

const errLP = modalIn.querySelector('#errorLP');
const errE = modalReg.querySelector('#errorE');
const errP = modalReg.querySelector('#errorP');
const errPR = modalReg.querySelector('#errorPR');

btnIn.addEventListener('click', openModal(modalIn));
btnReg.addEventListener('click', openModal(modalReg));

modalIn.addEventListener('click', (e) => {
    //e.preventDefault();
    const target = e.target;
    if ((target.closest('.modal') && !target.closest('#btn-auth--in') && !target.closest('#btn-auth--reg')) || target.closest('#btn-auth--in') || target.closest('#btn-auth--reg')) e.stopPropagation();
    else if(target.closest('#modal-in')) modalIn.classList.add('display--none');

    if (target.closest('#btn-auth--in')) {
        if (!modalEmailIn.value) modalEmailIn.classList.add('error');
        else modalEmailIn.classList.remove('error');
        
        if (!modalPasswordlIn.value) modalPasswordlIn.classList.add('error');
        else modalPasswordlIn.classList.remove('error');

        var requestAuth = function(response) {
            response.text()
                .then((res) => {
                    if (res) {
                        resp = JSON.parse(res);
                        sessionStorage.setItem('id', resp.id);
                        sessionStorage.setItem('email', resp.email);
                        window.location.replace('/listBoard.html');
                    } else {
                        errLP.classList.remove('display--none');
                    }
                    modalEmailIn.value = '';
                    modalPasswordlIn.value = '';
                });
        };

        if (modalEmailIn.value && modalPasswordlIn.value) {
            userRepository.getOAuthUser(modalEmailIn.value, modalPasswordlIn.value, requestAuth);
        }
    }

    if (target.closest('#btn-auth--reg')) {
        modalIn.classList.add('display--none');
        modalReg.classList.remove('display--none');
    }
});

modalReg.addEventListener('click', (e) => {
    //e.preventDefault();
    const target = e.target;
    if ((target.closest('.modal') && !target.closest('#btn-reg')) || target.closest('#btn-reg')) e.stopPropagation();
    else if(target.closest('#modal-reg')) modalReg.classList.add('display--none');

    if (target.closest('#btn-reg')) {
        let isValidEmail = REGEXP_EMAIL.test(modalEmailReg.value);
        let isValidPassword = REGEXP_PASSWORD.test(modalPasswordReg.value);
        let isValidPasswordRepeat = modalPasswordReg.value === modalPasswordRegR.value;

        if (!isValidEmail) {
            modalEmailReg.classList.add('error');
            errE.classList.remove('display--none');
        } else {
            modalEmailReg.classList.remove('error');
            errE.classList.add('display--none');
        }
        
        if (!isValidPassword) {
            modalPasswordReg.classList.add('error');
            errP.classList.remove('display--none');
        } else {
            modalPasswordReg.classList.remove('error');
            errP.classList.add('display--none');
        }
        
        if (!isValidPasswordRepeat) {
            modalPasswordRegR.classList.add('error');
            errPR.classList.remove('display--none');
        } else {
            modalPasswordRegR.classList.remove('error');
            errPR.classList.add('display--none');
        }

        let resp;
        var requestReg = function(response){
            if (response.status >= 200 && response.status <= 299) {
                response.text()
                    .then((res) => {
                        resp = JSON.parse(res);
                        sessionStorage.setItem('id', resp.id);
                        sessionStorage.setItem('email', resp.email);
                        window.location.replace('/listBoard.html');
                        // return resp.id;
                    });
            };
        };

        if (isValidEmail && isValidPassword && isValidPasswordRepeat) {
            userRepository.createUser(modalEmailReg.value, modalPasswordReg.value, requestReg);
        }
    }

});
