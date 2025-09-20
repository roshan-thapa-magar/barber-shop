const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Create Socket.IO server
  const io = new Server(httpServer, {
    cors: {
      origin: dev ? ["http://localhost:3000", "http://localhost:3001"] : process.env.NEXT_PUBLIC_APP_URL,
      methods: ["GET", "POST"]
    },
    path: "/socket.io/"
  });

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('appointment:created', (data) => {
      // Broadcast to all clients
      io.emit('appointment:update', data);
    });

    socket.on('appointment:updated', (data) => {
      // Broadcast appointment update to all clients
      io.emit('appointment:update', data);
    });

    socket.on('appointment:deleted', (data) => {
      // Broadcast appointment deletion to all clients
      io.emit('appointment:deleted', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Make io available globally for API routes
  global.io = io;

  // Start server
  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Socket.IO server running on port ${port}`);
  });
});
