import React, { useState } from 'react';
import { 
    Card, 
    Switch, 
    Button, 
    message, 
    Tabs, 
    List, 
    Radio, 
    Divider, 
    Row, 
    Col, 
    Alert, 
    Space, 
    Tooltip, 
    Badge, 
    Modal,
    Form,
    Select,
    Input,
    Typography
} from 'antd';
import { 
    BellOutlined, 
    SecurityScanOutlined, 
    TransactionOutlined, 
    SettingOutlined, 
    MailOutlined, 
    MobileOutlined, 
    ChromeOutlined, 
    QuestionCircleOutlined,
    InfoCircleOutlined,
    CheckOutlined,
    EyeOutlined,
    WalletOutlined,
    WifiOutlined,
    SignalFilled,
    ThunderboltOutlined,
    LockOutlined
} from '@ant-design/icons';

import AdminContentCard from '../AdminContentCard';
import styles from './NotificationSettings.module.scss';

const { TabPane } = Tabs;
const { Text, Title } = Typography;
const { Option } = Select;

// 通知类型定义
interface NotificationItem {
    id: string;
    title: string;
    description: string;
    category: 'security' | 'transaction' | 'system';
    enabled: boolean;
    channels: {
        email: boolean;
        browser: boolean;
        mobile: boolean;
    };
    importance: 'high' | 'medium' | 'low';
    frequency?: 'immediate' | 'daily' | 'weekly';
}

const NotificationSettings: React.FC = () => {
    // 通知设置状态
    const [notifications, setNotifications] = useState<NotificationItem[]>([
        {
            id: '1',
            title: '登录提醒',
            description: '当您的账户在新设备上登录时收到通知',
            category: 'security',
            enabled: true,
            channels: { email: true, browser: true, mobile: true },
            importance: 'high'
        },
        {
            id: '2',
            title: '异常登录警报',
            description: '当检测到可疑登录活动时收到通知',
            category: 'security',
            enabled: true,
            channels: { email: true, browser: true, mobile: true },
            importance: 'high'
        },
        {
            id: '3',
            title: '安全设置变更',
            description: '当您的安全设置发生变更时收到通知',
            category: 'security',
            enabled: true,
            channels: { email: true, browser: false, mobile: true },
            importance: 'high'
        },
        {
            id: '4',
            title: '交易确认',
            description: '当您发起交易需要确认时收到通知',
            category: 'transaction',
            enabled: true,
            channels: { email: false, browser: true, mobile: true },
            importance: 'high'
        },
        {
            id: '5',
            title: '交易完成',
            description: '当您的交易完成时收到通知',
            category: 'transaction',
            enabled: true,
            channels: { email: true, browser: true, mobile: true },
            importance: 'medium'
        },
        {
            id: '6',
            title: '大额交易提醒',
            description: '当发生超过设定金额的交易时收到通知',
            category: 'transaction',
            enabled: true,
            channels: { email: true, browser: true, mobile: true },
            importance: 'high'
        },
        {
            id: '7',
            title: '系统维护',
            description: '当系统计划维护时收到通知',
            category: 'system',
            enabled: true,
            channels: { email: true, browser: true, mobile: false },
            importance: 'medium',
            frequency: 'immediate'
        },
        {
            id: '8',
            title: '新功能公告',
            description: '当平台发布新功能时收到通知',
            category: 'system',
            enabled: true,
            channels: { email: true, browser: false, mobile: false },
            importance: 'low',
            frequency: 'weekly'
        },
        {
            id: '9',
            title: '价格提醒',
            description: '当资产价格达到您设定的阈值时收到通知',
            category: 'transaction',
            enabled: false,
            channels: { email: true, browser: true, mobile: true },
            importance: 'medium',
            frequency: 'immediate'
        }
    ]);
    
    // 通知渠道状态
    const [channels, setChannels] = useState({
        email: { enabled: true, value: 'user@example.com' },
        browser: { enabled: true },
        mobile: { enabled: true, value: '+86 138****5678' }
    });
    
    // 预览模态框状态
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewType, setPreviewType] = useState<NotificationItem | null>(null);
    
    // 编辑渠道模态框状态
    const [channelModalVisible, setChannelModalVisible] = useState(false);
    const [channelForm] = Form.useForm();
    
    // 切换通知开关
    const toggleNotification = (id: string, enabled: boolean) => {
        setNotifications(
            notifications.map(item => 
                item.id === id ? { ...item, enabled } : item
            )
        );
        message.success(`${enabled ? '启用' : '禁用'}通知成功`);
    };
    
    // 切换通知渠道
    const toggleChannel = (id: string, channel: 'email' | 'browser' | 'mobile', enabled: boolean) => {
        setNotifications(
            notifications.map(item => 
                item.id === id 
                    ? { ...item, channels: { ...item.channels, [channel]: enabled } } 
                    : item
            )
        );
    };
    
    // 批量操作
    const handleBatchOperation = (category: string, operation: 'enable' | 'disable') => {
        setNotifications(
            notifications.map(item => 
                item.category === category 
                    ? { ...item, enabled: operation === 'enable' } 
                    : item
            )
        );
        message.success(`已${operation === 'enable' ? '启用' : '禁用'}所有${getCategoryName(category)}通知`);
    };
    
    // 获取分类名称
    const getCategoryName = (category: string) => {
        switch(category) {
            case 'security': return '安全';
            case 'transaction': return '交易';
            case 'system': return '系统';
            default: return '';
        }
    };
    
    // 显示通知预览
    const showPreview = (notification: NotificationItem) => {
        setPreviewType(notification);
        setPreviewVisible(true);
    };
    
    // 打开渠道设置
    const openChannelSettings = () => {
        channelForm.setFieldsValue({
            email: channels.email.value,
            emailEnabled: channels.email.enabled,
            browserEnabled: channels.browser.enabled,
            mobile: channels.mobile.value,
            mobileEnabled: channels.mobile.enabled
        });
        setChannelModalVisible(true);
    };
    
    // 保存渠道设置
    const saveChannelSettings = (values: any) => {
        setChannels({
            email: { enabled: values.emailEnabled, value: values.email },
            browser: { enabled: values.browserEnabled },
            mobile: { enabled: values.mobileEnabled, value: values.mobile }
        });
        
        // 如果某个渠道被禁用，更新所有通知的该渠道设置
        if (!values.emailEnabled || !values.browserEnabled || !values.mobileEnabled) {
            setNotifications(
                notifications.map(item => ({
                    ...item,
                    channels: {
                        email: values.emailEnabled ? item.channels.email : false,
                        browser: values.browserEnabled ? item.channels.browser : false,
                        mobile: values.mobileEnabled ? item.channels.mobile : false
                    }
                }))
            );
        }
        
        setChannelModalVisible(false);
        message.success('通知渠道设置已更新');
    };
    
    // 渲染通知列表项
    const renderNotificationItem = (item: NotificationItem) => (
        <List.Item
            key={item.id}
            actions={[
                <Button 
                    type="text" 
                    icon={<EyeOutlined />} 
                    onClick={() => showPreview(item)}
                >
                    预览
                </Button>
            ]}
            className={styles.notificationItem}
        >
            <div className={styles.notificationContent}>
                <div className={styles.notificationHeader}>
                    <div className={styles.titleWrapper}>
                        <Text strong>{item.title}</Text>
                        {item.importance === 'high' && (
                            <Badge 
                                status="error" 
                                text={<Text type="danger" className={styles.importanceBadge}>重要</Text>} 
                            />
                        )}
                    </div>
                    <Switch 
                        checked={item.enabled} 
                        onChange={(checked) => toggleNotification(item.id, checked)} 
                        size="small"
                    />
                </div>
                <div className={styles.notificationDescription}>
                    <Text type="secondary">{item.description}</Text>
                </div>
                <div className={styles.channelOptions}>
                    <Space>
                        <Tooltip title="邮件通知">
                            <Switch 
                                checkedChildren={<MailOutlined />} 
                                unCheckedChildren={<MailOutlined />} 
                                checked={item.channels.email && item.enabled && channels.email.enabled} 
                                onChange={(checked) => toggleChannel(item.id, 'email', checked)}
                                disabled={!item.enabled || !channels.email.enabled}
                                size="small"
                            />
                        </Tooltip>
                        <Tooltip title="浏览器通知">
                            <Switch 
                                checkedChildren={<ChromeOutlined />} 
                                unCheckedChildren={<ChromeOutlined />} 
                                checked={item.channels.browser && item.enabled && channels.browser.enabled} 
                                onChange={(checked) => toggleChannel(item.id, 'browser', checked)}
                                disabled={!item.enabled || !channels.browser.enabled}
                                size="small"
                            />
                        </Tooltip>
                        <Tooltip title="手机通知">
                            <Switch 
                                checkedChildren={<MobileOutlined />} 
                                unCheckedChildren={<MobileOutlined />} 
                                checked={item.channels.mobile && item.enabled && channels.mobile.enabled} 
                                onChange={(checked) => toggleChannel(item.id, 'mobile', checked)}
                                disabled={!item.enabled || !channels.mobile.enabled}
                                size="small"
                            />
                        </Tooltip>
                        {item.frequency && (
                            <Tooltip title="通知频率">
                                <Select 
                                    value={item.frequency} 
                                    style={{ width: 100 }} 
                                    size="small"
                                    disabled={!item.enabled}
                                    onChange={(value) => {
                                        setNotifications(
                                            notifications.map(n => 
                                                n.id === item.id ? { ...n, frequency: value as any } : n
                                            )
                                        );
                                    }}
                                >
                                    <Option value="immediate">实时</Option>
                                    <Option value="daily">每日</Option>
                                    <Option value="weekly">每周</Option>
                                </Select>
                            </Tooltip>
                        )}
                    </Space>
                </div>
            </div>
        </List.Item>
    );
    
    return (
        <AdminContentCard title="通知设置" icon={<BellOutlined />}>
            <div className={styles.notificationSettings}>
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Alert
                            message="通知渠道设置"
                            description={
                                <div className={styles.channelsAlert}>
                                    <div>
                                        <Space>
                                            <MailOutlined /> 邮件通知: 
                                            <Text strong>{channels.email.enabled ? channels.email.value : '未启用'}</Text>
                                        </Space>
                                    </div>
                                    <div>
                                        <Space>
                                            <ChromeOutlined /> 浏览器通知: 
                                            <Text strong>{channels.browser.enabled ? '已启用' : '未启用'}</Text>
                                        </Space>
                                    </div>
                                    <div>
                                        <Space>
                                            <MobileOutlined /> 手机通知: 
                                            <Text strong>{channels.mobile.enabled ? channels.mobile.value : '未启用'}</Text>
                                        </Space>
                                    </div>
                                    <Button 
                                        type="primary" 
                                        size="small" 
                                        onClick={openChannelSettings}
                                        className={styles.channelSettingsButton}
                                    >
                                        设置通知渠道
                                    </Button>
                                </div>
                            }
                            type="info"
                            showIcon
                            className={styles.channelsAlertContainer}
                        />
                    </Col>
                    
                    <Col span={24}>
                        <Tabs defaultActiveKey="security" className={styles.notificationTabs}>
                            <TabPane 
                                tab={
                                    <span>
                                        <SecurityScanOutlined />
                                        安全通知
                                    </span>
                                } 
                                key="security"
                            >
                                <div className={styles.tabHeader}>
                                    <div className={styles.tabTitle}>
                                        <Title level={5}>安全通知</Title>
                                        <Text type="secondary">接收账户安全相关的重要通知</Text>
                                    </div>
                                    <div className={styles.tabActions}>
                                        <Space>
                                            <Button 
                                                type="primary" 
                                                size="small"
                                                onClick={() => handleBatchOperation('security', 'enable')}
                                            >
                                                全部启用
                                            </Button>
                                            <Button 
                                                size="small"
                                                onClick={() => handleBatchOperation('security', 'disable')}
                                            >
                                                全部禁用
                                            </Button>
                                        </Space>
                                    </div>
                                </div>
                                <List
                                    dataSource={notifications.filter(item => item.category === 'security')}
                                    renderItem={renderNotificationItem}
                                    className={styles.notificationList}
                                />
                            </TabPane>
                            
                            <TabPane 
                                tab={
                                    <span>
                                        <TransactionOutlined />
                                        交易通知
                                    </span>
                                } 
                                key="transaction"
                            >
                                <div className={styles.tabHeader}>
                                    <div className={styles.tabTitle}>
                                        <Title level={5}>交易通知</Title>
                                        <Text type="secondary">接收与交易相关的通知和提醒</Text>
                                    </div>
                                    <div className={styles.tabActions}>
                                        <Space>
                                            <Button 
                                                type="primary" 
                                                size="small"
                                                onClick={() => handleBatchOperation('transaction', 'enable')}
                                            >
                                                全部启用
                                            </Button>
                                            <Button 
                                                size="small"
                                                onClick={() => handleBatchOperation('transaction', 'disable')}
                                            >
                                                全部禁用
                                            </Button>
                                        </Space>
                                    </div>
                                </div>
                                <List
                                    dataSource={notifications.filter(item => item.category === 'transaction')}
                                    renderItem={renderNotificationItem}
                                    className={styles.notificationList}
                                />
                            </TabPane>
                            
                            <TabPane 
                                tab={
                                    <span>
                                        <SettingOutlined />
                                        系统通知
                                    </span>
                                } 
                                key="system"
                            >
                                <div className={styles.tabHeader}>
                                    <div className={styles.tabTitle}>
                                        <Title level={5}>系统通知</Title>
                                        <Text type="secondary">接收系统更新、维护和新功能公告</Text>
                                    </div>
                                    <div className={styles.tabActions}>
                                        <Space>
                                            <Button 
                                                type="primary" 
                                                size="small"
                                                onClick={() => handleBatchOperation('system', 'enable')}
                                            >
                                                全部启用
                                            </Button>
                                            <Button 
                                                size="small"
                                                onClick={() => handleBatchOperation('system', 'disable')}
                                            >
                                                全部禁用
                                            </Button>
                                        </Space>
                                    </div>
                                </div>
                                <List
                                    dataSource={notifications.filter(item => item.category === 'system')}
                                    renderItem={renderNotificationItem}
                                    className={styles.notificationList}
                                />
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
                
                {/* 通知预览模态框 */}
                <Modal
                    title={
                        <div className={styles.previewModalTitle}>
                            <EyeOutlined /> 通知预览
                        </div>
                    }
                    open={previewVisible}
                    onCancel={() => setPreviewVisible(false)}
                    width={700}
                    className={styles.previewModal}
                    footer={[
                        <Button key="close" onClick={() => setPreviewVisible(false)}>
                            关闭
                        </Button>
                    ]}
                >
                    {previewType && (
                        <div className={styles.previewContainer}>
                            <Row gutter={[24, 24]}>
                                {/* 邮件通知预览 */}
                                <Col xs={24} md={12}>
                                    <div className={styles.previewCard}>
                                        <div className={styles.previewCardHeader}>
                                            <MailOutlined /> 邮件通知
                                        </div>
                                        <div className={styles.emailPreview}>
                                            <div className={styles.emailHeader}>
                                                <div className={styles.emailControls}>
                                                    <span className={styles.emailControlDot} style={{ backgroundColor: '#ff6054' }}></span>
                                                    <span className={styles.emailControlDot} style={{ backgroundColor: '#ffbd2e' }}></span>
                                                    <span className={styles.emailControlDot} style={{ backgroundColor: '#28ca41' }}></span>
                                                </div>
                                                <div className={styles.emailAddressBar}>
                                                    <div className={styles.emailAddressIcon}>
                                                        <MailOutlined />
                                                    </div>
                                                    <div className={styles.emailAddress}>wallet@example.com</div>
                                                </div>
                                            </div>
                                            <div className={styles.emailContent}>
                                                <div className={styles.emailSubject}>
                                                    <span className={styles.emailSubjectLabel}>主题:</span> 
                                                    <span className={styles.emailSubjectText}>{previewType.title} - 区块链钱包通知</span>
                                                </div>
                                                <div className={styles.emailBody}>
                                                    <div className={styles.emailLogo}>
                                                        <div className={styles.logoCircle}>
                                                            <WalletOutlined />
                                                        </div>
                                                        <div className={styles.logoText}>区块链钱包</div>
                                                    </div>
                                                    <div className={styles.emailMessage}>
                                                        <p className={styles.emailGreeting}>尊敬的用户：</p>
                                                        <p className={styles.emailParagraph}>{previewType.description}。</p>
                                                        <p className={styles.emailParagraph}>如果这不是您的操作，请立即联系我们的客服团队。</p>
                                                        <div className={styles.emailAction}>
                                                            <Button type="primary">查看详情</Button>
                                                        </div>
                                                        <p className={styles.emailSignature}>
                                                            此致，<br/>区块链钱包团队
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                
                                {/* 移动端通知预览 */}
                                <Col xs={24} md={12}>
                                    <div className={styles.previewCard}>
                                        <div className={styles.previewCardHeader}>
                                            <MobileOutlined /> 移动通知
                                        </div>
                                        <div className={styles.mobilePreview}>
                                            <div className={styles.mobileDevice}>
                                                <div className={styles.mobileNotch}></div>
                                                <div className={styles.mobileScreen}>
                                                    <div className={styles.mobileStatusBar}>
                                                        <div className={styles.mobileTime}>10:30</div>
                                                        <div className={styles.mobileStatusIcons}>
                                                            <WifiOutlined />
                                                            <SignalFilled />
                                                            <ThunderboltOutlined />
                                                        </div>
                                                    </div>
                                                    <div className={styles.mobileNotification}>
                                                        <div className={styles.mobileNotificationHeader}>
                                                            <div className={styles.appIconContainer}>
                                                                <div className={styles.appIcon}>
                                                                    <WalletOutlined />
                                                                </div>
                                                            </div>
                                                            <div className={styles.appInfo}>
                                                                <div className={styles.appName}>区块链钱包</div>
                                                                <div className={styles.notificationTime}>刚刚</div>
                                                            </div>
                                                        </div>
                                                        <div className={styles.mobileNotificationContent}>
                                                            <div className={styles.notificationTitle}>{previewType.title}</div>
                                                            <div className={styles.notificationBody}>{previewType.description}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.mobileHomeButton}></div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                
                                {/* 浏览器通知预览 */}
                                <Col xs={24}>
                                    <div className={styles.previewCard}>
                                        <div className={styles.previewCardHeader}>
                                            <ChromeOutlined /> 浏览器通知
                                        </div>
                                        <div className={styles.browserPreview}>
                                            <div className={styles.browserWindow}>
                                                <div className={styles.browserHeader}>
                                                    <div className={styles.browserControls}>
                                                        <span className={styles.browserControlDot} style={{ backgroundColor: '#ff6054' }}></span>
                                                        <span className={styles.browserControlDot} style={{ backgroundColor: '#ffbd2e' }}></span>
                                                        <span className={styles.browserControlDot} style={{ backgroundColor: '#28ca41' }}></span>
                                                    </div>
                                                    <div className={styles.browserAddressBar}>
                                                        <LockOutlined />
                                                        <span>blockchain-wallet.example.com</span>
                                                    </div>
                                                </div>
                                                <div className={styles.browserContent}>
                                                    <div className={styles.browserNotification}>
                                                        <div className={styles.browserNotificationIcon}>
                                                            <WalletOutlined />
                                                        </div>
                                                        <div className={styles.browserNotificationContent}>
                                                            <div className={styles.browserNotificationHeader}>
                                                                <div className={styles.browserNotificationTitle}>区块链钱包</div>
                                                                <div className={styles.browserNotificationClose}>×</div>
                                                            </div>
                                                            <div className={styles.browserNotificationMessage}>
                                                                <div className={styles.browserNotificationSubject}>{previewType.title}</div>
                                                                <div className={styles.browserNotificationText}>{previewType.description}</div>
                                                            </div>
                                                            <div className={styles.browserNotificationTime}>刚刚</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal>
                
                {/* 通知渠道设置模态框 */}
                <Modal
                    title="通知渠道设置"
                    open={channelModalVisible}
                    onCancel={() => setChannelModalVisible(false)}
                    footer={null}
                >
                    <Form
                        form={channelForm}
                        layout="vertical"
                        onFinish={saveChannelSettings}
                    >
                        <Form.Item>
                            <div className={styles.channelFormItem}>
                                <div className={styles.channelFormLabel}>
                                    <Text strong>邮件通知</Text>
                                </div>
                                <Form.Item name="emailEnabled" valuePropName="checked" noStyle>
                                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                                </Form.Item>
                            </div>
                            <Form.Item 
                                name="email"
                                rules={[
                                    { type: 'email', message: '请输入有效的邮箱地址' }
                                ]}
                            >
                                <Input 
                                    placeholder="请输入接收通知的邮箱" 
                                    prefix={<MailOutlined />} 
                                />
                            </Form.Item>
                        </Form.Item>
                        
                        <Form.Item>
                            <div className={styles.channelFormItem}>
                                <div className={styles.channelFormLabel}>
                                    <Text strong>浏览器通知</Text>
                                </div>
                                <Form.Item name="browserEnabled" valuePropName="checked" noStyle>
                                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                                </Form.Item>
                            </div>
                            <div className={styles.channelDescription}>
                                <Text type="secondary">
                                    启用后，您将在浏览器中收到实时通知提醒。
                                    <br />
                                    注意：需要您在浏览器中允许接收通知。
                                </Text>
                            </div>
                        </Form.Item>
                        
                        <Form.Item>
                            <div className={styles.channelFormItem}>
                                <div className={styles.channelFormLabel}>
                                    <Text strong>手机通知</Text>
                                </div>
                                <Form.Item name="mobileEnabled" valuePropName="checked" noStyle>
                                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                                </Form.Item>
                            </div>
                            <Form.Item name="mobile">
                                <Input 
                                    placeholder="请输入接收通知的手机号码" 
                                    prefix={<MobileOutlined />} 
                                />
                            </Form.Item>
                        </Form.Item>
                        
                        <div className={styles.modalFooter}>
                            <Button onClick={() => setChannelModalVisible(false)} style={{ marginRight: 8 }}>
                                取消
                            </Button>
                            <Button type="primary" htmlType="submit">
                                保存设置
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </AdminContentCard>
    );
};

export default NotificationSettings;