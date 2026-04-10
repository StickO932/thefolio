// frontend/src/pages/PostPage.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const PostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          API.get(`/api/posts/${id}`),
          API.get(`/api/comments/${id}`),
        ]);

        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        setError('Post not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✅ ADD COMMENT
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    try {
      const { data } = await API.post(`/api/comments/${id}`, {
        body: commentBody,
      });

      setComments([...comments, data]);
      setCommentBody('');
    } catch (err) {
      alert(
        err.response?.data?.message ||
        'Failed to add comment'
      );
    }
  };

  // ✅ DELETE COMMENT
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await API.delete(`/api/comments/${commentId}`);

      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      alert(
        err.response?.data?.message ||
        'Failed to delete comment'
      );
    }
  };

  // ✅ DELETE POST
  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await API.delete(`/api/posts/${id}`);
      navigate('/home');
    } catch (err) {
      alert(
        err.response?.data?.message ||
        'Failed to delete post'
      );
    }
  };

  // ✅ STATES
  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (!post) return <p>Post not found.</p>;

  const isOwner = user && post.author && user._id === post.author._id;
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="post-page">

      {post.image && (
        <img
          src={`http://localhost:5000/uploads/${post.image}`}
          alt={post.title}
          className="post-image"
        />
      )}

      <h1>{post.title}</h1>

      <small>
        By {post.author?.name} ·{' '}
        {new Date(post.createdAt).toLocaleDateString()}
      </small>

      {(isOwner || isAdmin) && (
        <div className="post-actions">
          <Link to={`/edit-post/${post._id}`} className="btn-edit">
            Edit
          </Link>

          <button onClick={handleDeletePost} className="btn-danger">
            Delete
          </button>
        </div>
      )}

      <div className="post-body">
        {post.body.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* COMMENTS */}
      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>

        {comments.map(comment => (
          <div key={comment._id} className="comment">
            <div className="comment-header">
              <strong>{comment.author?.name}</strong>
              <small>
                {new Date(comment.createdAt).toLocaleDateString()}
              </small>

              {user && (comment.author?._id === user._id || isAdmin) && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="btn-sm-danger"
                >
                  Delete
                </button>
              )}
            </div>

            <p>{comment.body}</p>
          </div>
        ))}

        {user ? (
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              placeholder="Write a comment..."
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              rows={3}
              required
            />

            <button type="submit">Post Comment</button>
          </form>
        ) : (
          <p>
            <Link to="/login">Login</Link> to leave a comment.
          </p>
        )}
      </div>
    </div>
  );
};

export default PostPage;