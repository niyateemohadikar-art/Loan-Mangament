import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../store/store';
import { notificationAPI } from '../services/api';
import { HiOutlineBell, HiOutlineCheckCircle, HiOutlineExclamation, HiOutlineCurrencyRupee, HiOutlineDocumentText } from 'react-icons/hi';

const iconMap = {
  loan_approved: HiOutlineCheckCircle,
  loan_rejected: HiOutlineExclamation,
  payment_success: HiOutlineCurrencyRupee,
  emi_reminder: HiOutlineBell,
  general: HiOutlineDocumentText,
  warning: HiOutlineExclamation,
};

const colorMap = {
  loan_approved: 'text-success-400 bg-success-500/10',
  loan_rejected: 'text-danger-400 bg-danger-500/10',
  payment_success: 'text-primary-400 bg-primary-500/10',
  emi_reminder: 'text-warning-400 bg-warning-500/10',
  general: 'text-accent-400 bg-accent-500/10',
  warning: 'text-danger-400 bg-danger-500/10',
};

const Notifications = () => {
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector(state => state.notifications);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchNotifications()).finally(() => setLoading(false));
  }, [dispatch]);

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      dispatch(fetchNotifications());
    } catch (err) { console.error(err); }
  };

  const markRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      dispatch(fetchNotifications());
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-outline text-xs">Mark all as read</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="glass-card-static p-12 text-center">
          <HiOutlineBell className="text-5xl text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(notif => {
            const Icon = iconMap[notif.type] || HiOutlineBell;
            const colors = colorMap[notif.type] || 'text-slate-400 bg-white/5';
            return (
              <div key={notif.id} onClick={() => !notif.is_read && markRead(notif.id)}
                className={`glass-card p-4 flex items-start gap-4 cursor-pointer ${!notif.is_read ? 'border-l-4 border-primary-500' : 'opacity-70'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors}`}>
                  <Icon className="text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${!notif.is_read ? 'text-white' : 'text-slate-400'}`}>{notif.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                  <p className="text-[10px] text-slate-600 mt-2">{new Date(notif.created_at).toLocaleString('en-IN')}</p>
                </div>
                {!notif.is_read && <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
