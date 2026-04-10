// frontend/src/pages/AdminPage.js

import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState('users');

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  // GET USERS
  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // GET POSTS
  const fetchPosts = async () => {
    try {
      const res = await API.get('/admin/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  // TOGGLE USER STATUS
  const toggleStatus = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/status`);

      setUsers(users.map(u =>
        u._id === id ? data.user : u
      ));
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  // REMOVE POST
  const removePost = async (id) => {
    try {
      await API.put(`/admin/posts/${id}/remove`);

      setPosts(posts.map(p =>
        p._id === id ? { ...p, status: 'removed' } : p
      ));
    } catch (err) {
      console.error('Error removing post:', err);
    }
  };

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>

      <div className="admin-tabs">
        <button
          onClick={() => setTab('users')}
          className={tab === 'users' ? 'active' : ''}
        >
          Members ({users.length})
        </button>

        <button
          onClick={() => setTab('posts')}
          className={tab === 'posts' ? 'active' : ''}
        >
          All Posts ({posts.length})
        </button>
      </div>

      {/* USERS TAB */}
      {tab === 'users' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>

                <td>
                  <span className={`status-badge ${u.status}`}>
                    {u.status}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => toggleStatus(u._id)}
                    className={
                      u.status === 'active'
                        ? 'btn-danger'
                        : 'btn-success'
                    }
                  >
                    {u.status === 'active'
                      ? 'Deactivate'
                      : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* POSTS TAB */}
      {tab === 'posts' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {posts.map(p => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.author?.name}</td>

                <td>
                  <span className={`status-badge ${p.status}`}>
                    {p.status}
                  </span>
                </td>

                <td>
                  {p.status === 'published' && (
                    <button
                      className="btn-danger"
                      onClick={() => removePost(p._id)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;