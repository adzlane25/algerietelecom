import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCheck, X } from 'lucide-react';
import './NotificationsPanel.css';

const NotificationsPanel = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, getNotificationIcon, formatTime } = useNotifications();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // توجيه حسب نوع الإشعار
    if (notification.data?.incident_id) {
      navigate(`/incidents/${notification.data.incident_id}`);
    } else if (notification.data?.task_id) {
      navigate('/my-tasks');
    } else if (notification.data?.intervention_id) {
      navigate('/interventions');
    }
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="notifications-panel"
    >
      <div className="notifications-header">
        <div className="notifications-title">
          <Bell size={18} />
          <h3>{t('notifications')}</h3>
          {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
        </div>
        <div className="notifications-actions">
          {notifications.length > 0 && (
            <button className="mark-all-btn" onClick={markAllAsRead} title={t('mark_all_read')}>
              <CheckCheck size={16} />
              <span>{t('mark_all_read')}</span>
            </button>
          )}
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <Bell size={48} />
            <p>{t('no_notifications')}</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="notification-icon">
                {getNotificationIcon(notif.type)}
              </div>
              <div className="notification-content">
                <div className="notification-title">{notif.title}</div>
                <div className="notification-message">{notif.message}</div>
                <div className="notification-time">{formatTime(notif.created_at)}</div>
              </div>
              <button 
                className="notification-delete" 
                onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                title={t('delete')}
              >
                <X size={14} />
              </button>
              {!notif.is_read && <div className="unread-dot"></div>}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default NotificationsPanel;