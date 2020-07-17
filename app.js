require('dotenv').config()
const express = require('express')
const path = require('path')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')
// const logger = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const axios = require('axios')

const mongoose = require('mongoose')
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })


const User = require('./models/user')
const Message = require('./models/message')


// const session = require('express-session')
// const passport = require('passport')
// const passportSession = require('passport-session')
// const MongoStore = require('connect-mongodb-session')(session)
// const facebookStrategy = require('passport-facebook').Strategy
// const localStrategy = require('passport-local').Strategy
// const passportSocketIo = require('passport.socketio')
// const bcrypt = require('bcrypt')

// const store = new MongoStore({
//   collection: 'sessions',
//   uri: process.env.DB_CONNECTION
// })

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(helmet())
app.use(compression())
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({
//   secret: 'acid cat',
//   resave: true,
//   saveUninitialized: true,
//   store
// }))


// passport.use(new localStrategy({
//   usernameField: 'email',
//   passwordField: 'password'
// },
//   async function (username, password, done) {
//     const areSame = await bcrypt.compare(password, user.password)
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!areSame) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

// passport.use(new FacebookStrategy({
//   clientID: process.env['FACEBOOK_CLIENT_ID'],
//   clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
//   callbackURL: "http://localhost:3000/auth/facebook/callback"
// },
//   function (accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

// app.get('/auth/facebook',
//   passport.authenticate('facebook'));

// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

// app.post('/login',
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     // failureFlash: true
//   })
// );

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/home', homeRouter);


const server = app.listen(process.env.PORT || 3000)

const io = require('socket.io')(server, { pingTimeout: 60000 });


// io.use(passportSocketIo.authorize({
//   cookieParser: cookieParser,       // the same middleware you registrer in express
//   key: 'connect.sid',       // the name of the cookie where express/connect stores its session_id
//   secret: 'acid cat',    // the session_secret to parse the cookie
//   store: store,        // we NEED to use a sessionstore. no memorystore please
//   success: onAuthorizeSuccess,  // *optional* callback on success - read more below
//   fail: onAuthorizeFail,     // *optional* callback on fail/error - read more below
// }));

// function onAuthorizeSuccess(data, accept) {
//   console.log('successful connection to socket.io');

//   // The accept-callback still allows us to decide whether to
//   // accept the connection or not.
//   accept(null, true);

//   // OR

//   // If you use socket.io@1.X the callback looks different
//   accept();
// }

// function onAuthorizeFail(data, message, error, accept) {
//   if (error)
//     throw new Error(message);
//   console.log('failed connection to socket.io:', message);

//   // We use this callback to log all of our failed connections.
//   accept(null, false);

//   // OR

//   // If you use socket.io@1.X the callback looks different
//   // If you don't want to accept the connection
//   if (error)
//     accept(new Error(message));
//   // this error will be sent to the user as a special error-package
//   // see: http://socket.io/docs/client-api/#socket > error-object
// }


async function createUser(name, room, gender, socketId) {
  // const avatar = await axios.get('https://randomuser.me/api/')
  // console.log(avatar.data.message)

  // const randomuser = await axios.get(`<img src="https://robohash.org/${socketId}">`)
  // const avatar = randomuser.data.results[0].picture.medium
  const avatar = `https://robohash.org/${socketId}.png`
  const newUser = new User({ name, room, socketId, avatar })
  await newUser.save()
  return newUser
}

// async function getRoomUsers(room) {
//   return users = await User.find({ room })
// }
async function deleteAllUsers() {
  return await User.deleteMany({})
}
deleteAllUsers()

io.on('connect', socket => {

  socket.on('new-user', async ({ name, room, gender }) => {
    const user = await createUser(name, room, gender, socket.id)
    socket.join(room)
    socket.emit('i-am-user', user)

    const users = await User.find({ room })
    socket.emit('usersInChannel', users)

    // const messages = await Message.mostRecent({ room })
    // socket.emit('messagesInChat', messages)

    socket.broadcast.to(room).emit('user-connected', user);
  })


  socket.on('sent-message', async (message) => {
    const user = await User.findOne({ socketId: socket.id })
    const { name, socketId, avatar, room } = user
    const newMessage = new Message({ body: message, name, socketId, avatar, room })
    await newMessage.save()
    io.in(room).emit('message-received', newMessage);
  })


  // Runs when client disconnects
  socket.on('disconnect', async () => {
    // const user = userLeave(socket.id);
    const user = await User.findOneAndDelete({ socketId: socket.id })

    if (user) {
      io.emit('user-left', user)
    }
  });

  socket.on('room-changed', async newroom => {

    const user = await User.findOne({ socketId: socket.id })

    const oldroom = user.room

    socket.leave(oldroom)
    socket.join(newroom)
    user.room = newroom

    await user.save()
    socket.emit('i-am-user', user)

    const usersOld = await User.find({ room: oldroom })
    const usersNew = await User.find({ room: newroom })

    socket.to(oldroom).emit('usersInChannel', usersOld)
    socket.emit('usersInChannel', usersNew)
    socket.broadcast.to(newroom).emit('user-connected', user);
  })

});



// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
