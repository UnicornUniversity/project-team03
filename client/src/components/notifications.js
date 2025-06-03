import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

const Notifications = ({ exceededValue, isAuthenticated }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (isAuthenticated && exceededValue && !hasShown) {
      setIsModalVisible(true);
      setHasShown(true);
    }
  }, [isAuthenticated, exceededValue, hasShown]);

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