import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

const Notifications = ({ exceededValue, isAuthenticated }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated && exceededValue) {
      setIsModalVisible(true);
    } else {
      setIsModalVisible(false);
    }
  }, [isAuthenticated, exceededValue]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Upozornění"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleOk}
    >
      <p>Byla překročena hodnota pro {exceededValue}. Zkontrolujte podmínky!</p>
    </Modal>
  );
};

export default Notifications;