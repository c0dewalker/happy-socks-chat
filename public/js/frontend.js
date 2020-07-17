console.log('test');
const socket = io();


const app = new Vue({
  el: '.chat-container',
  data: {
    name: '',
    message: '',
    messages: [],
    ownMessages: [],
    connectionMessages: []
  },
  methods: {
    send() {
      this.ownMessages.push(this.message)
      socket.emit('sent-message', this.message)
      this.message = ''
    }
  },
  mounted() {

    this.name = prompt('Введи свое имя')


    socket.emit('new-user', this.name)

    socket.on('user-connected', message => {
      this.messages.push(message);
    })

    socket.on('message-received', message => {
      console.log(message)
      this.messages.push(message);
    })


    // socket.on('connect', socket => {
    //   

    //   // handle the event sent with socket.send()
    //   socket.on('received-message', message => {
    //     this.messages.push(message);
    //   })

    // })

    // const socket = io();

    // socket.on('connect', () => {
    //   // either with send()
    //   socket.send('Hello!');

    //   // or with emit() and custom event names
    //   socket.emit('salutations', 'Hello!', { 'mr': 'john' }, Uint8Array.from([1, 2, 3, 4]));
    // });

    // // handle the event sent with socket.send()
    // socket.on('message', data => {
    //   console.log(data);
    // });

    // // handle the event sent with socket.emit()
    // socket.on('greetings', (elem1, elem2, elem3) => {
    //   console.log(elem1, elem2, elem3);
    // });


    // const socket = new WebSocket('ws://localhost:3030');

    // socket.onopen = function (e) {
    //   console.log("[open] Соединение установлено");
    //   console.log("Отправляем данные на сервер");
    //   socket.send("Меня зовут Джон");
    // };

    // socket.onmessage = function (event) {
    //   console.log(event.data);
    // };

    // отправка сообщения из формы
    // document.forms.publish.onsubmit = function () {
    //   let outgoingMessage = this.message.value;

    //   socket.send(outgoingMessage);
    //   return false;
    // };

    // // получение сообщения - отобразить данные в div#messages
    // socket.onmessage = function (event) {
    //   let message = event.data;

    //   let messageElem = document.createElement('div');
    //   messageElem.textContent = message;
    //   document.getElementById('messages').prepend(messageElem);
  }
})
