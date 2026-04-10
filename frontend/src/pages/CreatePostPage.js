// frontend/src/pages/CreatePostPage.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);

    try {
      // ✅ FIXED: removed duplicate /api
      const { data } = await API.post('/posts', fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Created post:", data);

      // Redirect to post page
      navigate(`/posts/${data._id}`);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        'Failed to publish post'
      );
    }
  };

  return (
    <div className="create-post-page">
      <h2>Write a New Post</h2>

      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          required
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your post here..."
          rows={12}
          required
        />

        {user?.role === 'admin' && (
          <div>
            <label>Upload Cover Image (Admin only):</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
        )}

        <button type="submit">Publish Post</button>
      </form>
    </div>
  );
};

export default CreatePostPage;