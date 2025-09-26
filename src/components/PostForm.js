import React, { useState } from 'react';
import api from '../services/api';

function PostForm({ username, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      await api.post('/careers/', { username, title, content });
      setTitle('');
      setContent('');
      onPostCreated();
    } catch (err) {
      console.error('Erro ao criar post', err);
    }
  };

  const isDisabled = !title.trim() || !content.trim();

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <label>Title</label>
      <input
        type="text"
        placeholder="Hello world"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Content</label>
      <textarea
        rows={4}
        placeholder="Content here"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" disabled={isDisabled}>Create</button>
    </form>
  );
}

export default PostForm;
