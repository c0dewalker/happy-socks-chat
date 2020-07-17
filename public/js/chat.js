const socket = io();

const { name, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const app = new Vue({
  el: '#chat-container',
  data: {
    user: {
      name: '',
      room: '',
      socketId: '',
      joinedAt: '',
      leftAt: '',
      avatar: 'https://static.turbosquid.com/Preview/001214/650/2V/boy-cartoon-3D-model_D.jpg',
    },
    users: [],

    message: '',
    messages: [],
    room: '',
    channels: {
      elbrus: 'Ельбрус',
      cats: 'Котики',
      emojis: 'Эмоджи',
      tanks: 'Танки'
    }
  },
  computed: {
    ownMessage() {
    }
  },
  methods: {
    send() {
      socket.emit('sent-message', this.message)
      this.message = ''
    },
    channel() {
      socket.emit('room-changed', this.room)
    }
  },

  mounted() {

    socket.emit('new-user', { name, room })

    socket.on('i-am-user', user => {
      this.user = user
      this.room = user.room

    })

    socket.on('usersInChannel', users => {
      this.users = users
    })

    socket.on('messagesInChat', messages => {
      this.messages = messages
    })


    socket.on('user-connected', user => {
      this.users.push(user);
    })

    socket.on('user-left', user => {
      this.users = this.users.filter(chatuser => chatuser.socketId !== user.socketId)
    })

    socket.on('message-received', message => {
      this.messages.push(message);
    })
  }
})
