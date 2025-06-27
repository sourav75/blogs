import { useState, useEffect } from 'react';
import './App.css';
import { register, login, getProfile, createBlog, getBlogById, getBlogsByUser, getAllBlogs, logout } from './api';
import { socket } from './socket';
import AuthForm from './components/AuthForm';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [blogContent, setBlogContent] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState('my');
  const [searchUser, setSearchUser] = useState('');
  const [searchId, setSearchId] = useState('');
  const [singleBlog, setSingleBlog] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

  useEffect(() => {
    getProfile().then(profile => {
      if (profile && profile.message && profile.message.startsWith('Welcome')) {
        setUser(profile.message.replace('Welcome, ', '').replace('!', ''));
      } else {
        setUser(null);
      }
    });
    socket.on('new_blog', ({ blog }) => {
      setNotification(`New blog by ${blog.author}: ${blog.content}`);
      setTimeout(() => setNotification(null), 5000);
    });
    return () => socket.off('new_blog');
  }, []);

  useEffect(() => {
    // Reset to login page on refresh if not authenticated
    if (!user) {
      setBlogs([]);
      setSingleBlog(null);
      setPagination({ page: 1, limit: 10, totalPages: 1 });
    } else {
      fetchAllBlogs(1, pagination.limit); // Show all blogs by default after login
    }
  }, [user]);

  const handleAuth = async (username, password) => {
    if (authMode === 'register') {
      const res = await register(username, password);
      alert(res.message);
    } else {
      const res = await login(username, password);
      if (res.message === 'Login successful.') {
        setUser(username);
      } else {
        alert(res.message);
      }
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    const res = await createBlog(blogContent);
    if (res.blog) {
      setBlogs([res.blog, ...blogs]);
      setBlogContent('');
    } else {
      alert(res.message);
    }
  };

  const fetchMyBlogs = async () => {
    if (user) {
      const res = await getBlogsByUser(user);
      setBlogs(res);
      setViewMode('my');
    }
  };

  const fetchBlogsByUser = async () => {
    if (searchUser) {
      const res = await getBlogsByUser(searchUser);
      setBlogs(res);
      setViewMode('user');
    }
  };

  const fetchBlogById = async () => {
    if (searchId) {
      const res = await getBlogById(searchId);
      setSingleBlog(res && res.id ? res : null);
      setViewMode('id');
    }
  };

  const fetchAllBlogs = async (page = 1, limit = 10) => {
    const res = await getAllBlogs(page, limit);
    setBlogs(res.blogs);
    setPagination({ page: res.page, limit: res.limit, totalPages: res.totalPages });
    setViewMode('all');
  };

  const handleLogout = async () => {
    logout();
    setUser(null);
    setBlogs([]);
    setSingleBlog(null);
    setViewMode('my');
  };

  return (
    <div className="App">
      <header style={{ marginBottom: 32, borderBottom: '1px solid #e5e7eb', paddingBottom: 16 }}>
        <h1 style={{ margin: 0, color: '#4f46e5', fontWeight: 800, fontSize: '2.2rem' }}>Blog Platform</h1>
        {user && (
          <div style={{ marginTop: 8, fontSize: '1.1rem', color: '#6366f1' }}>
            Welcome, <b>{user}</b>!
            <button style={{ marginLeft: 16, background: '#f87171', color: '#fff' }} onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>
      {user && <Notification message={notification} />}
      <main style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {!user ? (
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <AuthForm
              mode={authMode}
              onAuth={handleAuth}
              onSwitchMode={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}
            />
          </div>
        ) : (
          <>
            <section style={{ marginBottom: 24 }}>
              <BlogForm content={blogContent} onChange={setBlogContent} onSubmit={handleCreateBlog} />
            </section>
            <section style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
              <button onClick={fetchMyBlogs}>My Blogs</button>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Username"
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                  style={{ minWidth: 120 }}
                />
                <button onClick={fetchBlogsByUser}>User's Blogs</button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="number"
                  placeholder="Blog ID"
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  style={{ minWidth: 80 }}
                />
                <button onClick={fetchBlogById}>Blog by ID</button>
              </div>
              <button onClick={fetchAllBlogs}>All Blogs</button>
            </section>
            <section>
              {viewMode === 'id' && <BlogDetail blog={singleBlog} />}
              {(viewMode === 'my' || viewMode === 'user') && (
                <BlogList blogs={blogs} title={viewMode === 'my' ? 'My Blogs' : `Blogs by ${searchUser}`} />
              )}
              {viewMode === 'all' && (
                <>
                  <BlogList blogs={blogs} title="All Blogs" />
                  {blogs.length > 0 && pagination.totalPages > 1 && (
                    <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                      <button onClick={() => fetchAllBlogs(Math.max(1, pagination.page - 1), pagination.limit)} disabled={pagination.page === 1}>Prev</button>
                      <span>Page {pagination.page} of {pagination.totalPages}</span>
                      <button onClick={() => fetchAllBlogs(Math.min(pagination.totalPages, pagination.page + 1), pagination.limit)} disabled={pagination.page === pagination.totalPages}>Next</button>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
