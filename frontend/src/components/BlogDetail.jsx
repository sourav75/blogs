export default function BlogDetail({ blog }) {
  if (!blog) return null;
  return (
    <div className="blog">
      <h2>Blog ID: {blog.id}</h2>
      <div><b>{blog.author}</b> ({new Date(blog.createdAt).toLocaleString()})</div>
      <div>{blog.content}</div>
    </div>
  );
}
