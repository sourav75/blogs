// In-memory blog store (for demo only)
let blogIdCounter = 1;
// Map: username -> Map of blogId -> blog object
const blogsByUser = new Map();

exports.createBlog = (req, res, io) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Content is required.' });
  }
  const blog = {
    id: blogIdCounter++,
    author: req.session.user,
    content,
    createdAt: new Date()
  };
  if (!blogsByUser.has(blog.author)) {
    blogsByUser.set(blog.author, new Map());
  }
  blogsByUser.get(blog.author).set(blog.id, blog);
  // Emit real-time notification to all connected clients
  if (io) {
    io.emit('new_blog', { blog });
  }
  res.status(201).json({ message: 'Blog post created.', blog });
};

exports.getBlogById = (req, res) => {
  const blogId = parseInt(req.params.id, 10);
  for (const userBlogs of blogsByUser.values()) {
    if (userBlogs.has(blogId)) {
      return res.json(userBlogs.get(blogId));
    }
  }
  return res.status(404).json({ message: 'Blog not found.' });
};

exports.getBlogsByUser = (req, res) => {
  const username = req.params.username;
  const userBlogs = blogsByUser.get(username);
  if (!userBlogs) {
    return res.json([]);
  }
  res.json(Array.from(userBlogs.values()));
};

exports.getAllBlogs = (req, res) => {
  const allBlogs = [];
  for (const userBlogs of blogsByUser.values()) {
    allBlogs.push(...userBlogs.values());
  }
  allBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(allBlogs);
};
