import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Button, 
    Form, 
    Input, 
    Switch, 
    Divider, 
    Progress, 
    Steps, 
    Modal, 
    message, 
    Tooltip, 
    Row, 
    Col,
    Alert,
    Table,
    Tag,
    Space,
    Popconfirm,
    List,
    Typography,
    Radio
} from 'antd';
import { 
    LockOutlined, 
    SafetyCertificateOutlined, 
    MobileOutlined, 
    MailOutlined, 
    KeyOutlined, 
    QuestionCircleOutlined,
    IeOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    DesktopOutlined,
    HistoryOutlined,
    ExclamationCircleOutlined,
    WalletOutlined,
    DisconnectOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import AdminContentCard from '../AdminContentCard';
import styles from './SecuritySettings.module.scss';

const { Text, Paragraph } = Typography;

// 模拟已连接设备数据
const connectedDevices = [
    {
        id: '1',
        name: 'Chrome - Windows',
        ip: '192.168.1.1',
        lastActive: '2023-07-15 14:30:22',
        current: true
    },
    {
        id: '2',
        name: 'Safari - MacOS',
        ip: '172.16.0.5',
        lastActive: '2023-07-10 09:15:43',
        current: false
    },
    {
        id: '3',
        name: 'Firefox - Ubuntu',
        ip: '10.0.0.8',
        lastActive: '2023-06-28 18:22:10',
        current: false
    }
];

// 模拟授权应用数据
const authorizedApps = [
    {
        id: '1',
        name: 'DEX Exchange',
        permissions: ['读取地址', '发起交易'],
        lastUsed: '2023-07-15 10:20:15'
    },
    {
        id: '2',
        name: 'NFT Marketplace',
        permissions: ['读取地址', '发起交易', '签名消息'],
        lastUsed: '2023-07-12 16:45:30'
    },
    {
        id: '3',
        name: 'Yield Farming App',
        permissions: ['读取地址'],
        lastUsed: '2023-06-30 08:10:05'
    }
];

// 模拟活动记录
const activityLogs = [
    {
        id: '1',
        type: '钱包连接',
        details: '新设备连接钱包',
        ip: '192.168.1.1',
        time: '2023-07-15 14:30:22',
        status: 'success'
    },
    {
        id: '2',
        type: '交易签名',
        details: '向0x1a2b...3c4d转账0.5 ETH',
        ip: '192.168.1.1',
        time: '2023-07-15 14:35:10',
        status: 'success'
    },
    {
        id: '3',
        type: '授权应用',
        details: '授权DEX Exchange应用',
        ip: '192.168.1.1',
        time: '2023-07-15 14:40:05',
        status: 'success'
    },
    {
        id: '4',
        type: '交易签名',
        details: '智能合约调用失败',
        ip: '172.16.0.5',
        time: '2023-07-10 09:20:18',
        status: 'failed'
    }
];

const SecuritySettings: React.FC = () => {
    // 安全评分状态
    const [securityScore, setSecurityScore] = useState(65);
    
    // 各项安全设置状态
    const [securityState, setSecurityState] = useState({
        transactionConfirmation: true,
        highValueAlert: true,
        contractInteractionWarning: true,
        phishingProtection: false,
        activityNotifications: true,
        autoLock: true,
        addressWhitelist: false
    });
    
    // 模态框状态
    const [whitelistModal, setWhitelistModal] = useState(false);
    const [emergencyModal, setEmergencyModal] = useState(false);
    const [recoveryModal, setRecoveryModal] = useState(false);
    
    // 白名单地址
    const [whitelistAddresses, setWhitelistAddresses] = useState([
        { id: '1', address: '0x1a2b3c4d5e6f7g8h9i0j', label: '个人储蓄钱包' },
        { id: '2', address: '0xabcdef1234567890abcdef', label: '交易所账户' }
    ]);
    const [newAddress, setNewAddress] = useState({ address: '', label: '' });
    
    // 计算安全评分
    useEffect(() => {
        let score = 40; // 基础分数
        
        if (securityState.transactionConfirmation) score += 10;
        if (securityState.highValueAlert) score += 10;
        if (securityState.contractInteractionWarning) score += 10;
        if (securityState.phishingProtection) score += 10;
        if (securityState.activityNotifications) score += 5;
        if (securityState.autoLock) score += 5;
        if (securityState.addressWhitelist) score += 10;
        
        setSecurityScore(score);
    }, [securityState]);
    
    // 切换安全设置
    const toggleSetting = (setting: string, value: boolean) => {
        setSecurityState({
            ...securityState,
            [setting]: value
        });
        message.success(`${value ? '启用' : '禁用'}成功`);
    };
    
    // 添加白名单地址
    const addWhitelistAddress = () => {
        if (!newAddress.address || !newAddress.label) {
            message.error('请输入完整的地址信息');
            return;
        }
        
        const id = Date.now().toString();
        setWhitelistAddresses([...whitelistAddresses, { id, ...newAddress }]);
        setNewAddress({ address: '', label: '' });
        message.success('地址已添加到白名单');
    };
    
    // 删除白名单地址
    const removeWhitelistAddress = (id: string) => {
        setWhitelistAddresses(whitelistAddresses.filter(item => item.id !== id));
        message.success('地址已从白名单移除');
    };
    
    // 断开设备连接
    const disconnectDevice = (id: string) => {
        message.success('设备已断开连接');
    };
    
    // 撤销应用授权
    const revokeAppAuthorization = (id: string) => {
        message.success('已撤销应用授权');
    };
    
    // 执行紧急冻结
    const executeEmergencyFreeze = () => {
        message.success('账户已紧急冻结，请联系客服解冻');
        setEmergencyModal(false);
    };
    
    // 设置恢复选项
    const setupRecoveryOption = () => {
        message.success('账户恢复选项已设置');
        setRecoveryModal(false);
    };
    
    // 获取安全评分的状态
    const getScoreStatus = () => {
        if (securityScore < 50) return 'exception';
        if (securityScore < 80) return 'normal';
        return 'success';
    };
    
    // 设备列表列定义
    const deviceColumns = [
        {
            title: '设备信息',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <span>
                    {text} {record.current && <Tag color="green">当前设备</Tag>}
                </span>
            )
        },
        {
            title: 'IP地址',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: '最后活动时间',
            dataIndex: 'lastActive',
            key: 'lastActive',
        },
        {
            title: '操作',
            key: 'action',
            render: (text: string, record: any) => (
                <Space>
                    {!record.current && (
                        <Button 
                            type="link" 
                            danger 
                            onClick={() => disconnectDevice(record.id)}
                            icon={<DisconnectOutlined />}
                        >
                            断开连接
                        </Button>
                    )}
                </Space>
            )
        }
    ];
    
    // 活动记录列定义
    const activityColumns = [
        {
            title: '活动类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '详情',
            dataIndex: 'details',
            key: 'details',
            width: '30%'
        },
        {
            title: 'IP地址',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: '时间',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'success' ? 'green' : 'red'}>
                    {status === 'success' ? '成功' : '失败'}
                </Tag>
            )
        }
    ];

    return (
        <AdminContentCard title="安全设置" icon={<IeOutlined />}>
            <div className={styles.securitySettings}>
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Card className={styles.scoreCard}>
                            <div className={styles.scoreHeader}>
                                <h3>钱包安全评分</h3>
                                <Tooltip title="安全评分是根据您已启用的安全功能计算的">
                                    <QuestionCircleOutlined />
                                </Tooltip>
                            </div>
                            <div className={styles.scoreContent}>
                                <Progress 
                                    type="circle" 
                                    percent={securityScore} 
                                    status={getScoreStatus()} 
                                    format={percent => `${percent}分`}
                                    width={120}
                                />
                                <div className={styles.scoreInfo}>
                                    {securityScore < 50 && (
                                        <Alert 
                                            message="您的钱包安全级别较低" 
                                            description="建议启用更多安全功能来保护您的资产" 
                                            type="error" 
                                            showIcon 
                                        />
                                    )}
                                    {securityScore >= 50 && securityScore < 80 && (
                                        <Alert 
                                            message="您的钱包安全级别中等" 
                                            description="可以考虑启用钓鱼防护和地址白名单等高级安全功能" 
                                            type="warning" 
                                            showIcon 
                                        />
                                    )}
                                    {securityScore >= 80 && (
                                        <Alert 
                                            message="您的钱包安全级别良好" 
                                            description="您已启用大部分安全功能，钱包安全性较高" 
                                            type="success" 
                                            showIcon 
                                        />
                                    )}
                                </div>
                            </div>
                        </Card>
                    </Col>
                    
                    {/* 钱包安全设置 */}
                    <Col span={24}>
                        <Card title={<div className={styles.cardTitle}><WalletOutlined /> 钱包安全</div>} className={styles.securityCard}>
                            <div className={styles.securityItem}>
                                <div className={styles.itemInfo}>
                                    <h4>交易确认</h4>
                                    <p>每次交易前需要确认交易详情</p>
                                </div>
                                <div className={styles.itemAction}>
                                    <Switch 
                                        checked={securityState.transactionConfirmation} 
                                        onChange={(checked) => toggleSetting('transactionConfirmation', checked)}
                                    />
                                </div>
                            </div>
                            
                            <Divider />
                            
                            <div className={styles.securityItem}>
                                <div className={styles.itemInfo}>
                                    <h4>高额交易提醒</h4>
                                    <p>交易金额超过设定阈值时发出警告</p>
                                </div>
                                <div className={styles.itemAction}>
                                    <Switch 
                                        checked={securityState.highValueAlert} 
                                        onChange={(checked) => toggleSetting('highValueAlert', checked)}
                                    />
                                </div>
                            </div>
                            
                            <Divider />
                            
                            <div className={styles.securityItem}>
                                <div className={styles.itemInfo}>
                                    <h4>合约交互警告</h4>
                                    <p>与智能合约交互时显示风险提示</p>
                                </div>
                                <div className={styles.itemAction}>
                                    <Switch 
                                        checked={securityState.contractInteractionWarning} 
                                        onChange={(checked) => toggleSetting('contractInteractionWarning', checked)}
                                    />
                                </div>
                            </div>
                            
                            <Divider />
                            
                            <div className={styles.securityItem}>
                                <div className={styles.itemInfo}>
                                    <h4>钓鱼防护</h4>
                                    <p>检测并阻止已知的钓鱼网站</p>
                                </div>
                                <div className={styles.itemAction}>
                                    <Switch 
                                        checked={securityState.phishingProtection} 
                                        onChange={(checked) => toggleSetting('phishingProtection', checked)}
                                    />
                                </div>
                            </div>
                        </Card>
                    </Col>
                    
                    {/* 访问控制 */}
                    <Col span={24}>
                        <Card title={<div className={styles.cardTitle}><SafetyCertificateOutlined /> 访问控制</div>} className={styles.securityCard}>
                            <div className={styles.securityItem}>
                                <div className={styles.itemInfo}>
                                    <h4>自动锁定</h4>
                                    <p>一段时间不活动后自动锁定钱包</p>
                                </div>
                                <div className={styles.itemAction}>
                                    <Switch 
                                        checked={securityState.autoLock} 
                                        onChange={(checked) => toggleSetting('autoLock', checked)}
                                    />
                                </div>
                            </div>
                            
                            <Divider />
                            
                            <div className={styles.securityItem}>
                                <div className={styles.itemInfo}>
                                    <h4>活动通知</h4>
                                    <p>钱包活动时发送通知</p>
                                </div>
                                <div className={styles.itemAction}>
                                    <Switch 
                                        checked={securityState.activityNotifications} 
                                        onChange={(checked) => toggleSetting('activityNotifications', checked)}
                                    />
                                </div>
                            </div>
                            
                            <Divider />
                            
                            <div className={styles.securityItem}>
                                <div className={styles.itemInfo}>
                                    <h4>地址白名单</h4>
                                    <p>启用后只能向白名单地址转账</p>
                                </div>
                                <div className={styles.itemAction}>
                                    <Space>
                                        <Switch 
                                            checked={securityState.addressWhitelist} 
                                            onChange={(checked) => toggleSetting('addressWhitelist', checked)}
                                        />
                                        <Button 
                                            type="link" 
                                            onClick={() => setWhitelistModal(true)}
                                        >
                                            管理白名单
                                        </Button>
                                    </Space>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    
                    {/* 设备管理 */}
                    <Col span={24}>
                        <Card title={<div className={styles.cardTitle}><DesktopOutlined /> 设备管理</div>} className={styles.securityCard}>
                            <Paragraph className={styles.sectionDescription}>
                                管理已连接到您钱包的设备。如发现可疑设备，请立即断开连接并考虑冻结账户。
                            </Paragraph>
                            <Table 
                                dataSource={connectedDevices} 
                                columns={deviceColumns} 
                                rowKey="id"
                                pagination={false}
                            />
                        </Card>
                    </Col>
                    
                    {/* 应用授权 */}
                    <Col span={24}>
                        <Card title={<div className={styles.cardTitle}><KeyOutlined /> 应用授权</div>} className={styles.securityCard}>
                            <Paragraph className={styles.sectionDescription}>
                                管理已授权访问您钱包的应用程序。定期检查并撤销不再使用的应用授权。
                            </Paragraph>
                            <List
                                itemLayout="horizontal"
                                dataSource={authorizedApps}
                                renderItem={item => (
                                    <List.Item
                                        actions={[
                                            <Button 
                                                type="link" 
                                                danger
                                                onClick={() => revokeAppAuthorization(item.id)}
                                            >
                                                撤销授权
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={item.name}
                                            description={
                                                <div>
                                                    <div>权限: {item.permissions.join(', ')}</div>
                                                    <div>最后使用: {item.lastUsed}</div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                    
                    {/* 活动记录 */}
                    <Col span={24}>
                        <Card title={<div className={styles.cardTitle}><HistoryOutlined /> 活动记录</div>} className={styles.securityCard}>
                            <Paragraph className={styles.sectionDescription}>
                                查看您钱包的最近活动记录。如发现可疑活动，请立即采取安全措施。
                            </Paragraph>
                            <Table 
                                dataSource={activityLogs} 
                                columns={activityColumns} 
                                rowKey="id"
                                pagination={{ pageSize: 5 }}
                            />
                        </Card>
                    </Col>
                    
                    {/* 紧急操作 */}
                    <Col span={24}>
                        <Card title={<div className={styles.cardTitle}><ExclamationCircleOutlined /> 紧急操作</div>} className={styles.securityCard}>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    <Card className={styles.emergencyCard}>
                                        <h4>紧急冻结</h4>
                                        <p>如果您发现可疑活动或认为您的钱包已被盗用，可以紧急冻结账户。</p>
                                        <Button 
                                            danger 
                                            type="primary" 
                                            onClick={() => setEmergencyModal(true)}
                                        >
                                            紧急冻结账户
                                        </Button>
                                    </Card>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Card className={styles.emergencyCard}>
                                        <h4>账户恢复</h4>
                                        <p>设置账户恢复选项，以便在紧急情况下恢复对钱包的访问。</p>
                                        <Button 
                                            type="primary" 
                                            onClick={() => setRecoveryModal(true)}
                                        >
                                            设置恢复选项
                                        </Button>
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                
                {/* 白名单管理弹窗 */}
                <Modal
                    title="管理转账地址白名单"
                    open={whitelistModal}
                    onCancel={() => setWhitelistModal(false)}
                    footer={null}
                    width={700}
                >
                    <div className={styles.whitelistContainer}>
                        <div className={styles.addWhitelistForm}>
                            <Row gutter={16}>
                                <Col span={10}>
                                    <Input
                                        placeholder="输入地址标签"
                                        value={newAddress.label}
                                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                    />
                                </Col>
                                <Col span={10}>
                                    <Input
                                        placeholder="输入钱包地址"
                                        value={newAddress.address}
                                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                    />
                                </Col>
                                <Col span={4}>
                                    <Button type="primary" onClick={addWhitelistAddress}>
                                        添加
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                        
                        <Divider />
                        
                        <Table
                            dataSource={whitelistAddresses}
                            rowKey="id"
                            pagination={false}
                            columns={[
                                {
                                    title: '标签',
                                    dataIndex: 'label',
                                    key: 'label',
                                },
                                {
                                    title: '地址',
                                    dataIndex: 'address',
                                    key: 'address',
                                    render: (text: string) => (
                                        <Text ellipsis={{ tooltip: text }}>
                                            {text}
                                        </Text>
                                    )
                                },
                                {
                                    title: '操作',
                                    key: 'action',
                                    render: (text: string, record: any) => (
                                        <Popconfirm
                                            title="确定要删除这个地址吗？"
                                            onConfirm={() => removeWhitelistAddress(record.id)}
                                            okText="确定"
                                            cancelText="取消"
                                        >
                                            <Button type="link" danger>
                                                删除
                                            </Button>
                                        </Popconfirm>
                                    )
                                }
                            ]}
                        />
                    </div>
                </Modal>
                
                {/* 紧急冻结弹窗 */}
                <Modal
                    title={
                        <div className={styles.warningTitle}>
                            <ExclamationCircleOutlined /> 紧急冻结账户
                        </div>
                    }
                    open={emergencyModal}
                    onCancel={() => setEmergencyModal(false)}
                    footer={[
                        <Button key="back" onClick={() => setEmergencyModal(false)}>
                            取消
                        </Button>,
                        <Button key="submit" danger type="primary" onClick={executeEmergencyFreeze}>
                            确认冻结
                        </Button>
                    ]}
                >
                    <Alert
                        message="警告：此操作将立即冻结您的账户"
                        description="冻结后，您将无法进行任何交易操作，需要联系客服解冻账户。请确认您的账户确实存在安全风险。"
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                    <p>请输入"FREEZE"确认操作：</p>
                    <Input placeholder="输入FREEZE确认" />
                </Modal>
                
                {/* 账户恢复弹窗 */}
                <Modal
                    title="设置账户恢复选项"
                    open={recoveryModal}
                    onCancel={() => setRecoveryModal(false)}
                    footer={[
                        <Button key="back" onClick={() => setRecoveryModal(false)}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" onClick={setupRecoveryOption}>
                            确认设置
                        </Button>
                    ]}
                >
                    <Alert
                        message="重要提示"
                        description="账户恢复选项可以帮助您在紧急情况下恢复对钱包的访问权限。请妥善保管恢复信息。"
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                    
                    <Form layout="vertical">
                        <Form.Item
                            label="选择恢复方式"
                            name="recoveryMethod"
                            rules={[{ required: true, message: '请选择恢复方式' }]}
                        >
                            <Radio.Group>
                                <Space direction="vertical">
                                    <Radio value="guardian">
                                        <span>社交恢复（推荐）</span>
                                        <div className={styles.optionDescription}>
                                            指定3-5个信任的地址作为监护人，当您需要恢复账户时，需要其中大多数监护人确认。
                                        </div>
                                    </Radio>
                                    <Radio value="backup">
                                        <span>备份助记词</span>
                                        <div className={styles.optionDescription}>
                                            生成12或24个单词的助记词，可用于恢复您的钱包。请务必安全保存。
                                        </div>
                                    </Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminContentCard>
    );
};

export default SecuritySettings;