export default function BlogForm({ content, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <textarea
        placeholder="Write your blog post..."
        value={content}
        onChange={e => onChange(e.target.value)}
        required
      />
      <button type="submit">Create Blog</button>
    </form>
  );
}
