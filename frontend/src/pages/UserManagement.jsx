import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { HiOutlineUsers, HiOutlineShieldCheck, HiOutlineBan } from 'react-icons/hi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await adminAPI.getAllUsers();
        setUsers(data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, []);

  const handleUpdateRole = async (id, role) => {
    try {
      await adminAPI.updateUserRole(id, { role });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    } catch (err) { alert('Failed to update role'); }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await adminAPI.updateUserRole(id, { is_active: !isActive });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !isActive } : u));
    } catch (err) { alert('Failed to update status'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  const borrowers = users.filter(u => u.role === 'borrower');
  const officers = users.filter(u => u.role === 'loan_officer');
  const admins = users.filter(u => u.role === 'admin');

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
      <p className="text-slate-400 text-sm mb-8">Manage all system users and their roles</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-primary-400">{borrowers.length}</p>
          <p className="text-xs text-slate-400">Borrowers</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-accent-400">{officers.length}</p>
          <p className="text-xs text-slate-400">Loan Officers</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-success-400">{admins.length}</p>
          <p className="text-xs text-slate-400">Admins</p>
        </div>
      </div>

      <div className="glass-card-static p-6">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="font-mono text-primary-400">#{u.id}</td>
                  <td className="text-white font-medium">{u.name}</td>
                  <td className="text-slate-400 text-xs">{u.email}</td>
                  <td>
                    <select className="text-xs bg-transparent border border-slate-600 rounded-lg px-2 py-1 text-slate-300"
                      value={u.role} onChange={(e) => handleUpdateRole(u.id, e.target.value)}>
                      <option value="borrower">Borrower</option>
                      <option value="loan_officer">Loan Officer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${u.is_active ? 'badge-approved' : 'badge-rejected'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                  <td>
                    <button onClick={() => handleToggleActive(u.id, u.is_active)}
                      className={`text-xs px-3 py-1 rounded-lg ${u.is_active ? 'text-danger-400 hover:bg-danger-500/10' : 'text-success-400 hover:bg-success-500/10'}`}>
                      {u.is_active ? <><HiOutlineBan className="inline" /> Deactivate</> : <><HiOutlineShieldCheck className="inline" /> Activate</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
