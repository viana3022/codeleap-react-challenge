import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '../services/api';
import PostForm from '../components/PostForm';
import PostItem from '../components/PostItem';
import { FaSignOutAlt } from 'react-icons/fa';

function PostsPage({ username, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const loader = useRef(null);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/careers/');
      const allPosts = response.data.results || [];
      setPosts(allPosts);
      setVisiblePosts(allPosts.slice(0, pageSize));
      setPage(1);
    } catch (err) {
      console.error('Erro ao buscar posts', err);
    }
  };

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const nextSlice = posts.slice(0, nextPage * pageSize);
    setVisiblePosts(nextSlice);
    setPage(nextPage);
  }, [page, posts]);

  useEffect(() => {
    if (!loader.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );
    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loadMore]);

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="app-shell">
      <div className="content-wrapper">

        {/* Ícone de logout no topo */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button
            onClick={onLogout}
            title="Logout"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#FF4B4B',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FaSignOutAlt />
          </button>
        </div>

        <div className="card" style={{ marginBottom: 32 }}>
          <div className="card-header">CodeLeap Network</div>
          <div className="card-content">
            <PostForm username={username} onPostCreated={fetchPosts} />
          </div>
        </div>

        {visiblePosts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            currentUser={username}
            onPostUpdated={fetchPosts}
            onPostDeleted={fetchPosts}
          />
        ))}

        <div ref={loader} style={{ height: 40 }} />

        {posts.length > 0 && visiblePosts.length >= posts.length && (
          <p style={{ textAlign: 'center', color: '#475569' }}>
            No more posts to load
          </p>
        )}
      </div>
    </div>
  );
}

export default PostsPage;
