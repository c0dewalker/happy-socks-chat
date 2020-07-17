const socket = io.connect('', { reconnect: false });

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
      avatar: '',
    },
    users: [],

    message: '',
    messages: [],
    room: '',
    rooms: {
      elbrus: 'data:image/png;base64,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',
      cats: 'https://avatarfiles.alphacoders.com/798/79894.jpg',
      emojis: 'https://cdn4.vectorstock.com/i/1000x1000/61/08/crazy-face-emogi-character-vector-19266108.jpg',
      tanks: 'https://avatarfiles.alphacoders.com/106/106648.jpg'
    },
    channels: {
      elbrus: 'Ельбрус',
      cats: 'Котики',
      emojis: 'Эмоджи',
      tanks: 'Танки'
    }
  },
  computed: {
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
      this.messages = []
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
