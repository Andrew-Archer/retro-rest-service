var openModal = function(modal) {
    return function() {
        modal.classList.remove('displayNone');
    }
}
var httpVerbs = {
    doPost(url, data, callback) {
            return window.fetch(url, {method: "POST",
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(data)})
                            .then(callback);
        },
    doPut(){
        return window.fetch(url, )
    },
    doGet(url, callback){
        return window.fetch(url, {method: "GET"}).then(callback);
    },
    doDelete(){}
}

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
        callback)
    },
    updateUser(){},
    deleteUser(){},
    getUserAll(callback){
        return httpVerbs.doGet("./api/user", callback);
    },
    gerUserByName(name, callback){
        return httpVerbs.doGet("./api/user/" + name, callback)
    }
}

const REGEXP_EMAIL = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const REGEXP_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const btnIn = document.querySelector('#in');
const btnReg = document.querySelector('#reg');
const modalIn = document.querySelector('#modal-in');
const modalReg = document.querySelector('#modal-reg');
const btnModalIn = modalIn.querySelector('#btn-in');
const btnModalInReg = modalIn.querySelector('#btn-in-reg');
const btnModalReg = modalReg.querySelector('#btn-reg');

const modalEmailIn = modalIn.querySelector('#emailIn');
const modalPasswordlIn = modalIn.querySelector('#passwordIn');

const modalEmailReg = modalReg.querySelector('#emailReg');
const modalPasswordReg = modalReg.querySelector('#passwordReg');
const modalPasswordRegR = modalReg.querySelector('#passwordRegRepeat');

const errE = modalReg.querySelector('#errorE');
const errP = modalReg.querySelector('#errorP');
const errPR = modalReg.querySelector('#errorPR');

btnIn.addEventListener('click', openModal(modalIn));
btnReg.addEventListener('click', openModal(modalReg));

modalIn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.target;
    if ((target.closest('.modal') && !target.closest('#btn-in') && !target.closest('#btn-in-reg')) || target.closest('#btn-in') || target.closest('#btn-in-reg')) e.stopPropagation();
    else if(target.closest('#modal-in')) modalIn.classList.add('displayNone');

    if (target.closest('#btn-in')) {
        if (!modalEmailIn.value) modalEmailIn.classList.add('error');
        else modalEmailIn.classList.remove('error');
        
        if (!modalPasswordlIn.value) modalPasswordlIn.classList.add('error');
        else modalPasswordlIn.classList.remove('error');

        if (modalEmailIn.value && modalPasswordlIn.value) {
            modalEmailIn.value = '';
            modalPasswordlIn.value = '';
            modalIn.classList.add('displayNone');
            // window.location.replace('/listBoard.html');
            window.location.href = '/listBoard.html';
        }
    }

    if (target.closest('#btn-in-reg')) {
        modalIn.classList.add('displayNone');
        modalReg.classList.remove('displayNone');
    }
});

modalReg.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.target;
    if ((target.closest('.modal') && !target.closest('#btn-reg')) || target.closest('#btn-reg')) e.stopPropagation();
    else if(target.closest('#modal-reg')) modalReg.classList.add('displayNone');

    if (target.closest('#btn-reg')) {
        let isValidEmail = REGEXP_EMAIL.test(modalEmailReg.value);
        let isValidPassword = REGEXP_PASSWORD.test(modalPasswordReg.value);
        let isValidPasswordRepeat = modalPasswordReg.value === modalPasswordRegR.value;

        if (!isValidEmail) {
            modalEmailReg.classList.add('error');
            errE.classList.remove('displayNone');
        } else {
            modalEmailReg.classList.remove('error');
            errE.classList.add('displayNone');
        }
        
        if (!isValidPassword) {
            modalPasswordReg.classList.add('error');
            errP.classList.remove('displayNone');
        } else {
            modalPasswordReg.classList.remove('error');
            errP.classList.add('displayNone');
        }
        
        if (!isValidPasswordRepeat) {
            modalPasswordRegR.classList.add('error');
            errPR.classList.remove('displayNone');
        } else {
            modalPasswordRegR.classList.remove('error');
            errPR.classList.add('displayNone');
        }

        if (isValidEmail && isValidPassword && isValidPasswordRepeat) {
            userRepository.createUser(modalEmailReg.value,
                                        modalPasswordReg.value,
                                        ()=>{window.location.replace('./listBoard.html');})
        }
    }

});
