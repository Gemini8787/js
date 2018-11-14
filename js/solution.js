'use strict';

const mainInterface = document.querySelector('.menu');
const menuItem = mainInterface.querySelectorAll('.menu__item');
const image = document.querySelector('.current-image');
const app = document.querySelector('.app');
const loader = document.querySelector('.image-loader');
const errorImage = document.querySelector('.error');
const errorImageText = errorImage.querySelector('.error__message');
const mode = document.querySelectorAll('.menu__item.mode');
const commentWrap = document.querySelector('.comments-box');
let socket;
let commentForms;
document.querySelector('.menu__item.burger').addEventListener('click', event => {
    menuItem.forEach(item => item.dataset.state = '');
    mainInterface.dataset.state = 'default';
});

document.querySelector('.menu_copy').addEventListener('click', event => {
    document.querySelector('.menu__url').select();
    document.execCommand('copy');
});

mode.forEach(item => {
    item.addEventListener('click', event => {
        if (item.classList.contains('new')) return;
        menuItem.forEach(el => el.dataset.state = '');
        mainInterface.dataset.state = 'selected';
        item.dataset.state = 'selected';
    });
});

document.querySelector('.menu__item.burger').addEventListener('click', () => {

    if (document.querySelector('canvas')) {
        removeElement(document.querySelector('canvas'));
    }

    if (document.querySelector('.comments__form')) {
        commentForms = document.querySelectorAll('.comments__form .comments__marker-checkbox');
    }
});

let checkImage = null;

getDefaultInterface();

function getDefaultInterface() {
    mainInterface.dataset.state = 'initial';
    image.src = '';
    image.classList.add('visually-hidden');
    hideElement(errorImage);
}

document.querySelector('#loadImage').addEventListener('change', getImageFromInput);

function getImageFromInput(event) {
    const files = event.target.files[0];
    updateFilesInfo(files);
}

app.addEventListener('dragover', event => {
    event.preventDefault();
    checkImage = image.classList.contains('visually-hidden');
});

app.addEventListener('drop', onDrop);

function onDrop() {
    event.preventDefault();
    if (!checkImage) {
        errorImageText.textContent = 'Чтобы загрузить новое изображение, пожалуйста, воспользуйтесь пунктом «Загрузить новое» в меню';
        showElement(errorImage);
        return;
    } else {
        const files = event.dataTransfer.files[0];
        updateFilesInfo(files);
    }
}

function checkFileType(file) {
    switch (file.type) {
        case 'image/jpeg':
        case 'image/png':
            return true;
        default:
            return false;
    }
}

function updateFilesInfo(file) {
    if (checkFileType(file)) {
        hideElement(errorImage);
        showElement(loader);
    } else {
        errorImageText.textContent = 'Неверный формат файла. Пожалуйста, выберите изображение в формате .jpg или .png.';
        showElement(errorImage);
    }

    connectionImage(file);
}

function getFormData(file) {
    const formData = new FormData();
    formData.append('title', file.name);
    formData.append('image', file);
    return formData;
}

function connectionImage(file) {
    fetch('https://neto-api.herokuapp.com/pic', {
            body: getFormData(file),
            credentials: 'same-origin',
            method: 'POST'
        })
        .then(res => {
            if (200 <= res.status && res.status < 300) {
                return res;
            }
            throw new Error(response.statusText);
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            showImage(res, 'share');
            if (socket) {
                socket.close();
            }
            onSocket(res.id);
        })
        .catch(er => console.log(er));
}

if (window.location.search !== '') {
    const id = window.location.search.substr(4);
    connectionImageGet(id);
}

function connectionImageGet(id) {
    fetch(`https://neto-api.herokuapp.com/pic/${id}`)
        .then(res => res.json())
        .then(res => {
            showImage(res, 'comments');
            onSocket(res.id);
        });
}

function showImage(res, element) {

    image.src = res.url;
    image.dataset.id = res.id;
    createUrl(image.dataset.id);
    image.classList.remove('visually-hidden');
    image.addEventListener('load', event => {
        hideElement(loader);
        showMenu(element);
        commentWrap.style.width = `${image.width}px`;
        commentWrap.style.height = `${image.height}px`;
    });
}

function createUrl(id) {
    const menuUrl = document.querySelector('.menu__url');
    const locUrl = `${window.location.origin}${window.location.pathname}?id=${id}`;
    menuUrl.value = locUrl;
}

function showMenu(elem) {
    mainInterface.dataset.state = 'selected';
    menuItem.forEach(item => item.dataset.state = '');
    document.querySelector(`.menu__item.${elem}`).dataset.state = 'selected';
}

function showElement(el) {
    el.style.display = '';
}

function hideElement(el) {
    el.style.display = 'none';
}
