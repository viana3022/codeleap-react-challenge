import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaEdit, FaHeart } from 'react-icons/fa';
import api from '../services/api';

function PostItem({ post, currentUser, onPostUpdated, onPostDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  // ===== Likes com toggle e persistência local =====
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('likes');
      const saved = raw ? JSON.parse(raw) : {};
      const entry = saved?.[post.id];

      if (entry && typeof entry.count === 'number') {
        setLikes(entry.count);
        setUserLiked(entry.users?.includes(currentUser) || false);
      }
    } catch {
      setLikes(0);
      setUserLiked(false);
    }
  }, [post.id, currentUser]);

  const persistLikes = (count, users) => {
    try {
      const raw = localStorage.getItem('likes');
      const saved = raw ? JSON.parse(raw) : {};
      saved[post.id] = { count, users };
      localStorage.setItem('likes', JSON.stringify(saved));
    } catch {
      // ignora falhas silenciosamente
    }
  };

  const handleLike = () => {
    setLikes((prev) => {
      const raw = localStorage.getItem('likes');
      const saved = raw ? JSON.parse(raw) : {};
      const entry = saved[post.id] || { count: 0, users: [] };
      const currentUsers = Array.isArray(entry.users) ? entry.users : [];

      let nextCount;
      let nextUsers;

      if (userLiked) {
        nextUsers = currentUsers.filter((u) => u !== currentUser);
        nextCount = Math.max(prev - 1, 0);
      } else {
        nextUsers = [...currentUsers, currentUser];
        nextCount = prev + 1;
      }

      persistLikes(nextCount, nextUsers);
      setUserLiked(!userLiked);
      return nextCount;
    });
  };

  // ===== CRUD =====
  const handleUpdate = async () => {
    try {
      await api.patch(`/careers/${post.id}/`, { title, content });
      setIsEditing(false);
      onPostUpdated();
    } catch (err) {
      console.error('Erro ao atualizar post', err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/careers/${post.id}/`);
      setIsDeleting(false);
      onPostDeleted();
    } catch (err) {
      console.error('Erro ao deletar post', err);
    }
  };

  const canEdit =
    (post.username || '').trim().toLowerCase() ===
    (currentUser || '').trim().toLowerCase();

  // Tempo decorrido
  function timeSince(dateString) {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    if (!Number.isFinite(seconds) || seconds < 0) return 'just now';

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const i of intervals) {
      const count = Math.floor(seconds / i.seconds);
      if (count >= 1) return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
    }
    return 'just now';
  }

  return (
    <div className="card post">
      <div className="card-header">
        {post.title}
        {canEdit && (
          <div className="actions">
            <button
              className="delete"
              onClick={() => setIsDeleting(true)}
              title="Delete"
            >
              <FaTrashAlt size={18} />
            </button>
            <button
              className="edit"
              onClick={() => setIsEditing(true)}
              title="Edit"
            >
              <FaEdit size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="card-content">
        <div className="post-meta">
          <span>@{post.username}</span>
          <span>{timeSince(post.created_datetime)}</span>
        </div>

        <p style={{ marginTop: 0, whiteSpace: 'pre-wrap' }}>{post.content}</p>

        {/* Likes com toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 12,
            gap: 8,
          }}
        >
          <button
            onClick={handleLike}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: 'red', 
              fontSize: 20,
            }}
            title={userLiked ? 'Unlike' : 'Like'}
          >
            <FaHeart />
          </button>
          <span style={{ color: 'var(--muted)', fontWeight: 600 }}>
            {likes}
          </span>
        </div>
      </div>

      {/* Modal Edit */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit item</h2>
            <div className="post-form">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Content</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="cancel"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="save"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {isDeleting && (
        <div className="modal-overlay" onClick={() => setIsDeleting(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Are you sure you want to delete this item?</h2>
            <div className="modal-actions">
              <button
                type="button"
                className="cancel"
                onClick={() => setIsDeleting(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostItem;

