'use strict';

function removeElement(el) {
    el.parentElement.removeChild(el);
}

const menuComments = document.querySelector(`.menu__item.comments`);
const commentForm = document.querySelector('.comments__form').cloneNode(true);
const commentBox = commentForm.querySelector('.comment').cloneNode(true);
const commentLoader = commentForm.querySelector('.comment:last-of-type').cloneNode(true);

commentForm.querySelectorAll('.comment').forEach(el => removeElement(el));
removeElement(document.querySelector('.comments__form'));

const checkedComment = document.querySelectorAll('.menu__toggle[type=radio]');

for (let el of checkedComment) {
    el.addEventListener('click', event => {
        if (event.target.value === 'on' && event.target.checked) {
            document.querySelectorAll('.comments__form').forEach(el => showElement(el));
        } else {
            document.querySelectorAll('.comments__form').forEach(el => hideElement(el));
        }
    })
}

if(app){
    app.addEventListener('click', showComment);
}

function showComment() {
    if (event.target !== commentWrap || menuComments.dataset.state !== 'selected') {
        return;
    }
    addFormComment(event.clientX, event.clientY);
}

function addFormComment(x, y) {
    removeNewComment();
    const coordinates = getOffsetCoordinates(commentWrap, x, y);
    getCoords(coordinates.x, coordinates.y);
}

function removeNewComment() {
    if (!document.querySelector('.new-com')) {
        return;
    }
    removeElement(document.querySelector('.new-com'));
}

function getOffsetCoordinates(el, posX, posY) {
    const bounds = el.getBoundingClientRect();
    const coordX = Math.round(bounds.left);
    const coordsY = Math.round(bounds.top);
    const x = posX - coordX;
    const y = posY - coordsY;
    return {x, y};
}

function getCoords(x, y) {
    const form = commentForm.cloneNode(true);
    form.classList.add('new-com');
    form.dataset.coords = `${x}:${y}`;
    form.style.left = `${x}px`;
    form.style.top = `${y}px`;
    document.querySelector('.comments-box').appendChild(form);

    const formCheck = form.querySelector('.comments__marker-checkbox');
    const allFormCheck = document.querySelectorAll('.comments__marker-checkbox');

    formCheck.disabled = true;
    formCheck.checked = true;
    form.querySelector('.comments__input').focus();
    submitDisabled(form);

    const closeBtn = form.querySelector('.comments__close');
    closeBtn.addEventListener('click', () => {
        if (!form.classList.contains('new-com')) {
            formCheck.click();
            return;
        }
        removeElement(form);
    });

    form.addEventListener('submit', (event) => {

        event.preventDefault();
        form.classList.remove('new-com');
        formCheck.disabled = false;
        onSubmitComment(x, y, form);
        form.querySelector('.comments__body').insertBefore(commentLoader, form.querySelector('textarea'));
        form.querySelector('textarea').value = '';
        submitDisabled(form);

    });
}

function submitDisabled(form) {
    const submit = form.querySelector('.comments__submit');
    event.target.value ? submit.disabled = false : submit.disabled = true;
    form.querySelector('textarea').addEventListener('input', event => {
        event.target.value ? submit.disabled = false : submit.disabled = true;
    });
}

function onSubmitComment(x, y, form) {
    const params = `message=${form.querySelector('textarea').value}&left=${x}&top=${y}`;
    fetch(`https://neto-api.herokuapp.com/pic/${image.dataset.id}/comments`, {
        body: params,
        credentials: 'same-origin',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(res => {
            if (200 <= res.status && res.status < 300) {
                return res;
            }
            throw new Error(response.statusText);
        })
        .then(res => res.json())
        .then(res => {
        })
        .catch(er => {
            removeElement(form);
            const errorMessage = querySelector('.error__message').textContent = `${er.message}`;
            showElement(errorMessage);
            setTimeout(() => hideElement(errorMessage), 2000);
        });
}

function onSocket(id) {
    socket = new WebSocket(`wss://neto-api.herokuapp.com/pic/${id}`);
    socket.addEventListener('message', event => {
        const data = JSON.parse(event.data);
        switch (data.event) {
            case 'comment':
                console.log(data)
                showCommentSocket(data.comment);
                break;
            case 'pic':
                if (data.pic.comments) {
                    for (let key in data.pic.comments) {
                        showCommentSocket(data.pic.comments[key]);
                    }
                    document.querySelectorAll('.comments__marker-checkbox').forEach(check => check.checked = true);
                }
                if (data.pic.mask) {
                    console.log(data.pic.mask);
                    fetch(data.pic.mask)
                        .then(res => {
                            if (res.status !== 404) {
                                createImgMask(data.pic.mask);
                            }
                        });
                }
                break;
            case 'mask':
                createImgMask(data.url);
                break;
            case 'error':
                console.log(data);
                break;
        }
    });
}

function HideCommentForm() {
    if (document.querySelector('.menu__item.draw').dataset.state === 'selected') {
        if (commentForms) {
            Array.from(commentForms).forEach(el => el.checked = false);
        }
    }
}

function showCommentSocket(data) {
    HideCommentForm();
    const commentWrap = commentBox.cloneNode(true);
    const commentTime = new Date(data.timestamp);
    commentWrap.querySelector('.comment__message').textContent = data.message;
    commentWrap.querySelector('.comment__time').textContent = commentTime.toLocaleString('Ru-ru');
    const formComment = document.querySelector(`.comments__form[data-coords="${data.left}:${data.top}"]`);
    if (!formComment) {
        getCoords(data.left, data.top);
        showCommentSocket(data);
        return;
    }
    formComment.classList.remove('new-com');

    const commentBody = formComment.querySelector('.comments__body');
    commentBody.insertBefore(commentWrap, commentBody.querySelector('textarea'));

    if (formComment.querySelector('.loader')) {
        removeElement(formComment.querySelector('.loader').parentElement);
    }

    const currentCheckbox = formComment.querySelector('.comments__marker-checkbox');
    currentCheckbox.disabled = false;
}
