"use client"
import React, { useEffect } from 'react';
import { useNotification } from '@/app/notifications-context';
import Toast03 from './toast-03';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        removeNotification(notifications[0].id);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notifications, removeNotification]);

  return (
    <div className="fixed bottom-0 right-0 m-4 space-y-2">
      {notifications.map((notification) => (
        <Toast03
          key={notification.id}
          open={true}
          setOpen={() => removeNotification(notification.id)}
          type={notification.type}
        >
          {notification.message}
        </Toast03>
      ))}
    </div>
  );
};

export default NotificationContainer;
