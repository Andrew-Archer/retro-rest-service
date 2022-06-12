if (!sessionStorage.getItem('id') && !location.hash) {
  window.location.replace("./");
} else {
  const REGEXP_NOT_EMPTY = /^\S{1,1}/;
  
  let xhr = new XMLHttpRequest();
  
  xhr.onload = function () {
    return xhr.response;
  };

  let isPause = true;
  setInterval(function(){
    console.log(isPause);
    if (isPause && location.hash) {
      location.reload();
    };
  }, 5000);
  
  var httpVerbs = {
    doPost(url, data, callback) {
      console.log(url);
      return window.fetch(url, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(callback);
    },
    doPut(url, data, callback) {
      return window.fetch(url, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(callback);
    },
    doGet(url, callback) {
      return window.fetch(url, {
        method: "GET"
      }).then(callback);
    },
    doDelete(url, callback) {
      return fetch(url, {
        method: "DELETE"
      }).then(callback);
    }
  };
  
  let boardRepository = {
    createBord(date, userId, nameBoard, callback) {
      return httpVerbs.doPost("./api/board",
      {
        "creationDate": date,
        "owner": userId,
        "name": nameBoard
      },
      callback);
    },
    deleteBoard(id, callback) {
      return httpVerbs.doDelete("./api/board/" + id, callback);
    },
    getBoardById(id, callback) {
      console.log(id);
      return httpVerbs.doGet("./api/board/"+id, callback);
    },
    updateBoard(id, ownerId, name, callback) {
      return httpVerbs.doPut('./api/board', {
        "id": id,
        "owner": ownerId,
        "name": name
      },
      callback);
    },
  };
  
  let columnRepository = {
    createColumn(boardId, nameColumn, callback) {
      return httpVerbs.doPost("./api/boardColumn",
      {
        "board": boardId,
        "name": nameColumn
      },
      callback);
    },
    deleteColumn(id, callback) {
      return httpVerbs.doDelete('./api/boardColumn/' + id, callback);
    },
    updateColumn(id, boardId, name, callback) {
      return httpVerbs.doPut('./api/boardColumn', {
        "id": id,
        "board": boardId,
        "name": name
      },
      callback);
    },
  };
  
  let commentRepository = {
    createCommit(idCard, comment, callback) {
      return httpVerbs.doPost("./api/comment",
      {
        "card": idCard,
        "content": comment
      },
      callback);
    },
    updateCommit(id, idCard, comment, callback) {
      return httpVerbs.doPut('./api/comment', {
        "id": id,
        "card": idCard,
        "content": comment
      },
      callback);
    },
  };
  
  let cardRepository = {
    createCard(columnId, title, likes, callback) {
      return httpVerbs.doPost("./api/card",
      {
        "boardColumn": columnId,
        "title": title,
        "likes": likes
      },
      callback);
    },
    deleteCard(id, callback) {
      return httpVerbs.doDelete("./api/card/" + id, callback);
    },
    updateCard(id, columnId, title, like, callback) {
      return httpVerbs.doPut('./api/card', {
        "id": id,
        "boardColumn": columnId,
        "title": title,
        "likes": like
      },
      callback);
    },
  };
  
  let userRepository = {
    createUser(email, password, callback) {
      return httpVerbs.doPost("./api/user", {
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
    updateUser() {},
    deleteUser() {},
    getUserById(id, callback) {
      return httpVerbs.doGet("./api/user/" + id, callback);
    },
    getUserAll(callback) {
      fetch('./api/user')
        // Retrieve its body as ReadableStream
        .then(response => {
          response.body;
        })
        .then(body => {
          const reader = body.getReader();
  
          return new ReadableStream({
            start(controller) {
              return pump();
  
              function pump() {
                return reader.read().then(({
                  done,
                  value
                }) => {
                  // When no more data needs to be consumed, close the stream
                  if (done) {
                    controller.close();
                    return;
                  }
  
                  // Enqueue the next data chunk into our target stream
                  controller.enqueue(value);
                  return pump();
                });
              }
            }
          })
        })
        .then(stream => {
          new Response(stream);
        })
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .catch(err => console.error(err));
    },
    gerUserByName(name, callback) {
      return httpVerbs.doGet("./api/user/" + name, callback)
    }
  };
  
  //Парсинг JSON, здесь нужно будет уточнить, как собираешься с сервера принимать запрос fetch, XMLHttpRequest и т.п.
  let parsBoard = [];
  //.base - элемент к которому привязываем приложение
  let base = document.querySelector('.base');
  
  var user = function (response) {
    response.text()
      .then((user) => {
        parsBoard = JSON.parse(user).boards;
        return parsBoard;
      })
      .then((boards) => {
        let board = new DashBoard(boards, base);
        board.createDashBoard();
      });
  };

  let responseGetById = function(response) {
    response.text()
    .then((res) => {
      if (res) {
        board = JSON.parse(res);
        const boardNew = new Board(board.name, board.columns, board.creationDate, this.parentEl, board.id);
        boardNew.createBoard();
        name.value = '';
      } else {
        window.location.replace("./listBoard.html");
      }
    })
  }

  if (location.hash) {
    let id = location.hash.split('#')[1];
    boardRepository.getBoardById(id, responseGetById);
  } else {
    const jsonBoard = xhr.onload();
    userRepository.getUserById(sessionStorage.getItem('id'), user);
  }
  
  
  let DashBoard = /** @class */ (function () {
    function DashBoard(listBoards, parentEl) {
      this.listBoards = listBoards;
      this.parentEl = parentEl;
      this.main = createElementWithClasses('main', ['main-board']);
      this.newBoard = createElementWithClasses('div', ['new-board']);
      this.contentCards = createElementWithClasses('div', ['content-cards']);
      this.svgPathD = {
        addBoard1: 'M2 63.3333V9.66667C2 7.63334 2.80774 5.68329 4.24551 4.24551C5.68329 2.80774 7.63334 2 9.66667 2H71C73.0333 2 74.9834 2.80774 76.4211 4.24551C77.8589 5.68329 78.6667 7.63334 78.6667 9.66667V63.3333C78.6667 65.3667 77.8589 67.3167 76.4211 68.7545C74.9834 70.1923 73.0333 71 71 71H9.66667C7.63334 71 5.68329 70.1923 4.24551 68.7545C2.80774 67.3167 2 65.3667 2 63.3333Z',
        addBoard2: 'M40.3333 44.1667V55.6667M2 17.3333H78.6667H2ZM28.8333 44.1667H40.3333H28.8333ZM51.8333 44.1667H40.3333H51.8333ZM40.3333 44.1667V32.6667V44.1667Z',
      };
  
      this.main.appendChild(this.newBoard);
      this.main.appendChild(this.contentCards);
      this.parentEl.innerHTML = '';
    };
  
    DashBoard.prototype.createDashBoard = function () {
      let title = createElementWithClasses('div', ['title__wrapper', 'justifi-center']);
      this.parentEl.appendChild(title);
      this.parentEl.appendChild(this.main);
      let userDiv = createElementWithClasses('div', ['user__wrapp', 'direction-row']);
      let userSpan = createElementWithClasses('span', ['username', 'font-size--24']);
      userSpan.textContent = sessionStorage.getItem('email');
      userDiv.appendChild(userSpan);
      let btnLogOut = createElementWithClasses('a', ['logout', 'font-size--24', 'margin-top--0']);
      btnLogOut.setAttribute('href', 'index.html');
      btnLogOut.textContent = 'Выход';
      btnLogOut.addEventListener('click', (e) => {
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('email');
      });
      userDiv.appendChild(btnLogOut);
      title.appendChild(userDiv);
  
      let iconAddBoardDiv = createElementWithClasses('div', []);
      this.newBoard.appendChild(iconAddBoardDiv);
  
      let iconAddBoardSvg = createSvg(81, 73, '0 0 81 73', 'none', [this.svgPathD.addBoard1, this.svgPathD.addBoard2], '', '#B3B3B3', 3);
      iconAddBoardDiv.appendChild(iconAddBoardSvg);
  
      let textAddBoardSpan = createElementWithClasses('span', ['add-board-text']);
      textAddBoardSpan.textContent = 'Добавить доску';
      this.newBoard.appendChild(textAddBoardSpan);
  
      this.listBoards.forEach((board) => {
        let cardBoard = new CardBoard(board.name, board.columns, board.creationDate, this.contentCards, board.id);
        cardBoard.createCardBoard();
      });
  
      const modalBoard = createModalNewBoard();
      const modal = modalBoard.modal;
      this.parentEl.appendChild(modal);
      this.newBoard.addEventListener('click', (e) => {
        e.preventDefault();
        const isClass = modal.classList.contains('display--none');
        if (isClass) {
          modal.classList.remove('display--none');
        }
      });
  
      modal.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target;
        if ((target.closest('.modal') && !target.closest('.cancel') && !target.closest('.ok')) || target.closest('.ok')) e.stopPropagation();
        else if (target.closest('.modal-content')) modal.classList.add('display--none');
  
        const arrColumns = [];
        if (target.closest('.ok')) {
          const listColumns = document.querySelectorAll('.inputNewColumn');
          const name = document.querySelector('.name-input');
          let isVal = true;
          if (name.value) name.classList.remove('error');
          else {
            isVal = false;
            name.classList.add('error');
          }
          let i = 1;
          listColumns.forEach((column) => {
            arrColumns.push(column.value);
            if (column.value == '') {
              column.classList.add('error');
              isVal = false;
            } else {
              column.classList.remove('error');
            }
            i++;
          });
  
          let responseBoardById = function(response) {
            response.text()
            .then((res) => {
              board = JSON.parse(res);
              const boardNew = new Board(board.name, board.columns, board.creationDate, this.parentEl, board.id);
              boardNew.createBoard();
              name.value = '';
            })
          }
  
          let responseBoard = function(response) {
            response.text()
              .then((res) => {
                board = JSON.parse(res);
                return board;
              })
              .then((board) => {
                arrColumns.forEach((columnName) => {
                  columnRepository.createColumn(board.id, columnName);
                });
                return board.id;
              })
              .then((id) => {
                location.hash += id;
                boardRepository.getBoardById(id, responseBoardById)
              });
          };
  
          if (isVal) {
            let date = formatDate(new Date()).strFullDate;
            boardRepository.createBord(date, sessionStorage.getItem('id'), name.value, responseBoard);
          }
        }
      });
    }
  
    return DashBoard;
  }());
  
  let CardBoard = /** @class */ (function () {
    function CardBoard(name, columns, date, parentEl, id) {
      this.name = name;
      this.countCard = columns.length;
      this.columns = columns;
      this.date = date.split('+')[0];
      this.parentEl = parentEl;
      this.idBoard = id;
      this.svgPathD = {
        diagram: 'M17.6667 9.33333H10.1667C9.94565 9.33333 9.73369 9.42113 9.57741 9.57741C9.42113 9.73369 9.33333 9.94565 9.33333 10.1667V19.0556M9.33333 26H17.6667H9.33333ZM9.33333 26V19.0556V26ZM9.33333 26H1.83333C1.61232 26 1.40036 25.9122 1.24408 25.7559C1.0878 25.5996 1 25.3877 1 25.1667V19.8889C1 19.6679 1.0878 19.4559 1.24408 19.2996C1.40036 19.1434 1.61232 19.0556 1.83333 19.0556H9.33333V26ZM17.6667 26V9.33333V26ZM17.6667 26H25.1667C25.3877 26 25.5996 25.9122 25.7559 25.7559C25.9122 25.5996 26 25.3877 26 25.1667V1.83333C26 1.61232 25.9122 1.40036 25.7559 1.24408C25.5996 1.0878 25.3877 1 25.1667 1H18.5C18.279 1 18.067 1.0878 17.9107 1.24408C17.7545 1.40036 17.6667 1.61232 17.6667 1.83333V9.33333V26Z',
        cards: 'M1 1H8V8H1V1ZM12 1H19V8H12V1ZM12 12H19V19H12V12ZM1 12H8V19H1V12Z',
        calendar1: 'M1 9H19M14 1V5V1ZM6 1V5V1Z',
        calendar2: 'M17 3H3C1.89543 3 1 3.89543 1 5V19C1 20.1046 1.89543 21 3 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3Z',
        delete: 'M16.125 13.375V21.625M1 6.5H25.75H1ZM23 6.5V25.75C23 26.4793 22.7103 27.1788 22.1945 27.6945C21.6788 28.2103 20.9793 28.5 20.25 28.5H6.5C5.77065 28.5 5.07118 28.2103 4.55546 27.6945C4.03973 27.1788 3.75 26.4793 3.75 25.75V6.5H23ZM7.875 6.5V3.75C7.875 3.02065 8.16473 2.32118 8.68046 1.80546C9.19618 1.28973 9.89565 1 10.625 1H16.125C16.8543 1 17.5538 1.28973 18.0695 1.80546C18.5853 2.32118 18.875 3.02065 18.875 3.75V6.5H7.875ZM10.625 13.375V21.625V13.375Z',
      }
      this.cardBoardDiv = createElementWithClasses('div', ['card-board']);
  
      this.parentEl.appendChild(this.cardBoardDiv);
    };
  
    CardBoard.prototype.createCardBoard = function () {
      let contentDiv = createElementWithClasses('div', ['card-board-content']);
      this.cardBoardDiv.appendChild(contentDiv);
  
      let doubleDiv = createElementWithClasses('div', ['card-board-double']);
      contentDiv.appendChild(doubleDiv);
      let titleDiv1 = createElementWithClasses('div', ['card-board-item', 'card-board-title']);
      doubleDiv.appendChild(titleDiv1);
  
      let iconTitleSpan = createElementWithClasses('sapn', ['card-board-icon']);
      titleDiv1.appendChild(iconTitleSpan);
      let iconTitleSvg = createSvg(27, 27, '0 0 27 27', 'none', [this.svgPathD.diagram], '', '#444444', 1.5);
      iconTitleSpan.appendChild(iconTitleSvg);
      let textTitleSpan = createElementWithClasses('span', ['card-board-text', 'card-board-title']);
      titleDiv1.appendChild(textTitleSpan);
      textTitleSpan.textContent = this.name;
  
  
      let titleDiv2 = createElementWithClasses('div', ['card-board-item', 'card-board-title']);
      doubleDiv.appendChild(titleDiv2);
  
      let iconCountSpan = createElementWithClasses('sapn', ['card-board-icon']);
      titleDiv2.appendChild(iconCountSpan);
      let iconCountSvg = createSvg(20, 20, '0 0 20 20', 'none', [this.svgPathD.cards], '', '#C4C4C4', 1.5);
      iconCountSpan.appendChild(iconCountSvg);
      let textCountSpan = createElementWithClasses('span', ['card-board-text']);
      titleDiv2.appendChild(textCountSpan);
      textCountSpan.textContent = this.countCard + ' карточек';
  
      let titleDiv3 = createElementWithClasses('div', ['card-board-item', 'card-board-title']);
      contentDiv.appendChild(titleDiv3);
  
      let iconDateSpan = createElementWithClasses('sapn', ['card-board-icon']);
      titleDiv3.appendChild(iconDateSpan);
      let iconDateSvg = createSvg(27, 27, '0 0 27 27', 'none', [this.svgPathD.calendar1, this.svgPathD.calendar2], '', '#C4C4C4', 1.5);
      iconDateSpan.appendChild(iconDateSvg);
      let textDateSpan = createElementWithClasses('span', ['card-board-text']);
      titleDiv3.appendChild(textDateSpan);
      textDateSpan.textContent = formatDate(new Date(this.date)).strDate;
  
      let deleteDiv = createElementWithClasses('div', ['card-board-delete']);
      this.cardBoardDiv.appendChild(deleteDiv);
      let deleteBoard = function (responce) {
        responce.text()
          .then((res) => {
            console.log('del');
          })
          .catch(err => console.log(err));
      };
      deleteDiv.addEventListener('click', (e) => {
        e.preventDefault();
        boardRepository.deleteBoard(this.idBoard, deleteBoard);
        this.parentEl.removeChild(this.cardBoardDiv);
      });
  
      let iconDeleteSvg = createSvg(27, 30, '0 0 27 30', 'none', [this.svgPathD.delete], '', '#444444', 1.5);
      deleteDiv.appendChild(iconDeleteSvg);
  
      this.cardBoardDiv.addEventListener('click', (e) => {
        e.preventDefault();
        if (!e.target.closest('.card-board-delete')) {
          location.hash += this.idBoard;
          const board = new Board(this.name, this.columns, this.date, this.parentEl, this.idBoard);
          board.createBoard();
        }
      })
    }
  
    return CardBoard;
  }());
  
  var Board = /** @class */ (function () {
    function Board(name, columns, date, parentEl, idBoard) {
      this.name = name;
      this.columns = columns;
      this.idBoard = idBoard;
      this.date = date;
      this.svgPathD = {
        add: 'M18 15L15 12M13 5H1H13ZM9 9H1H9ZM5 13H1H5ZM17 1H1H17ZM18 5V15V5ZM18 15L21 12L18 15Z',
        time1: 'M17 2.5L15 1M15 12H10V7L15 12ZM3 2.5L5 1L3 2.5Z',
        time2: 'M10 21C11.1819 21 12.3522 20.7672 13.4442 20.3149C14.5361 19.8626 15.5282 19.1997 16.364 18.364C17.1997 17.5282 17.8626 16.5361 18.3149 15.4442C18.7672 14.3522 19 13.1819 19 12C19 10.8181 18.7672 9.64778 18.3149 8.55585C17.8626 7.46392 17.1997 6.47177 16.364 5.63604C15.5282 4.80031 14.5361 4.13738 13.4442 3.68508C12.3522 3.23279 11.1819 3 10 3C7.61305 3 5.32387 3.94821 3.63604 5.63604C1.94821 7.32387 1 9.61305 1 12C1 14.3869 1.94821 16.6761 3.63604 18.364C5.32387 20.0518 7.61305 21 10 21V21Z',
        column: 'M7 7H12.4C12.5591 7 12.7117 7.06321 12.8243 7.17574C12.9368 7.28826 13 7.44087 13 7.6V14M13 19H7H13ZM13 19V14V19ZM13 19H18.4C18.5591 19 18.7117 18.9368 18.8243 18.8243C18.9368 18.7117 19 18.5591 19 18.4V14.6C19 14.4409 18.9368 14.2883 18.8243 14.1757C18.7117 14.0632 18.5591 14 18.4 14H13V19ZM7 19V7V19ZM7 19H1.6C1.44087 19 1.28826 18.9368 1.17574 18.8243C1.06321 18.7117 1 18.5591 1 18.4V1.6C1 1.44087 1.06321 1.28826 1.17574 1.17574C1.28826 1.06321 1.44087 1 1.6 1H6.4C6.55913 1 6.71174 1.06321 6.82426 1.17574C6.93679 1.28826 7 1.44087 7 1.6V7V19Z',
      };
      this.main = createElementWithClasses('main', ['main', 'container']);
      this.listColors = ['009886', 'F44747', 'A63EB9', '2C4AC9', '208EED'];
  
      this.parentEl = document.querySelector('.base');
      this.parentEl.innerHTML = '';
    }
  
    Board.prototype.createBoard = function () {
  
      let title = createElementWithClasses('div', ['title__wrapper']);
      let btnLogOut = createElementWithClasses('a', ['logout']);
      title.appendChild(btnLogOut);
      let btnBack = createElementWithClasses('button', ['btn--back']);
      btnBack.textContent = 'Назад';
      if (sessionStorage.getItem('id')) {
        title.appendChild(btnBack);
      }
      btnBack.addEventListener('click', (e) => {
        e.preventDefault();
        location.hash = '';
        userRepository.getUserById(sessionStorage.getItem('id'), user);
      })
      
      let divEdit = createElementWithClasses('div', ['board-name-edit']);
      title.appendChild(divEdit);
      let spanTitle = createElementWithClasses('h1', ['board__title']);
      spanTitle.textContent = this.name;
      divEdit.appendChild(spanTitle);
      let userDiv = createElementWithClasses('div', ['user__wrapp']);
      let userSpan = createElementWithClasses('span', ['username']);
      userSpan.textContent = sessionStorage.getItem('email') ? sessionStorage.getItem('email') : 'Гость';
      userDiv.appendChild(userSpan);

      btnLogOut.setAttribute('href', 'index.html');
      btnLogOut.textContent = 'На главную';
      btnLogOut.addEventListener('click', (e) => {
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('email');
      });
      
      if (sessionStorage.getItem('id')) {
        btnLogOut.textContent = 'Выход';
        userDiv.appendChild(btnLogOut);
      }
      
      title.appendChild(userDiv);
  
  
  
      header = createElementWithClasses('header', ['header', 'container']);
  
      let dropdownDiv = createElementWithClasses('div', ['dropdown']);
      if (sessionStorage.getItem("id")) {
        header.appendChild(dropdownDiv);
      }
  
      let btnAddButton = createElementWithClasses('button', ['btn', 'btn-add', 'padding-0']);
      dropdownDiv.appendChild(btnAddButton);
  
      let titleAddSpan = createElementWithClasses('span', ['title']);
      titleAddSpan.textContent = 'Добавить';
      btnAddButton.appendChild(titleAddSpan);
  
      let iconAddSpan = createElementWithClasses('span', ['icon']);
      btnAddButton.appendChild(iconAddSpan);
  
      let iconAddSVG = createSvg(22, 16, '0 0 22 16', 'none', [this.svgPathD.add], '', 'white');
      iconAddSpan.appendChild(iconAddSVG);
  
      let dropdownContentDiv = createElementWithClasses('div', ['dropdown-content']);
      dropdownDiv.appendChild(dropdownContentDiv);
  
      let btnTimeButton = createElementWithClasses('button', ['btn', 'btn-dropdown', 'btn-time', 'br-1']);
      dropdownContentDiv.appendChild(btnTimeButton);
  
      let timeTitleSpan = createElementWithClasses('span', ['title']);
      timeTitleSpan.textContent = 'Новый таймер';
      btnTimeButton.appendChild(timeTitleSpan);
  
      let timeIconSpan = createElementWithClasses('span', ['icon']);
      btnTimeButton.appendChild(timeIconSpan);
  
      let timeSVG = createSvg(20, 22, '0 0 20 22', 'none', [this.svgPathD.time1, this.svgPathD.time2], '', '#444444');
      timeIconSpan.appendChild(timeSVG);
  
      let btnColumnButton = createElementWithClasses('button', ['btn', 'btn-dropdown', 'btn-column']);
      dropdownContentDiv.appendChild(btnColumnButton);
  
      let columnTitleSpan = createElementWithClasses('span', ['title']);
      columnTitleSpan.textContent = 'Новый столбец';
      btnColumnButton.appendChild(columnTitleSpan);
  
      let columnIconSpan = createElementWithClasses('span', ['icon']);
      btnColumnButton.appendChild(columnIconSpan);
  
      let columnSVG = createSvg(20, 22, '0 0 20 22', 'none', [this.svgPathD.column], '', '#444444');
      columnIconSpan.appendChild(columnSVG);
  
      let modalObj = addModal('timer', 'Установите таймер', 'number', 'Старт', 5);
      let modal = modalObj.modal;
      let inpValue = modalObj.input;
      let body = document.querySelector('body');
      body.appendChild(modal);
  
      btnTimeButton.addEventListener('click', function (e) {
        e.preventDefault();
        isPause = false;
        const isClass = modal.classList.contains('display--none');
        if (isClass) {
          modal.classList.remove('display--none');
        }
      });
  
      let timerBox;
      modal.addEventListener('click', function (e) {
        const target = e.target;
        if (target.closest('.modal') && !target.closest('.cancel-timer') && !target.closest('.ok-timer')) e.stopPropagation();
        else if (target.closest('.modal-content')) {
          modal.classList.add('display--none');
          isPause = true;
        };
  
        if (target.closest('.ok-timer')) {
          isPause = true;
          if (timerBox) header.removeChild(timerBox);
          timerBox = createTimer(inpValue.value);
          header.appendChild(timerBox);
        }
      });
  
      
      let responseColumn = (response) => {
        response.text()
          .then((res) => {
            let column = JSON.parse(res);
            let columnNew = new Column(column.name, column.cards, this.main, this.listColors[i], column.id, column.board);
            columnNew.createColumn();
  
            if (i < this.listColors.length - 1) i++;
            else i = 0;
  
            header.style.width = this.main.scrollWidth + 'px';
          })
      }
  
      let i = 0;
      btnColumnButton.addEventListener('click', (e) => {
        e.preventDefault();
        columnRepository.createColumn(this.idBoard, 'Новая колонка', responseColumn)
  
      });
  
      this.columns.forEach(columnEl => {
        let column = new Column(columnEl.name, columnEl.cards, this.main, this.listColors[i], columnEl.id, columnEl.board);
        column.createColumn();
        if (i < this.listColors.length - 1) i++;
        else i = 0;
      });
  
      let divEditInp = createElementWithClasses('div', ['wrapper__edit']);
      let inputEdit = createElementWithClasses('input', ['input', 'inp-edit-title']);
      divEditInp.appendChild(inputEdit);
      let btnCancel = createElementWithClasses('button', ['btn-icon', 'btn-cancel']);
      btnCancel.textContent = 'X';
      divEditInp.appendChild(btnCancel);
      let btnDone = createElementWithClasses('button', ['btn-icon', 'btn-done']);
      btnDone.textContent = 'OK';
      divEditInp.appendChild(btnDone);
  
      let responseBoardUpdate = (response) => {
        response.text()
          .then((resp) => {
            let board = JSON.parse(resp);
            spanTitle.textContent = board.name;
            isPause = true;
          })
      }
  
      if (sessionStorage.getItem('id')) {
        spanTitle.addEventListener('click', (e) => {
          e.preventDefault();
          isPause = false;
          divEdit.removeChild(spanTitle);
          divEdit.appendChild(divEditInp);
          divEdit.classList.add('edit');
          btnDone.addEventListener('click', (e) => {
            e.preventDefault();
            const inpValue = inputEdit.value;
            if (REGEXP_NOT_EMPTY.test(inpValue)) {
              boardRepository.updateBoard(this.idBoard, sessionStorage.getItem('id'), inpValue, responseBoardUpdate);
            }
            divEdit.removeChild(divEditInp);
            divEdit.appendChild(spanTitle);
            divEdit.classList.remove('edit');
            inputEdit.value = '';
          });
          btnCancel.addEventListener('click', (e) => {
            e.preventDefault();
            divEdit.removeChild(divEditInp);
            divEdit.appendChild(spanTitle);
            divEdit.classList.remove('edit');
            inputEdit.value = '';
          })
        });
      }
  
      let hr = createElementWithClasses('hr', ['hr']);
  
      this.parentEl.appendChild(title);
      this.parentEl.appendChild(hr);
      this.parentEl.appendChild(header);
      this.parentEl.appendChild(this.main);
    }
  
    return Board;
  }());
  
  var Column = /** @class */ (function () {
    function Column(name, cards, parentEl, color, id, boardId) {
      this.name = name;
      this.cards = cards ? cards : [];
      this.parentEl = parentEl;
      this.column = createElementWithClasses('div', ['column']);
      this.color = color;
      this.columnId = id;
      this.boardId = boardId;
      this.svgPathD = {
        delete: 'M12.5004 0.950113L7.55026 5.90022L2.60015 0.950113L0.950112 2.60015L5.90022 7.55026L0.950112 12.5004L2.60015 14.1504L7.55026 9.2003L12.5004 14.1504L14.1504 12.5004L9.2003 7.55026L14.1504 2.60015L12.5004 0.950113Z',
        like: 'M2 19L15.307 19C15.7139 18.9986 16.1108 18.8738 16.4452 18.6421C16.7796 18.4103 17.0359 18.0825 17.18 17.702L19.937 10.351C19.9789 10.2387 20.0002 10.1198 20 10L20 8C20 6.897 19.103 6 18 6L12.388 6L13.51 2.633C13.61 2.33236 13.6374 2.01229 13.5897 1.69905C13.5421 1.3858 13.4209 1.08832 13.236 0.830999C12.86 0.310999 12.254 0 11.612 0L10 0C9.703 0 9.422 0.132 9.231 0.360001L4.531 6H2C0.896997 6 -1.90735e-06 6.897 -1.90735e-06 8L-1.90735e-06 17C-1.90735e-06 18.103 0.896997 19 2 19ZM10.469 2L11.614 2L10.052 6.684C10.002 6.83425 9.98831 6.99424 10.0122 7.1508C10.0361 7.30735 10.0968 7.456 10.1894 7.5845C10.2819 7.713 10.4037 7.81767 10.5446 7.88991C10.6856 7.96215 10.8416 7.99988 11 8L18 8L18 9.819L15.307 17L6 17L6 7.362L10.469 2ZM4 8L4 17H2L1.999 8H4Z',
        comment: 'M10 0C4.486 0 0 3.589 0 8C0 10.908 1.898 13.516 5 14.934V20L10.34 15.995C15.697 15.852 20 12.32 20 8C20 3.589 15.514 0 10 0ZM10 14H9.667L7 16V13.583L6.359 13.336C3.67 12.301 2 10.256 2 8C2 4.691 5.589 2 10 2C14.411 2 18 4.691 18 8C18 11.309 14.411 14 10 14Z',
      }
    }
  
    Column.prototype.createColumn = function () {
  
      let columnGDiv = createElementWithClasses('div', ['column-g']);
      this.column.appendChild(columnGDiv);
  
      let headerColumnDiv = createElementWithClasses('div', ['header-column']);
      columnGDiv.appendChild(headerColumnDiv);
  
      let nameDiv = createElementWithClasses('div', ['name', 'border-' + this.color, 'display--flex']);
  
      let deleteSpan = createElementWithClasses('span', ['delete']);
      let div20 = createElementWithClasses('div', ['w-10']);
      if (sessionStorage.getItem("id")) {
        div20.appendChild(deleteSpan);
      }
  
      let nameSpan = createElementWithClasses('span', []);
      let div80 = createElementWithClasses('div', ['w-88']);
      div80.appendChild(nameSpan);
      nameSpan.textContent = this.name;
      nameDiv.appendChild(div80);
      nameDiv.appendChild(div20);
      headerColumnDiv.appendChild(nameDiv);
  
      let responseColumnDel = (responce) => {
        responce.text()
          .then((resp) => {
            this.parentEl.removeChild(this.column);
          })
      }
  
      deleteSpan.addEventListener('click', (e) => {
        e.preventDefault();
        columnRepository.deleteColumn(this.columnId, responseColumnDel);
      })
  
      let deleteSvg = createSvg(15, 15, '0 0 15 15', 'none', [this.svgPathD.delete], '#' + this.color);
      deleteSpan.appendChild(deleteSvg);
  
      let divEdit = createElementWithClasses('div', ['column-name-edit']);
      let inputEdit = createElementWithClasses('input', ['input', 'inp-edit']);
      divEdit.appendChild(inputEdit);
      let btnCancel = createElementWithClasses('button', ['btn-icon', 'btn-cancel']);
      btnCancel.textContent = 'X';
      divEdit.appendChild(btnCancel);
      let btnDone = createElementWithClasses('button', ['btn-icon', 'btn-done']);
      btnDone.textContent = 'OK';
      divEdit.appendChild(btnDone);
  
      let responseColumnUpdate = (response) => {
        response.text()
          .then((resp) => {
            let column = JSON.parse(resp);
            nameSpan.textContent = column.name;
          });
      }
  
      if (sessionStorage.getItem('id')) {
        nameSpan.addEventListener('click', (e) => {
          isPause = false;
          e.preventDefault();
          div80.removeChild(nameSpan);
          div80.appendChild(divEdit);
          div80.classList.add('edit');
          btnDone.addEventListener('click', (e) => {
            e.preventDefault();
            const inpValue = inputEdit.value;
            if (REGEXP_NOT_EMPTY.test(inpValue)) {
              columnRepository.updateColumn(this.columnId, this.boardId, inpValue, responseColumnUpdate);
            }
            div80.removeChild(divEdit);
            div80.appendChild(nameSpan);
            div80.classList.remove('edit');
            inputEdit.value = '';
            isPause = true;
          });
          btnCancel.addEventListener('click', (e) => {
            e.preventDefault();
            isPause = true;
            div80.removeChild(divEdit);
            div80.appendChild(nameSpan);
            div80.classList.remove('edit');
            inputEdit.value = '';
          })
        });
      }
  
      let btnAddCard = createElementWithClasses('button', ['btn', 'btn-add-card']);
      btnAddCard.textContent = '+';
      headerColumnDiv.appendChild(btnAddCard);
  
  
      let cardsDiv = createElementWithClasses('div', ['cards']);
      this.column.appendChild(cardsDiv);
  
      this.cards.forEach(card => {
        
        let cardEl = new Card(card.title, cardsDiv, this.color, card.comments, card.likes, card.id, card.boardColumn);
        cardEl.createCard();
      });
  
      let responseCard = (response) => {
        response.text()
          .then((resp) => {
            let column = JSON.parse(resp);
            let card = new Card(column.title, cardsDiv, this.color, column.comments, column.likes, column.id, this.columnId);
            card.createCard();          
          });
      }
  
      btnAddCard.addEventListener('click', (e) => {
        e.preventDefault();
        cardRepository.createCard(this.columnId, 'Новая карточка', 0, responseCard);
      })
  
      this.parentEl.appendChild(this.column);
    }
  
    return Column;
  }());
  
  var Card = /** @class */ (function () {
    function Card(title, parentEl, color, comment, like, id, columnId) {
      this.title = title;
      this.like = like;
      this.comment = comment;
      this.parentEl = parentEl;
      this.id = id;
      this.columnId = columnId;
      this.svgPathD = {
          delete: 'M12.5004 0.950113L7.55026 5.90022L2.60015 0.950113L0.950112 2.60015L5.90022 7.55026L0.950112 12.5004L2.60015 14.1504L7.55026 9.2003L12.5004 14.1504L14.1504 12.5004L9.2003 7.55026L14.1504 2.60015L12.5004 0.950113Z',
          like: 'M2 19L15.307 19C15.7139 18.9986 16.1108 18.8738 16.4452 18.6421C16.7796 18.4103 17.0359 18.0825 17.18 17.702L19.937 10.351C19.9789 10.2387 20.0002 10.1198 20 10L20 8C20 6.897 19.103 6 18 6L12.388 6L13.51 2.633C13.61 2.33236 13.6374 2.01229 13.5897 1.69905C13.5421 1.3858 13.4209 1.08832 13.236 0.830999C12.86 0.310999 12.254 0 11.612 0L10 0C9.703 0 9.422 0.132 9.231 0.360001L4.531 6H2C0.896997 6 -1.90735e-06 6.897 -1.90735e-06 8L-1.90735e-06 17C-1.90735e-06 18.103 0.896997 19 2 19ZM10.469 2L11.614 2L10.052 6.684C10.002 6.83425 9.98831 6.99424 10.0122 7.1508C10.0361 7.30735 10.0968 7.456 10.1894 7.5845C10.2819 7.713 10.4037 7.81767 10.5446 7.88991C10.6856 7.96215 10.8416 7.99988 11 8L18 8L18 9.819L15.307 17L6 17L6 7.362L10.469 2ZM4 8L4 17H2L1.999 8H4Z',
          comment: 'M10 0C4.486 0 0 3.589 0 8C0 10.908 1.898 13.516 5 14.934V20L10.34 15.995C15.697 15.852 20 12.32 20 8C20 3.589 15.514 0 10 0ZM10 14H9.667L7 16V13.583L6.359 13.336C3.67 12.301 2 10.256 2 8C2 4.691 5.589 2 10 2C14.411 2 18 4.691 18 8C18 11.309 14.411 14 10 14Z',
        },
        this.card = createElementWithClasses('div', ['card']);
      this.color = color;
    }
  
    Card.prototype.createCard = function () {
  
      let wrapperCardDiv = createElementWithClasses('div', ['wrapper__card', 'color-' + this.color]);
      this.card.appendChild(wrapperCardDiv);
  
      let wrapCommentsDiv = createElementWithClasses('div', ['wrapp__comments', 'color-' + this.color, 'display--none']);
      this.card.appendChild(wrapCommentsDiv);
  
  
      let inpCommentDiv = createElementWithClasses('div', ['card-edit']);
      wrapCommentsDiv.appendChild(inpCommentDiv);
  
      this.comment.forEach((comment) => {
        let newComment = new CommentItem(comment.content, comment.id, comment.card, wrapCommentsDiv);
        newComment.createComment();
      });
  
      let comentTextarea = createElementWithClasses('textarea', ['card-edit-text']);
      inpCommentDiv.appendChild(comentTextarea);
  
      let commentBtn = createElementWithClasses('button', ['card-btn-done']);
      commentBtn.textContent = 'OK';
      inpCommentDiv.appendChild(commentBtn);
  
  
  
      let contentDiv = createElementWithClasses('div', ['content']);
      wrapperCardDiv.appendChild(contentDiv);
  
      let cardTextSpan = createElementWithClasses('span', ['card-text']);
      cardTextSpan.textContent = this.title;
      contentDiv.appendChild(cardTextSpan);
  
      let deleteSpan = createElementWithClasses('span', ['delete']);
      if (sessionStorage.getItem("id")) {
        contentDiv.appendChild(deleteSpan);
      }
  
      let responseCardDel = (response) => {
        response.text()
          .then(() => {
            this.parentEl.removeChild(this.card);
          })
      }
      deleteSpan.addEventListener('click', (e) => {
        e.preventDefault();
        cardRepository.deleteCard(this.id, responseCardDel)
      })
  
      let deleteSvg = createSvg(15, 15, '0 0 15 15', 'none', [this.svgPathD.delete], 'white');
      deleteSpan.appendChild(deleteSvg);
  
      let feedbackDiv = createElementWithClasses('div', ['feedback']);
      wrapperCardDiv.appendChild(feedbackDiv);
  
      let cardLikeSpan = createElementWithClasses('span', ['card-like']);
      feedbackDiv.appendChild(cardLikeSpan);
  
      let likeSvg = createSvg(20, 19, '0 0 20 19', 'none', [this.svgPathD.like], 'white');
      cardLikeSpan.appendChild(likeSvg);
  
      let cardTextLikeSpan = createElementWithClasses('span', ['card-text', 'card-count']);
      cardTextLikeSpan.textContent = this.like ? this.like : '0';
      feedbackDiv.appendChild(cardTextLikeSpan);
  
      let cardCommentSpan = createElementWithClasses('span', ['card-comment']);
      feedbackDiv.appendChild(cardCommentSpan);
  
      let commentSvg = createSvg(20, 20, '0 0 20 20', 'none', [this.svgPathD.comment], 'white');
      cardCommentSpan.appendChild(commentSvg);
  
      cardCommentSpan.addEventListener('click', (e) => {
        e.preventDefault();
        wrapCommentsDiv.classList.toggle('display--none');
        cardCommentSpan.classList.toggle('selection');
      });
  
      let cardTextCommentSpan = createElementWithClasses('span', ['card-text', 'card-count']);
      cardTextCommentSpan.textContent = this.comment.length;
      feedbackDiv.appendChild(cardTextCommentSpan);
  
      let responseComment = (response) => {
        response.text()
          .then((resp) => {
            let comment = JSON.parse(resp);
            let newComment = new CommentItem(comment.content, comment.id, comment.card, wrapCommentsDiv);
            newComment.createComment();
            comentTextarea.value = '';
            cardTextCommentSpan.textContent++;
          })
      };
  
      commentBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let comment = comentTextarea.value;
        if (REGEXP_NOT_EMPTY.test(comment)) {
          commentRepository.createCommit(this.id, comment, responseComment);
        }
      });
  
      let editCardDiv = createElementWithClasses('div', ['card-edit']);
  
      let editTextArea = createElementWithClasses('textarea', ['card-edit-text']);
      editCardDiv.appendChild(editTextArea);
  
      let btnDone = createElementWithClasses('button', ['card-btn-done']);
      btnDone.textContent = 'OK';
      editCardDiv.appendChild(btnDone);
  
      let responseCardUpdate = (response) => {
        response.text()
          .then((resp) => {
            let card = JSON.parse(resp);
            console.log(card);
            cardTextSpan.textContent = card.title;
            this.title = card.title;
            cardTextLikeSpan.textContent = card.likes ? card.likes : 0;
            this.like = card.likes ? card.likes : 0;
          })
      }
  
      cardLikeSpan.addEventListener('click', (e) => {
        e.preventDefault();
        cardRepository.updateCard(this.id, this.columnId, this.title, ++this.like, responseCardUpdate);
      })
  
      contentDiv.addEventListener('click', (e) => {
        e.preventDefault();
        isPause = false;
        wrapperCardDiv.removeChild(contentDiv);
        wrapperCardDiv.removeChild(feedbackDiv);
        wrapperCardDiv.appendChild(editCardDiv);
        wrapperCardDiv.classList.add('border2-' + this.color, 'edit');
        wrapperCardDiv.classList.remove('color-' + this.color);
  
        btnDone.addEventListener('click', (e) => {
          e.preventDefault();
          const editCardValue = editTextArea.value;
          if (REGEXP_NOT_EMPTY.test(editCardValue)) {
            cardRepository.updateCard(this.id, this.columnId, editCardValue, this.like, responseCardUpdate);
          }
          wrapperCardDiv.removeChild(editCardDiv);
          wrapperCardDiv.appendChild(contentDiv);
          wrapperCardDiv.appendChild(feedbackDiv);
          wrapperCardDiv.classList.remove('border2-' + this.color, 'edit');
          wrapperCardDiv.classList.add('color-' + this.color);
          isPause = true;
        });
  
      });
  
      this.parentEl.appendChild(this.card);
    }
  
    return Card;
  }());
  
  var CommentItem = /** @class */ (function () {
    function CommentItem(text, id, cardId, parentEl) {
      this.text = text;
      this.id = id;
      this.cardId = cardId;
      this.parentEl = parentEl;
      this.commentTextDiv = createElementWithClasses('div', ['comment__item']);
    };
  
    CommentItem.prototype.createComment = function () {
      let commentSpan = createElementWithClasses('span', ['comment__text']);
      commentSpan.textContent = this.text;
      this.commentTextDiv.appendChild(commentSpan);

      let divEdit = createElementWithClasses('div', ['column-name-edit']);
      let inputEdit = createElementWithClasses('input', ['input', 'inp-edit']);
      divEdit.appendChild(inputEdit);
      let btnCancel = createElementWithClasses('button', ['btn-icon', 'btn-cancel']);
      btnCancel.textContent = 'X';
      divEdit.appendChild(btnCancel);
      let btnDone = createElementWithClasses('button', ['btn-icon', 'btn-done']);
      btnDone.textContent = 'OK';
      divEdit.appendChild(btnDone);

      let responseCommentUpdate = (response) => {
        response.text()
          .then((resp) => {
            let comment = JSON.parse(resp);
            commentSpan.textContent = comment.content;
            this.text = comment.content;
          })
      }

      commentSpan.addEventListener('click', (e) => {
        e.preventDefault();
        this.commentTextDiv.removeChild(commentSpan);
        this.commentTextDiv.appendChild(divEdit);
        this.commentTextDiv.classList.add('edit');
        btnDone.addEventListener('click', (e) => {
          e.preventDefault();
          const inpValue = inputEdit.value;
          if (REGEXP_NOT_EMPTY.test(inpValue)) {
            commentRepository.updateCommit(this.id, this.cardId, inpValue, responseCommentUpdate);
          }
          this.commentTextDiv.removeChild(divEdit);
          this.commentTextDiv.appendChild(commentSpan);
          this.commentTextDiv.classList.remove('edit');
          inputEdit.value = '';
        });
        btnCancel.addEventListener('click', (e) => {
          e.preventDefault();
          this.commentTextDiv.removeChild(divEdit);
          this.commentTextDiv.appendChild(commentSpan);
          this.commentTextDiv.classList.remove('edit');
          inputEdit.value = '';
        })
      })
  
      this.parentEl.appendChild(this.commentTextDiv);
    };
  
    return CommentItem;
  }());
  
  //Вспомогательные функции
  function createSvg(width, height, viewBox, fill, pathD, pathFill, pathStroke, patchStrokeWidtch) {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('fill', fill);
    if (patchStrokeWidtch) svg.setAttribute('stroke-width', patchStrokeWidtch);
  
  
    pathD.forEach((d) => {
      let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', pathFill);
      path.setAttribute('stroke', pathStroke);
      svg.appendChild(path);
    })
  
    return svg;
  }
  
  function createElementWithClasses(elTag, listClasses) {
    var element = document.createElement(elTag);
    listClasses.forEach(classEl => {
      element.classList.add(classEl);
    });
    return element;
  }
  
  function formatDate(date) {
    let strDate = '';
    const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const day = (date.getDate() + 1) < 10 ? '0' + (date.getDate() + 1) : (date.getDate() + 1);
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    strFullDate = `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}:${seconds}.${date.getMilliseconds()}`;
    strDate = `${date.getFullYear()}-${month}-${day}`;
    return {strFullDate, strDate};
  }
  
  function createTimer(minutes) {
    const timerBox = document.createElement('div');
    let times = [minutes, 00];
  
    const timer = times => {
      let tm = setInterval(() => {
        times[1]--;
        if (times[0] == 0 && times[1] == 0) {
          clearInterval(tm);
          console.log('Время вышло');
        } else if (times[1] == -1) {
          times[1] = 59;
          times[0]--;
        }
        let m = (times[0] < 10) ? '0' + times[0] : times[0],
          s = (times[1] < 10) ? '0' + times[1] : times[1];
        timerBox.textContent = showTimer(m, s);
        timerBox.classList.add('timer');
      }, 1000);
    }
  
    timer(times);
  
    const showTimer = (min, sec) => {
      return min + ':' + sec;
    }
  
    return timerBox;
  };
  
  function addModal(nameModal, title, type, textBtn, defaultValue) {
  
    let modalContentDiv = createElementWithClasses('div', ['modal-content', 'display--none']);
    let modalDiv = createElementWithClasses('div', ['modal', 'modal-input']);
    modalContentDiv.appendChild(modalDiv);
    let modalContainerDiv = createElementWithClasses('div', ['modal-container']);
    modalDiv.appendChild(modalContainerDiv);
    let modalHeaderDiv = createElementWithClasses('div', ['modal-header']);
    modalContainerDiv.appendChild(modalHeaderDiv);
    let titleH3 = createElementWithClasses('h3', []);
    titleH3.textContent = title;
    modalHeaderDiv.appendChild(titleH3);
  
    let modalBodyDiv = createElementWithClasses('div', ['modal-body']);
    modalContainerDiv.appendChild(modalBodyDiv);
  
    let timerInput = createElementWithClasses('input', ['form-input', 'form-modal-add']);
    timerInput.setAttribute('id', '#' + nameModal + type);
    timerInput.setAttribute('type', type);
    timerInput.value = defaultValue;
    modalBodyDiv.appendChild(timerInput);
  
    let containerbtnDiv = createElementWithClasses('div', ['containerBtn']);
    modalBodyDiv.appendChild(containerbtnDiv);
  
    let okButton = createElementWithClasses('button', ['btn', 'modal-btn', 'ok-timer']);
    okButton.textContent = textBtn;
    containerbtnDiv.appendChild(okButton);
  
    let cancelButton = createElementWithClasses('button', ['btn', 'modal-btn', 'cancel-timer']);
    cancelButton.textContent = 'Отменить';
    containerbtnDiv.appendChild(cancelButton);
  
    return {
      modal: modalContentDiv,
      input: timerInput
    };
  };
  
  function createModalNewBoard() {
    let modalContentDiv = createElementWithClasses('div', ['modal-content', 'display--none']);
    let modalDiv = createElementWithClasses('div', ['modal', 'modal-input', 'modal-board']);
    modalContentDiv.appendChild(modalDiv);
  
    const containerNameDiv = createElementWithClasses('div', ['container-modal']);
    modalDiv.appendChild(containerNameDiv);
    const nameLabel = createElementWithClasses('label', ['name-label', 'modal-label-board']);
    nameLabel.textContent = 'Название';
    nameLabel.setAttribute('for', 'newBoardName');
    containerNameDiv.appendChild(nameLabel);
    const nameInput = createElementWithClasses('input', ['name-input', 'modal-input-board']);
    nameInput.setAttribute('id', 'newBoardName');
    containerNameDiv.appendChild(nameInput);
  
    const containerCountDiv = createElementWithClasses('div', ['container-modal']);
    modalDiv.appendChild(containerCountDiv);
    const countLabel = createElementWithClasses('label', ['count-label', 'modal-label-board']);
    countLabel.textContent = 'Максимальное количество голосов на пользователя';
    countLabel.setAttribute('for', 'newBoardCount');
    containerCountDiv.appendChild(countLabel);
    const countInput = createElementWithClasses('input', ['count-input', 'modal-input-board']);
    countInput.setAttribute('id', 'newBoardCount');
    containerCountDiv.appendChild(countInput);
  
    const label = createElementWithClasses('label', ['modal-label-board']);
    label.textContent = 'Выбор шаблона';
    modalDiv.appendChild(label);
  
    const containerColumn = createElementWithClasses('div', ['container-column']);
    modalDiv.appendChild(containerColumn);
    const nameColumnSpan = createElementWithClasses('span', ['name-column-span']);
    nameColumnSpan.textContent = 'Столбцы';
    containerColumn.appendChild(nameColumnSpan);
  
    const columnsDiv = createElementWithClasses('div', ['container-inputs']);
    containerColumn.appendChild(columnsDiv);
    let i = 1;
    for (i; i < 4; i++) {
      createInputColumn(i, columnsDiv);
    }
  
    const btnAddColumn = createElementWithClasses('button', ['btn-add-column', 'block']);
    btnAddColumn.textContent = '+ Добавить новый';
    containerColumn.appendChild(btnAddColumn);
    btnAddColumn.addEventListener('click', (e) => {
      e.preventDefault();
      createInputColumn(i, columnsDiv);
      i++;
    })
  
  
  
    const containerbtnDiv = createElementWithClasses('div', ['containerBtn']);
    modalDiv.appendChild(containerbtnDiv);
    const okButton = createElementWithClasses('button', ['btn', 'modal-btn', 'ok']);
    okButton.textContent = 'Создать';
    containerbtnDiv.appendChild(okButton);
    const cancelButton = createElementWithClasses('button', ['btn', 'modal-btn', 'cancel']);
    cancelButton.textContent = 'Закрыть';
    containerbtnDiv.appendChild(cancelButton);
  
  
    // let columns = [];
    // let name = '';
    // okButton.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     name = nameInput.value;
    //     let listcolumns = columnsDiv.querySelectorAll('.inputNewColumn');
    //     listcolumns.forEach((column) => {
    //         columns.push(column.value);
    //     });
    // })
  
    return {
      modal: modalContentDiv,
      // columns: columns,
      // name: name
    };
  }
  
  function createInputColumn(number, parentEl) {
    const divCon = createElementWithClasses('div', []);
    parentEl.appendChild(divCon);
    divCon.setAttribute('style', 'display:flex; margin-bottom:18px;');
    const div = createElementWithClasses('div', ['container-input-column']);
    divCon.appendChild(div);
    const span = createElementWithClasses('span', []);
    span.textContent = number;
    div.appendChild(span);
    const input = createElementWithClasses('input', ['inputNewColumn', 'block']);
    input.setAttribute('type', 'text');
    div.appendChild(input);
    if (number > 1) {
      const btn = createElementWithClasses('button', ['btn-cancel-column', 'cancel']);
      btn.textContent = 'X';
      divCon.appendChild(btn);
  
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        parentEl.removeChild(divCon);
      });
    }
  }
}
