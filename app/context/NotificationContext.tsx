import React, { createContext, useState, useContext } from 'react';

type NotificationContextType = {
  notificationCount: number;
  updateNotificationCount: (count: number) => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notificationCount: 0,
  updateNotificationCount: () => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  const updateNotificationCount = (count: number) => {
    setNotificationCount(count);
  };

  return (
    <NotificationContext.Provider value={{ notificationCount, updateNotificationCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);