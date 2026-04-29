import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // أمثلة إشعارات تجريبية حسب الدور
  const getDemoNotifications = () => {
    const now = new Date();
    const oneHourAgo = new Date(now - 3600000);
    const twoHoursAgo = new Date(now - 7200000);
    const yesterday = new Date(now - 86400000);

    if (user?.role === 'admin') {
      return [
        { id: 1, type: 'incident_created', title: '📋 بلاغ جديد', message: 'تم إضافة بلاغ جديد من مؤسسة التقنية الحديثة - قسنطينة', is_read: false, created_at: now, data: { incident_id: 101 } },
        { id: 2, type: 'task_completed', title: '✔️ مهمة مكتملة', message: 'قام الفني أحمد محمد بإكمال مهمة "إصلاح عطل الشبكة"', is_read: false, created_at: oneHourAgo, data: { task_id: 5 } },
        { id: 3, type: 'incident_created', title: '📋 بلاغ جديد', message: 'تم إضافة بلاغ جديد من مؤسسة الخدمات - قسنطينة', is_read: true, created_at: twoHoursAgo, data: { incident_id: 102 } },
        { id: 4, type: 'report_generated', title: '📊 تقرير جاهز', message: 'تم إنشاء تقرير الأداء الشهري بنجاح', is_read: false, created_at: yesterday, data: { report_id: 1 } },
      ];
    }
    
    if (user?.role === 'company') {
      return [
        { id: 1, type: 'incident_approved', title: '✅ تم قبول البلاغ', message: 'تم قبول بلاغك رقم #101 وهو قيد المعالجة من قبل الفنيين', is_read: false, created_at: now, data: { incident_id: 101 } },
        { id: 2, type: 'task_started', title: '🚀 بدء المهمة', message: 'بدأ الفني أحمد محمد في معالجة بلاغك رقم #101', is_read: false, created_at: oneHourAgo, data: { incident_id: 101 } },
        { id: 3, type: 'task_completed', title: '✔️ اكتمال المهمة', message: 'تم إكمال مهمة إصلاح العطل في مؤسستك بنجاح', is_read: true, created_at: twoHoursAgo, data: { incident_id: 101 } },
      ];
    }
    
    if (user?.role === 'technician') {
      return [
        { id: 1, type: 'task_assigned', title: '📨 مهمة جديدة', message: 'تم إسناد مهمة جديدة إليك: إصلاح عطل في شبكة شركة التقنية - قسنطينة', is_read: false, created_at: now, data: { task_id: 5 } },
        { id: 2, type: 'intervention_approved', title: '👍 تم قبول التدخل', message: 'تم قبول تقرير التدخل الخاص بك لمهمة رقم #5', is_read: false, created_at: oneHourAgo, data: { intervention_id: 3 } },
        { id: 3, type: 'task_assigned', title: '📨 مهمة جديدة', message: 'تم إسناد مهمة جديدة: تركيب جهاز راوتر في مؤسسة الخدمات', is_read: true, created_at: yesterday, data: { task_id: 6 } },
      ];
    }
    
    return [];
  };

  // تحميل الإشعارات من localStorage أو استخدام الأمثلة
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`notifications_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.is_read).length);
      } else {
        const demo = getDemoNotifications();
        setNotifications(demo);
        setUnreadCount(demo.filter(n => !n.is_read).length);
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(demo));
      }
    }
  }, [user]);

  // إضافة إشعار جديد
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      is_read: false,
      created_at: new Date(),
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    if (user) {
      const saved = localStorage.getItem(`notifications_${user.id}`);
      const existing = saved ? JSON.parse(saved) : [];
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify([newNotification, ...existing]));
    }
    
    // عرض إشعار منبثق
    toast.success(`🔔 ${notification.title}`);
  };

  // تعليم إشعار كمقروء
  const markAsRead = (id) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      );
      if (user) {
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      }
      setUnreadCount(prev => prev - 1);
      return updated;
    });
  };

  // تعليم الكل كمقروء
  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, is_read: true }));
      if (user) {
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      }
      setUnreadCount(0);
      return updated;
    });
    toast.success('تم تعليم جميع الإشعارات كمقروءة');
  };

  // حذف إشعار
  const deleteNotification = (id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      if (user) {
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      }
      setUnreadCount(updated.filter(n => !n.is_read).length);
      return updated;
    });
  };

  // أيقونة الإشعار حسب النوع
  const getNotificationIcon = (type) => {
    const icons = {
      incident_created: '📋',
      incident_approved: '✅',
      incident_rejected: '❌',
      task_assigned: '📨',
      task_started: '🚀',
      task_completed: '✔️',
      intervention_approved: '👍',
      message_received: '💬',
      report_generated: '📊'
    };
    return icons[type] || '🔔';
  };

  // تنسيق الوقت
  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return d.toLocaleDateString('ar-EG');
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationIcon,
    formatTime
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};