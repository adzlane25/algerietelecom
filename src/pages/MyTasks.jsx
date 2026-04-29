import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalTheme } from '../contexts/GlobalThemeContext';
import { useTranslation } from 'react-i18next';
import { ClipboardList, CheckCircle, Clock, AlertCircle, Printer, Play, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const MyTasks = () => {
  const { api, isTechnician, isAdmin } = useAuth();
  const { neonPrimary } = useGlobalTheme();
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/my-tasks');
      setTasks(response.data.data || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error(t('error_loading_data'));
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      if (newStatus === 'in_progress') toast.success('✅ تم بدء المهمة');
      else if (newStatus === 'completed') toast.success('✅ تم إكمال المهمة');
      fetchTasks();
    } catch (error) {
      toast.error('❌ فشل التحديث');
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle size={18} color="#10b981" />;
    if (status === 'in_progress') return <Clock size={18} color="#3b82f6" />;
    return <AlertCircle size={18} color="#f59e0b" />;
  };

  const getStatusText = (status) => {
    if (status === 'completed') return t('completed');
    if (status === 'in_progress') return t('in_progress');
    return t('pending');
  };

  const getPriorityBadge = (priority) => {
    if (priority === 'high') return <span className="badge-urgent">{t('priority_high')}</span>;
    if (priority === 'medium') return <span className="badge-high">{t('priority_medium')}</span>;
    return <span className="badge-medium">{t('priority_low')}</span>;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    let tableRows = '';
    tasks.forEach((task, idx) => {
      if (isTechnician()) {
        tableRows += `<tr><td style="text-align:center">${idx + 1}</td><td>${task.title}</td><td>${getStatusText(task.status)}</td><td>${task.priority === 'high' ? 'مرتفعة' : task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}</td><td>${task.company_name || '-'}</td><td dir="ltr">${formatDate(task.due_date)}</td></tr>`;
      } else {
        tableRows += `<tr><td style="text-align:center">${idx + 1}</td><td>${task.title}</td><td>${getStatusText(task.status)}</td><td>${task.priority === 'high' ? 'مرتفعة' : task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}</td><td>${task.technician_name || '-'}</td><td dir="ltr">${formatDate(task.due_date)}</td></tr>`;
      }
    });
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head><meta charset="UTF-8"><title>تقرير المهام - اتصالات الجزائر</title>
        <style>
          body { font-family: 'Cairo', sans-serif; padding: 40px; background: white; direction: rtl; }
          .header { text-align: center; margin-bottom: 30px; }
          h2 { color: #006633; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: right; }
          th { background: #f5f5f5; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; }
        </style>
        </head>
        <body>
          <div class="header"><h2>اتصالات الجزائر - قسنطينة</h2><h3>تقرير المهام</h3><p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}</p></div>
          <table><thead><tr><th>#</th><th>المهمة</th><th>الحالة</th><th>الأولوية</th><th>${isTechnician() ? 'الشركة' : 'الفني'}</th><th>تاريخ الاستحقاق</th></tr></thead><tbody>${tableRows}</tbody></table>
          <div class="footer">تم الطباعة من نظام اتصالات الجزائر - قسنطينة</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>{t('loading')}</p></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
            <ClipboardList size={28} style={{ color: neonPrimary }} /> {t('my_tasks')}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>{isTechnician() ? t('tasks_assigned_to_you') : t('all_tasks')}</p>
        </div>
        <button className="btn-outline" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '40px' }}>
          <Printer size={18} /> {t('print')}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-surface)', borderRadius: '24px' }}>
          <ClipboardList size={64} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <p>{t('no_tasks_assigned')}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t('task_title')}</th>
                {isTechnician() ? <th>{t('company')}</th> : <th>{t('technician')}</th>}
                <th>{t('status')}</th>
                <th>{t('priority')}</th>
                <th>{t('due_date')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, idx) => (
                <tr key={task.id}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 500 }}>{task.title}</td>
                  <td>{isTechnician() ? (task.company_name || '-') : (task.technician_name || '-')}</td>
                  <td><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{getStatusIcon(task.status)} {getStatusText(task.status)}</span></td>
                  <td>{getPriorityBadge(task.priority)}</td>
                  <td dir="ltr">{formatDate(task.due_date)}</td>
                  <td>
                    {isTechnician() && task.status === 'pending' && (
                      <button className="btn-primary" style={{ padding: '6px 16px', borderRadius: '30px', fontSize: '12px', background: '#3b82f6' }} onClick={() => updateTaskStatus(task.id, 'in_progress')}>
                        <Play size={14} /> {t('start_work')}
                      </button>
                    )}
                    {isTechnician() && task.status === 'in_progress' && (
                      <button className="btn-primary" style={{ padding: '6px 16px', borderRadius: '30px', fontSize: '12px', background: '#10b981' }} onClick={() => updateTaskStatus(task.id, 'completed')}>
                        <Check size={14} /> {t('complete_task')}
                      </button>
                    )}
                    {isTechnician() && task.status === 'completed' && (
                      <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> {t('completed')}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default MyTasks;