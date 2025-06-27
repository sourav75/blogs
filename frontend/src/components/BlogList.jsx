export default function BlogList({ blogs, title }) {
  return (
    <div>
      <h2>{title}</h2>
      {blogs.length === 0 ? (
        <div>No blogs found.</div>
      ) : (
        blogs.map(blog => (
          <div key={blog.id} className="blog">
            <div><b>{blog.author}</b> ({new Date(blog.createdAt).toLocaleString()})</div>
            <div>{blog.content}</div>
          </div>
        ))
      )}
    </div>
  );
}
