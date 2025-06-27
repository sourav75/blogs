const express = require('express');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Match your React app's URL/port
    methods: ['GET', 'POST'],
    credentials: true
  }
});
const PORT = process.env.PORT || 3000;
const userController = require('./controller/userController');
const blogController = require('./controller/blogController');

app.use(cors({
  origin: 'http://localhost:5173', // Change to your React app's URL/port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/register', userController.register);
app.post('/login', userController.login);
app.get('/profile', userController.profile);

// Real-time: pass io to blogController
app.post('/blogs', (req, res) => blogController.createBlog(req, res, io));
app.get('/blogs/:id', blogController.getBlogById);
app.get('/users/:username/blogs', blogController.getBlogsByUser);
app.get('/blogs', blogController.getAllBlogs);
app.post('/logout', userController.logout);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
