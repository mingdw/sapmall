import React, { useEffect, useState } from 'react';
import { Avatar, Button, message, Tooltip, Spin } from 'antd';
import { UserOutlined, EditOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import AdminContentCard from '../AdminContentCard';
import { authManager } from '../../../utils/authManager';
import styles from './ProfileInfo.module.scss';
import { shortenAddress } from '../../../utils/common';

const ProfileInfo: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const initUserData = async () => {
            setLoading(true);
            try {
                // 检查是否已有用户信息
                if (!authManager.userInfo) {
                    // 如果没有用户信息，初始化
                    await authManager.init();
                }
                
                // 获取用户信息
                setUserInfo(authManager.userInfo);
            } catch (error) {
                console.error("获取用户数据失败:", error);
                message.error('获取用户信息失败');
            } finally {
                setLoading(false);
            }
        };
        
        initUserData();
    }, []);

    const handleCopyAddress = () => {
        if (authManager.address) {
            navigator.clipboard.writeText(authManager.address);
            setCopied(true);
            message.success('地址已复制到剪贴板');
            setTimeout(() => setCopied(false), 3000);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <Spin size="large" tip="加载用户信息..." />
            </div>
        );
    }

    return (
        <div className={styles.profileContainer}>
            <AdminContentCard title="个人信息" icon={<UserOutlined />}>
                <div className={styles.infoCard}>
                    <div className={styles.userHeader}>
                        <div className={styles.avatarContainer}>
                            <Avatar 
                                size={100} 
                                src={userInfo?.avatar ? userInfo.avatar : null} 
                                icon={<UserOutlined />} 
                                className={styles.avatar}
                            />
                            <div className={styles.uploadButton}>
                                <EditOutlined />
                            </div>
                        </div>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>
                                {userInfo?.nickname || '未设置昵称'}
                                <div className={styles.walletAddress}>
                                    <span className={styles.addressValue}>
                                        {shortenAddress(authManager.address) || '未连接钱包'}
                                    </span>
                                    {authManager.address && (
                                        <Tooltip title={copied ? "已复制" : "复制地址"}>
                                            {copied ? 
                                                <CheckOutlined className={styles.copyIcon} style={{ color: '#52c41a' }} /> : 
                                                <CopyOutlined className={styles.copyIcon} onClick={handleCopyAddress} />
                                            }
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                            <span className={`${styles.userRole} ${userInfo?.isAdmin ? styles.adminRole : ''}`}>
                                {userInfo?.isAdmin ? '管理员' : '普通用户'}
                            </span>
                            <p className={styles.userBrief}>
                                {userInfo?.statusDesc || '账户状态正常'}
                            </p>
                        </div>
                    </div>

                    <div className={styles.infoContent}>
                        <div className={styles.infoSection}>
                            <h3 className={styles.sectionTitle}>基本信息</h3>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>用户ID：</span>
                                <span className={styles.infoValue}>{userInfo?.uniqueId || '未设置'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>昵称：</span>
                                <span className={styles.infoValue}>{userInfo?.nickname || '未设置'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>性别：</span>
                                <span className={styles.infoValue}>
                                    {userInfo?.gender === 1 ? '男' : userInfo?.gender === 2 ? '女' : '未设置'}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>生日：</span>
                                <span className={styles.infoValue}>{userInfo?.birthday || '未设置'}</span>
                            </div>
                        </div>

                        <div className={styles.infoSection}>
                            <h3 className={styles.sectionTitle}>联系方式</h3>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>电子邮箱：</span>
                                <span className={styles.infoValue}>{userInfo?.email || '未设置'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>手机号码：</span>
                                <span className={styles.infoValue}>{userInfo?.phone || '未设置'}</span>
                            </div>
                        </div>

                        <Button type="primary" className={styles.editButton}>
                            编辑个人信息
                        </Button>
                    </div>
                </div>
            </AdminContentCard>
        </div>
    );
};

export default ProfileInfo;