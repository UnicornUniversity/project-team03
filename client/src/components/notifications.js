import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

const Notifications = ({ exceededValue, isAuthenticated }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Zkontroluj, zda už byla notifikace zobrazena v tomto přihlášení
    const shown = sessionStorage.getItem('notificationShown');
    if (isAuthenticated && exceededValue && !shown) {
      setIsModalVisible(true);
      sessionStorage.setItem('notificationShown', 'true');
    }
  }, [isAuthenticated, exceededValue]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Upozornění"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleOk}
    >
      <p>Byla překročena hodnota pro {exceededValue}. Zkontrolujte podmínky!</p>
    </Modal>
  );
};

export default Notifications;