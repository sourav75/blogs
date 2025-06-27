export default function BlogForm({ content, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <textarea
        placeholder="Write your blog post..."
        value={content}
        onChange={e => onChange(e.target.value)}
        required
        rows={10}
        style={{ minHeight: 180, fontSize: '1.08rem', padding: '1rem', borderRadius: 10, resize: 'vertical' }}
      />
      <button type="submit">Create Blog</button>
    </form>
  );
}
