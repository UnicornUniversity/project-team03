import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

const Notifications = ({ exceededValue }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (exceededValue) {
      setIsModalVisible(true);
    }
  }, [exceededValue]);

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