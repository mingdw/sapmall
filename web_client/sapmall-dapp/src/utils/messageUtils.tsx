import { message, notification } from 'antd';

// 消息类型
export type MessageType = 'success' | 'error' | 'warning' | 'info' | 'loading';

// 消息配置
interface MessageConfig {
  duration?: number;
  maxCount?: number;
  top?: number;
}

// 通知配置
interface NotificationConfig {
  duration?: number;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  maxCount?: number;
}

class MessageUtils {
  private static messageConfig: MessageConfig = {
    duration: 3,
    maxCount: 3,
    top: 100,
  };

  private static notificationConfig: NotificationConfig = {
    duration: 4.5,
    placement: 'topRight',
    maxCount: 3,
  };

  // 设置消息配置
  static setMessageConfig(config: MessageConfig) {
    this.messageConfig = { ...this.messageConfig, ...config };
  }

  // 设置通知配置
  static setNotificationConfig(config: NotificationConfig) {
    this.notificationConfig = { ...this.notificationConfig, ...config };
  }

  // 成功消息
  static success(content: string, duration?: number) {
    message.success(content, duration || this.messageConfig.duration);
  }

  // 错误消息
  static error(content: string, duration?: number) {
    message.error(content, duration || this.messageConfig.duration);
  }

  // 警告消息
  static warning(content: string, duration?: number) {
    message.warning(content, duration || this.messageConfig.duration);
  }

  // 信息消息
  static info(content: string, duration?: number) {
    message.info(content, duration || this.messageConfig.duration);
  }

  // 加载消息
  static loading(content: string, duration?: number) {
    return message.loading(content, duration || this.messageConfig.duration);
  }

  // 销毁所有消息
  static destroy() {
    message.destroy();
  }

  // 成功通知
  static successNotification(
    title: string, 
    description: string, 
    duration?: number
  ) {
    notification.success({
      message: title,
      description,
      duration: duration || this.notificationConfig.duration,
      placement: this.notificationConfig.placement,
    });
  }

  // 错误通知
  static errorNotification(
    title: string, 
    description: string, 
    duration?: number
  ) {
    notification.error({
      message: title,
      description,
      duration: duration || this.notificationConfig.duration,
      placement: this.notificationConfig.placement,
    });
  }

  // 警告通知
  static warningNotification(
    title: string, 
    description: string, 
    duration?: number
  ) {
    notification.warning({
      message: title,
      description,
      duration: duration || this.notificationConfig.duration,
      placement: this.notificationConfig.placement,
    });
  }

  // 信息通知
  static infoNotification(
    title: string, 
    description: string, 
    duration?: number
  ) {
    notification.info({
      message: title,
      description,
      duration: duration || this.notificationConfig.duration,
      placement: this.notificationConfig.placement,
    });
  }

  // 销毁所有通知
  static destroyNotifications() {
    notification.destroy();
  }
}

export default MessageUtils;
