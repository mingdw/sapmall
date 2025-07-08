// 商家治理概览页面JavaScript功能

class MerchantGovernanceOverview {
    constructor() {
        this.initializeComponents();
        this.bindEvents();
    }

    initializeComponents() {
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.voteButtons = document.querySelectorAll('.vote-btn');
        this.actionItems = document.querySelectorAll('.merchant-action-item');
    }

    bindEvents() {
        // 标签页切换
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // 投票按钮事件
        this.voteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleVoteAction(e);
            });
        });

        // 快速操作项事件
        this.actionItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleQuickAction(e);
            });
        });
    }

    // 标签页切换功能
    switchTab(tabId) {
        // 更新按钮状态
        this.tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            }
        });

        // 更新内容显示
        this.tabContents.forEach(content => {
            if (content.id === tabId) {
                content.style.display = 'block';
                content.classList.add('active');
                // 添加淡入动画
                content.style.opacity = '0';
                setTimeout(() => {
                    content.style.transition = 'opacity 0.3s ease';
                    content.style.opacity = '1';
                }, 50);
            } else {
                content.style.display = 'none';
                content.classList.remove('active');
            }
        });

        this.loadTabData(tabId);
    }

    // 加载标签页数据
    loadTabData(tabId) {
        switch(tabId) {
            case 'merchant-related':
                console.log('Loading merchant related proposals...');
                break;
            case 'my-proposals':
                console.log('Loading my proposals...');
                break;
            case 'business-category':
                console.log('Loading business category proposals...');
                break;
        }
    }

    // 处理投票操作
    handleVoteAction(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const proposalItem = button.closest('.proposal-item');
        
        if (button.disabled) return;

        if (button.classList.contains('vote-btn-edit')) {
            this.editProposal(proposalItem);
        } else if (button.classList.contains('vote-btn-submit')) {
            this.submitProposal(proposalItem);
        } else if (button.classList.contains('vote-btn-yes')) {
            this.vote(proposalItem, 'support');
        } else if (button.classList.contains('vote-btn-no')) {
            this.vote(proposalItem, 'against');
        } else if (button.classList.contains('vote-btn-abstain')) {
            this.vote(proposalItem, 'abstain');
        }
    }

    // 编辑提案
    editProposal(proposalItem) {
        const proposalId = proposalItem.querySelector('.proposal-id').textContent;
        console.log(`Editing proposal: ${proposalId}`);
        this.showToast(`正在编辑${proposalId}`, 'info');
    }

    // 提交提案
    submitProposal(proposalItem) {
        const proposalId = proposalItem.querySelector('.proposal-id').textContent;
        console.log(`Submitting proposal: ${proposalId}`);
        this.showToast('提案已提交审核', 'success');
        
        // 更新状态徽章
        const statusBadge = proposalItem.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.textContent = '审核中';
            statusBadge.className = 'status-badge status-pending';
        }
    }

    // 投票功能
    vote(proposalItem, voteType) {
        const proposalId = proposalItem.querySelector('.proposal-id').textContent;
        const voteMessages = {
            support: '支持',
            against: '反对',
            abstain: '弃权'
        };
        
        console.log(`Voting ${voteType} for ${proposalId}`);
        this.showToast(`投票成功：${voteMessages[voteType]}`, 'success');
        
        // 更新按钮状态
        this.updateVoteButtons(proposalItem, voteType);
    }

    // 更新投票按钮状态
    updateVoteButtons(proposalItem, voteType) {
        const voteButtons = proposalItem.querySelectorAll('.vote-btn');
        voteButtons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('vote-btn-voted');
        });

        // 标记已投票的按钮
        let votedButton;
        if (voteType === 'support') {
            votedButton = proposalItem.querySelector('.vote-btn-yes');
        } else if (voteType === 'against') {
            votedButton = proposalItem.querySelector('.vote-btn-no');
        } else {
            votedButton = proposalItem.querySelector('.vote-btn-abstain');
        }
        
        if (votedButton) {
            votedButton.disabled = true;
            votedButton.classList.add('vote-btn-voted');
            votedButton.innerHTML = '<i class="fas fa-check"></i> 已投票';
        }
    }

    // 处理快速操作
    handleQuickAction(e) {
        e.preventDefault();
        const actionItem = e.currentTarget;
        const actionTitle = actionItem.querySelector('.action-title').textContent;
        
        console.log(`Quick action: ${actionTitle}`);
        
        switch(actionTitle) {
            case '创建提案':
                this.navigateToCreateProposal();
                break;
            case '商家数据':
                this.showMerchantData();
                break;
            case '商家联盟':
                this.showMerchantAlliance();
                break;
            case '投票中心':
                this.navigateToVotingCenter();
                break;
            case '社区参与':
                this.navigateToCommunity();
                break;
            case '治理学习':
                this.navigateToLearning();
                break;
        }
    }

    // 导航到创建提案页面
    navigateToCreateProposal() {
        this.showToast('正在跳转到提案创建页面...', 'info');
        // 这里可以添加实际的页面跳转逻辑
    }

    // 显示商家数据
    showMerchantData() {
        this.showToast('正在加载商家数据...', 'info');
        // 这里可以添加显示商家数据模态框的逻辑
    }

    // 显示商家联盟
    showMerchantAlliance() {
        this.showToast('正在加载商家联盟信息...', 'info');
        // 这里可以添加显示商家联盟模态框的逻辑
    }

    // 导航到投票中心
    navigateToVotingCenter() {
        this.showToast('正在跳转到投票中心...', 'info');
    }

    // 导航到社区参与
    navigateToCommunity() {
        this.showToast('正在跳转到社区页面...', 'info');
    }

    // 导航到治理学习
    navigateToLearning() {
        this.showToast('正在跳转到治理学习页面...', 'info');
    }

    // 显示提示消息
    showToast(message, type = 'info') {
        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // 获取toast图标
    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// 全局函数，供HTML调用
function navigateToProposals() {
    console.log('Navigating to proposals page...');
    // 这里可以添加实际的页面跳转逻辑
}

// 导航到提案管理页面（从治理概览的"查看全部"按钮）
function navigateToMerchantProposals() {
    console.log('跳转到商家提案管理页面');
    
    // 显示加载提示
    const loadingToast = new MerchantGovernanceOverview();
    loadingToast.showToast('正在跳转到提案管理...', 'info');
    
    // 模拟页面跳转延迟
    setTimeout(() => {
        // 在实际应用中，这里应该是真实的页面跳转
        window.location.href = 'merchant-proposals.html';
    }, 500);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.merchantGovernanceOverview = new MerchantGovernanceOverview();
    
    // 添加toast样式
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(15, 23, 42, 0.9);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(51, 65, 85, 0.4);
                border-radius: 8px;
                padding: 16px;
                color: #e2e8f0;
                z-index: 1000;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 300px;
            }
            
            .toast.toast-show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .toast.toast-success {
                border-color: #10b981;
            }
            
            .toast.toast-error {
                border-color: #ef4444;
            }
            
            .toast.toast-warning {
                border-color: #f59e0b;
            }
            
            .toast.toast-info {
                border-color: #3b82f6;
            }
            
            .toast-content i {
                font-size: 16px;
            }
            
            .toast.toast-success .toast-content i {
                color: #10b981;
            }
            
            .toast.toast-error .toast-content i {
                color: #ef4444;
            }
            
            .toast.toast-warning .toast-content i {
                color: #f59e0b;
            }
            
            .toast.toast-info .toast-content i {
                color: #3b82f6;
            }
        `;
        document.head.appendChild(style);
    }
});

// 创建提案功能
function createProposal() {
    console.log('创建提案');
    
    // 跳转到商家提案管理页面
    const loadingToast = new MerchantGovernanceOverview();
    loadingToast.showToast('正在跳转到提案创建...', 'info');
    
    setTimeout(() => {
        // 实际应用中这里应该跳转到提案创建页面
        window.location.href = 'merchant-proposals.html';
    }, 1000);
}

// 显示商家数据
function showMerchantData() {
    console.log('显示商家数据');
    
    const merchantData = {
        governanceLevel: 'A+',
        totalProposals: 7,
        passedProposals: 5,
        passRate: 71.4,
        votingPower: '3,567.89 SAP',
        governancePoints: 1250,
        merchantRank: 15,
        totalMerchants: 234,
        recentAchievements: [
            '成功推动商家保证金调整提案',
            '获得"优质提案者"称号',
            '连续3个月投票参与率100%',
            '商家联盟核心成员'
        ]
    };
    
    let achievementsList = merchantData.recentAchievements.map(achievement => `• ${achievement}`).join('\n');
    
    const message = `
📊 商家治理数据报告

🏆 核心指标：
• 治理等级：${merchantData.governanceLevel}
• 发起提案：${merchantData.totalProposals}个
• 通过提案：${merchantData.passedProposals}个
• 通过率：${merchantData.passRate}%
• 投票权重：${merchantData.votingPower}
• 治理积分：${merchantData.governancePoints}分

📈 排名信息：
• 商家排名：第${merchantData.merchantRank}名 / ${merchantData.totalMerchants}名
• 超越了${((merchantData.totalMerchants - merchantData.merchantRank) / merchantData.totalMerchants * 100).toFixed(1)}%的商家

🎯 近期成就：
${achievementsList}

💡 提升建议：
• 继续保持高质量提案
• 积极参与社区讨论
• 加强与其他商家的合作
• 定期关注治理动态
    `.trim();
    
    alert(message);
}

// 显示商家联盟信息
function showMerchantAlliance() {
    console.log('显示商家联盟');
    
    const allianceData = {
        status: '核心成员',
        joinDate: '2023年8月',
        totalMembers: 89,
        allianceLevel: '白金联盟',
        benefits: [
            '提案优先审核权',
            '联合提案发起权',
            '专属商家治理频道',
            '月度治理奖励加成',
            '优先客服支持',
            '独家商家活动参与权'
        ],
        upcomingEvents: [
            '1月30日 - 商家治理月会',
            '2月5日 - 联盟提案讨论会',
            '2月15日 - 优质商家表彰大会'
        ]
    };
    
    let benefitsList = allianceData.benefits.map(benefit => `✓ ${benefit}`).join('\n');
    let eventsList = allianceData.upcomingEvents.map(event => `📅 ${event}`).join('\n');
    
    const message = `
🤝 商家联盟信息

👑 会员状态：
• 身份：${allianceData.status}
• 加入时间：${allianceData.joinDate}
• 联盟等级：${allianceData.allianceLevel}
• 成员总数：${allianceData.totalMembers}人

🎁 专属权益：
${benefitsList}

📅 近期活动：
${eventsList}

💎 联盟优势：
• 集体议价能力更强
• 信息共享更及时
• 治理影响力更大
• 商业合作机会更多

🚀 下一步行动：
• 参与联盟月会讨论
• 准备联合提案
• 邀请优质商家加入
    `.trim();
    
    alert(message);
}

// 导航到投票中心
function navigateToVotingCenter() {
    console.log('导航到投票中心');
    
    const loadingToast = new MerchantGovernanceOverview();
    loadingToast.showToast('正在跳转到投票中心...', 'info');
    
    setTimeout(() => {
        // 实际应用中这里应该跳转到投票中心页面
        loadingToast.showToast('投票中心功能正在开发中', 'warning');
    }, 1000);
}

// 导航到社区参与
function navigateToCommunity() {
    console.log('导航到社区参与');
    
    const communityInfo = {
        currentLevel: '活跃参与者',
        participationScore: 892,
        monthlyRank: 23,
        totalUsers: 1567,
        recentActivities: [
            '参与"平台费率调整"讨论',
            '在商家论坛发表3篇文章',
            '回复社区问题15次',
            '获得26个点赞'
        ],
        upcomingEvents: [
            '1月25日 - 社区AMA活动',
            '1月28日 - 治理提案预讨论',
            '2月1日 - 月度社区大会'
        ]
    };
    
    let activitiesList = communityInfo.recentActivities.map(activity => `• ${activity}`).join('\n');
    let eventsList = communityInfo.upcomingEvents.map(event => `📅 ${event}`).join('\n');
    
    const message = `
👥 社区参与报告

🏅 当前状态：
• 参与等级：${communityInfo.currentLevel}
• 参与积分：${communityInfo.participationScore}分
• 月度排名：第${communityInfo.monthlyRank}名 / ${communityInfo.totalUsers}人
• 超越了${((communityInfo.totalUsers - communityInfo.monthlyRank) / communityInfo.totalUsers * 100).toFixed(1)}%的用户

📈 近期活动：
${activitiesList}

📅 即将举行：
${eventsList}

💡 参与建议：
• 多参与热门话题讨论
• 分享治理经验和见解
• 帮助新用户了解治理
• 积极参与投票和提案

🎯 下月目标：
• 参与积分突破1000分
• 排名进入前20名
• 发表5篇高质量文章
    `.trim();
    
    alert(message);
}

// 导航到治理学习
function navigateToLearning() {
    console.log('导航到治理学习');
    
    const learningData = {
        completedCourses: 8,
        totalCourses: 12,
        learningProgress: 67,
        certificates: [
            'DAO基础治理认证',
            '商家权益保护专题',
            '提案撰写技巧进阶'
        ],
        recommendedCourses: [
            '区块链治理机制深度解析',
            '商家联盟运营实战',
            '社区建设与维护',
            'DeFi治理代币经济学'
        ],
        upcomingWebinars: [
            '1月26日 - Web3治理最佳实践',
            '2月2日 - 商家治理案例分析',
            '2月8日 - DAO工具使用指南'
        ]
    };
    
    let certificatesList = learningData.certificates.map(cert => `🏆 ${cert}`).join('\n');
    let coursesList = learningData.recommendedCourses.map(course => `📚 ${course}`).join('\n');
    let webinarsList = learningData.upcomingWebinars.map(webinar => `🎓 ${webinar}`).join('\n');
    
    const message = `
🎓 治理学习中心

📊 学习进度：
• 已完成课程：${learningData.completedCourses} / ${learningData.totalCourses}
• 学习进度：${learningData.learningProgress}%
• 下一个里程碑：完成所有基础课程

🏆 已获认证：
${certificatesList}

📚 推荐课程：
${coursesList}

🎓 即将开课：
${webinarsList}

💡 学习建议：
• 优先完成基础治理课程
• 参加实时在线研讨会
• 与其他学员交流经验
• 将学到的知识应用到实际治理中

🎯 学习目标：
• 本月完成2门新课程
• 获得"治理专家"认证
• 参与3场在线研讨会
    `.trim();
    
    alert(message);
} 