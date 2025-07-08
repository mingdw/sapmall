// 治理学习页面JavaScript功能

// 全局状态管理
const LearningState = {
    user: {
        level: 'beginner',
        experience: 350,
        nextLevelExp: 1000,
        completedCourses: 12,
        studyHours: 48,
        certificates: 3,
        averageScore: 85
    },
    courses: {
        'dao-intro': { progress: 0, completed: false, duration: 90 },
        'proposal-voting': { progress: 0, completed: false, duration: 150 },
        'wallet-security': { progress: 100, completed: true, duration: 60 },
        'dao-basics-5': { progress: 75, completed: false, duration: 120 },
        'dao-basics-4': { progress: 100, completed: true, duration: 90 }
    },
    paths: {
        'dao-basics': { progress: 62.5, completedLessons: 5, totalLessons: 8 },
        'tokenomics': { progress: 0, completedLessons: 0, totalLessons: 12 },
        'smart-contract-security': { progress: 0, completedLessons: 0, totalLessons: 15, locked: true }
    },
    quizzes: {
        'dao-basics-quiz': { attempts: 2, bestScore: 85, unlocked: true },
        'tokenomics-quiz': { attempts: 0, bestScore: 0, unlocked: false }
    }
};

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeLearningPage();
});

// 初始化学习页面
function initializeLearningPage() {
    console.log('🎓 初始化治理学习页面...');
    
    // 初始化动画效果
    initializeAnimations();
    
    // 初始化卡片悬停效果
    initializeCardHoverEffects();
    
    // 模拟加载用户学习数据
    loadUserLearningData();
    
    // 初始化Toast通知系统
    initializeToastSystem();
    
    // 初始化学习追踪
    initializeLearningTracking();
    
    // 初始化课程过滤
    initializeCourseFilter();
    
    // 自动保存学习进度
    setInterval(autoSaveLearningProgress, 30000); // 每30秒保存一次
}

// 初始化动画效果
function initializeAnimations() {
    // 数字统计动画
    animateNumbers();
    
    // 进度条动画
    animateProgressBars();
    
    // 卡片入场动画
    animateCardEntrance();
    
    // 等级进度动画
    animateLevelProgress();
}

// 数字统计动画
function animateNumbers() {
    const numberElements = document.querySelectorAll('.stat-value');
    
    numberElements.forEach(element => {
        const finalValue = parseInt(element.textContent);
        let currentValue = 0;
        const increment = finalValue / 50;
        const duration = 1500;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentValue);
        }, stepTime);
    });
}

// 进度条动画
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach((bar, index) => {
        const width = bar.style.width;
        bar.style.width = '0%';
        bar.style.transition = 'width 1s ease-out';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 300 + index * 100);
    });
}

// 等级进度动画
function animateLevelProgress() {
    const levelProgress = document.querySelector('.level-progress .progress-fill');
    if (levelProgress) {
        const currentExp = LearningState.user.experience;
        const nextLevelExp = LearningState.user.nextLevelExp;
        const progressPercent = (currentExp / nextLevelExp) * 100;
        
        levelProgress.style.width = '0%';
        setTimeout(() => {
            levelProgress.style.width = progressPercent + '%';
        }, 500);
    }
}

// 卡片入场动画
function animateCardEntrance() {
    const cards = document.querySelectorAll('.path-card, .course-card, .quiz-card, .achievement-item');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + index * 80);
    });
}

// 初始化卡片悬停效果
function initializeCardHoverEffects() {
    const cards = document.querySelectorAll('.path-card, .course-card, .quiz-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.15)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        });
    });
}

// 初始化学习追踪
function initializeLearningTracking() {
    // 记录页面访问
    trackLearningActivity('page_visit', 'governance_learning');
    
    // 监听滚动事件，追踪用户参与度
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > 80) {
                trackLearningActivity('page_scroll', 'deep_engagement');
            }
        }, 100);
    });
}

// 初始化课程过滤
function initializeCourseFilter() {
    const filterSelect = document.getElementById('courseFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            filterCourses(this.value);
        });
    }
}

// 模拟加载用户学习数据
function loadUserLearningData() {
    showToast('正在加载学习数据...', 'info', 1000);
    
    // 模拟API调用延迟
    setTimeout(() => {
        updateLearningStats();
        updateRecentHistory();
        updateAchievements();
        updatePathProgress();
        checkUnlockedContent();
        showToast('学习数据加载完成！', 'success');
    }, 1200);
}

// 更新学习统计数据
function updateLearningStats() {
    const stats = LearningState.user;
    
    // 更新统计数字
    document.querySelector('.stat-value').textContent = stats.completedCourses;
    
    // 更新等级徽章
    const levelBadge = document.querySelector('.level-badge');
    if (levelBadge) {
        const levelNames = {
            'beginner': '初级学员',
            'intermediate': '中级学员',
            'advanced': '高级学员',
            'expert': '专家学员'
        };
        levelBadge.textContent = levelNames[stats.level];
    }
    
    console.log('✅ 学习统计已更新:', stats);
}

// 更新最近学习记录
function updateRecentHistory() {
    const historyItems = document.querySelectorAll('.history-item');
    
    historyItems.forEach((item, index) => {
        // 添加加载动画
        item.style.opacity = '0.5';
        item.style.transform = 'translateX(-10px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 200 + index * 150);
    });
}

// 更新成就显示
function updateAchievements() {
    const achievementItems = document.querySelectorAll('.achievement-item');
    
    achievementItems.forEach((item, index) => {
        // 添加加载动画
        item.style.opacity = '0.5';
        item.style.transform = 'translateY(10px)';
        
            setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 300 + index * 100);
    });
    
    // 更新成就进度
    const progressAchievement = document.querySelector('.achievement-item.progress .progress-fill');
    if (progressAchievement) {
        const currentProgress = 89; // 从LearningState获取实际数据
        const targetProgress = 500;
        const progressPercent = (currentProgress / targetProgress) * 100;
        
        setTimeout(() => {
            progressAchievement.style.width = progressPercent + '%';
        }, 800);
    }
    
    console.log('✅ 成就系统已更新');
}

// 更新学习路径进度
function updatePathProgress() {
    Object.keys(LearningState.paths).forEach(pathId => {
        const path = LearningState.paths[pathId];
        const pathCard = document.querySelector(`[data-path="${pathId}"]`);
        
        if (pathCard) {
            const progressBar = pathCard.querySelector('.progress-fill');
            const progressText = pathCard.querySelector('.progress-text');
            
            if (progressBar) {
                progressBar.style.width = path.progress + '%';
            }
            
            if (progressText) {
                if (path.progress === 100) {
                    progressText.textContent = '已完成';
                    pathCard.classList.add('completed');
                } else if (path.progress === 0) {
                    progressText.textContent = '未开始';
                } else {
                    progressText.textContent = `${path.completedLessons}/${path.totalLessons} 课程完成`;
                }
            }
        }
    });
}

// 检查解锁内容
function checkUnlockedContent() {
    // 检查课程解锁状态
    Object.keys(LearningState.courses).forEach(courseId => {
        const course = LearningState.courses[courseId];
        const courseCard = document.querySelector(`[data-course="${courseId}"]`);
        
        if (courseCard && course.completed) {
            courseCard.classList.add('completed');
            const button = courseCard.querySelector('button');
            if (button) {
                button.innerHTML = '<i class="fas fa-check"></i> 已完成';
                button.classList.add('completed');
            }
        }
    });
    
    // 检查测试解锁状态
    Object.keys(LearningState.quizzes).forEach(quizId => {
        const quiz = LearningState.quizzes[quizId];
        const quizCard = document.querySelector(`[data-quiz="${quizId}"]`);
        
        if (quizCard && !quiz.unlocked) {
            quizCard.classList.add('locked');
        }
    });
}

// 学习路径操作
function viewAllPaths() {
    showToast('正在跳转到学习路径页面...', 'info');
    trackLearningActivity('navigation', 'view_all_paths');
    
    // 模拟页面跳转
    setTimeout(() => {
        showToast('学习路径页面加载完成', 'success');
    }, 1500);
}

function continuePath(pathId) {
    const path = LearningState.paths[pathId];
    
    if (!path) {
        showToast('学习路径不存在', 'error');
        return;
    }
    
    if (path.locked) {
        showToast('该学习路径暂未解锁，请先完成前置课程', 'warning');
        return;
    }
    
    // 显示继续学习选项
    showContinuePathModal(pathId, path);
}

function startPath(pathId) {
    const path = LearningState.paths[pathId];
    
    if (!path) {
        showToast('学习路径不存在', 'error');
        return;
    }
    
    if (path.locked) {
        showToast('该学习路径暂未解锁', 'warning');
        return;
    }
    
    // 显示学习计划制定模态框
    showStartPathModal(pathId, path);
}

// 显示继续学习模态框
function showContinuePathModal(pathId, path) {
    const pathName = getPathName(pathId);
    const nextLesson = getCurrentLesson(pathId);
    
    const modal = document.createElement('div');
    modal.className = 'path-modal';
    modal.innerHTML = `
        <div class="path-modal-content">
            <div class="path-modal-header">
                <h3><i class="fas fa-play-circle"></i> 继续学习路径</h3>
                <button class="close-modal" onclick="closePathModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="path-modal-body">
                <div class="path-continue-info">
                    <div class="path-icon-large">
                        <i class="fas fa-seedling"></i>
                    </div>
                    <h4>${pathName}</h4>
                    <div class="continue-progress">
                        <div class="progress-circle">
                            <div class="progress-value">${Math.round(path.progress)}%</div>
                        </div>
                        <div class="progress-details">
                            <p>已完成 ${path.completedLessons} / ${path.totalLessons} 课程</p>
                            <p class="next-lesson">下一课程：${nextLesson.title}</p>
                        </div>
                    </div>
                    <div class="study-options">
                        <div class="option-card" onclick="continueFromCurrent('${pathId}')">
                            <i class="fas fa-play"></i>
                            <h5>继续当前课程</h5>
                            <p>从上次停止的地方继续学习</p>
                        </div>
                        <div class="option-card" onclick="reviewPrevious('${pathId}')">
                            <i class="fas fa-redo"></i>
                            <h5>复习已学内容</h5>
                            <p>回顾之前学过的课程内容</p>
                        </div>
                        <div class="option-card" onclick="viewPathProgress('${pathId}')">
                            <i class="fas fa-chart-line"></i>
                            <h5>查看学习进度</h5>
                            <p>详细了解学习进度和成绩</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="path-modal-footer">
                <button class="btn-secondary" onclick="closePathModal()">
                    <i class="fas fa-times"></i> 取消
                </button>
                <button class="btn-primary" onclick="continueFromCurrent('${pathId}')">
                    <i class="fas fa-play"></i> 立即继续
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    trackLearningActivity('path_continue_modal', pathId);
}

// 显示开始学习模态框
function showStartPathModal(pathId, path) {
    const pathName = getPathName(pathId);
    const pathInfo = getPathInfo(pathId);
    
    const modal = document.createElement('div');
    modal.className = 'path-modal';
    modal.innerHTML = `
        <div class="path-modal-content">
            <div class="path-modal-header">
                <h3><i class="fas fa-rocket"></i> 开始学习路径</h3>
                <button class="close-modal" onclick="closePathModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="path-modal-body">
                <div class="path-start-info">
                    <div class="path-overview">
                        <div class="path-icon-large">
                            <i class="${pathInfo.icon}"></i>
                        </div>
                        <h4>${pathName}</h4>
                        <p class="path-desc">${pathInfo.description}</p>
                    </div>
                    
                    <div class="path-details">
                        <div class="detail-item">
                            <i class="fas fa-book"></i>
                            <span>共 ${path.totalLessons} 个课程</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>预计 ${pathInfo.estimatedHours} 小时</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-graduation-cap"></i>
                            <span>适合 ${pathInfo.level} 学员</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-star"></i>
                            <span>评分 ${pathInfo.rating} 分</span>
                        </div>
                    </div>
                    
                    <div class="learning-plan">
                        <h5>制定学习计划</h5>
                        <div class="plan-options">
                            <label class="plan-option">
                                <input type="radio" name="studyPlan" value="intensive" checked>
                                <div class="option-content">
                                    <strong>密集学习</strong>
                                    <span>每天2小时，预计${Math.ceil(pathInfo.estimatedHours/2)}天完成</span>
                                </div>
                            </label>
                            <label class="plan-option">
                                <input type="radio" name="studyPlan" value="regular">
                                <div class="option-content">
                                    <strong>常规学习</strong>
                                    <span>每天1小时，预计${pathInfo.estimatedHours}天完成</span>
                                </div>
                            </label>
                            <label class="plan-option">
                                <input type="radio" name="studyPlan" value="relaxed">
                                <div class="option-content">
                                    <strong>轻松学习</strong>
                                    <span>每天30分钟，预计${Math.ceil(pathInfo.estimatedHours*2)}天完成</span>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <div class="prerequisites">
                        <h5>学习要求</h5>
                        <ul>
                            ${pathInfo.prerequisites.map(req => `<li><i class="fas fa-check"></i> ${req}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="path-modal-footer">
                <button class="btn-secondary" onclick="closePathModal()">
                    <i class="fas fa-times"></i> 取消
                </button>
                <button class="btn-primary" onclick="confirmStartPath('${pathId}')">
                    <i class="fas fa-rocket"></i> 开始学习
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    trackLearningActivity('path_start_modal', pathId);
}

// 显示路径详情
function showPathDetail(pathId) {
    const pathName = getPathName(pathId);
    const pathInfo = getPathInfo(pathId);
    const path = LearningState.paths[pathId];
    
    const modal = document.createElement('div');
    modal.className = 'path-modal large';
    modal.innerHTML = `
        <div class="path-modal-content">
            <div class="path-modal-header">
                <h3><i class="fas fa-info-circle"></i> 学习路径详情</h3>
                <button class="close-modal" onclick="closePathModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="path-modal-body">
                <div class="path-detail-content">
                    <div class="detail-header">
                        <div class="path-icon-large">
                            <i class="${pathInfo.icon}"></i>
                        </div>
                        <div class="detail-info">
                            <h4>${pathName}</h4>
                            <p>${pathInfo.description}</p>
                            <div class="detail-stats">
                                <span class="stat"><i class="fas fa-book"></i> ${path.totalLessons} 课程</span>
                                <span class="stat"><i class="fas fa-clock"></i> ${pathInfo.estimatedHours} 小时</span>
                                <span class="stat"><i class="fas fa-star"></i> ${pathInfo.rating} 分</span>
                                <span class="stat"><i class="fas fa-users"></i> ${pathInfo.students} 人学习</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="curriculum">
                        <h5>课程大纲</h5>
                        <div class="lesson-list">
                            ${pathInfo.curriculum.map((lesson, index) => `
                                <div class="lesson-item ${index < path.completedLessons ? 'completed' : ''}">
                                    <div class="lesson-number">${index + 1}</div>
                                    <div class="lesson-content">
                                        <h6>${lesson.title}</h6>
                                        <p>${lesson.description}</p>
                                        <div class="lesson-meta">
                                            <span><i class="fas fa-clock"></i> ${lesson.duration}</span>
                                            <span><i class="fas fa-signal"></i> ${lesson.difficulty}</span>
                                        </div>
                                    </div>
                                    <div class="lesson-status">
                                        ${index < path.completedLessons ? 
                                            '<i class="fas fa-check-circle"></i>' : 
                                            index === path.completedLessons ? 
                                                '<i class="fas fa-play-circle"></i>' : 
                                                '<i class="fas fa-lock"></i>'
                                        }
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="learning-outcomes">
                        <h5>学习成果</h5>
                        <ul>
                            ${pathInfo.outcomes.map(outcome => `<li><i class="fas fa-graduation-cap"></i> ${outcome}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="path-modal-footer">
                <button class="btn-secondary" onclick="closePathModal()">
                    <i class="fas fa-times"></i> 关闭
                </button>
                ${path.locked ? 
                    `<button class="btn-primary" disabled>
                        <i class="fas fa-lock"></i> 暂未解锁
                    </button>` :
                    path.progress > 0 ? 
                        `<button class="btn-primary" onclick="closePathModal(); continuePath('${pathId}')">
                            <i class="fas fa-play"></i> 继续学习
                        </button>` :
                        `<button class="btn-primary" onclick="closePathModal(); startPath('${pathId}')">
                            <i class="fas fa-rocket"></i> 开始学习
                        </button>`
                }
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    trackLearningActivity('path_detail_view', pathId);
}

// 显示解锁要求
function showUnlockRequirement(pathId) {
    const pathName = getPathName(pathId);
    const requirements = getUnlockRequirements(pathId);
    
    const modal = document.createElement('div');
    modal.className = 'path-modal';
    modal.innerHTML = `
        <div class="path-modal-content">
            <div class="path-modal-header">
                <h3><i class="fas fa-lock"></i> 解锁要求</h3>
                <button class="close-modal" onclick="closePathModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="path-modal-body">
                <div class="unlock-requirements">
                    <div class="unlock-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h4>${pathName}</h4>
                    <p>要解锁此学习路径，您需要满足以下条件：</p>
                    
                    <div class="requirements-list">
                        ${requirements.map(req => `
                            <div class="requirement-item ${req.completed ? 'completed' : ''}">
                                <div class="req-icon">
                                    <i class="fas ${req.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                                </div>
                                <div class="req-content">
                                    <h6>${req.title}</h6>
                                    <p>${req.description}</p>
                                    ${req.progress ? `<div class="req-progress">${req.progress}</div>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="unlock-tips">
                        <h5>解锁建议</h5>
                        <p>建议您先完成"DAO治理基础入门"路径，提升您的学习等级，然后即可解锁此高级课程。</p>
                    </div>
                </div>
            </div>
            <div class="path-modal-footer">
                <button class="btn-secondary" onclick="closePathModal()">
                    <i class="fas fa-times"></i> 我知道了
                </button>
                <button class="btn-primary" onclick="closePathModal(); continuePath('dao-basics')">
                    <i class="fas fa-rocket"></i> 去完成基础课程
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    trackLearningActivity('unlock_requirement_view', pathId);
}

// 确认开始学习路径
function confirmStartPath(pathId) {
    const selectedPlan = document.querySelector('input[name="studyPlan"]:checked').value;
    
    // 更新路径状态
    LearningState.paths[pathId].progress = 12.5;
    LearningState.paths[pathId].completedLessons = 1;
    LearningState.paths[pathId].studyPlan = selectedPlan;
    
    // 关闭模态框
    closePathModal();
    
    // 更新UI
    const pathCard = document.querySelector(`[data-path="${pathId}"]`);
    updatePathCard(pathCard, pathId);
    
    showToast(`开始学习: ${getPathName(pathId)}`, 'success');
    trackLearningActivity('path_start_confirmed', { pathId, plan: selectedPlan });
    
    // 显示第一课程
    setTimeout(() => {
        showCourseModal(pathId, 1);
    }, 1000);
}

// 从当前位置继续
function continueFromCurrent(pathId) {
    closePathModal();
    showToast(`继续学习: ${getPathName(pathId)}`, 'success');
    
    // 模拟学习进度更新
    const pathCard = document.querySelector(`[data-path="${pathId}"]`);
    simulateLearningProgress(pathCard, pathId);
    
    trackLearningActivity('path_continue_current', pathId);
}

// 复习之前的内容
function reviewPrevious(pathId) {
    closePathModal();
    showToast('开始复习之前的课程内容', 'info');
    trackLearningActivity('path_review', pathId);
}

// 查看学习进度
function viewPathProgress(pathId) {
    closePathModal();
    showToast('正在加载详细学习进度...', 'info');
    trackLearningActivity('path_progress_view', pathId);
}

// 关闭路径模态框
function closePathModal() {
    const modal = document.querySelector('.path-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// 获取当前课程信息
function getCurrentLesson(pathId) {
    const lessons = {
        'dao-basics': [
            { title: 'DAO基础概念', completed: true },
            { title: '治理代币机制', completed: true },
            { title: '投票系统设计', completed: true },
            { title: '提案流程管理', completed: true },
            { title: '社区治理实践', completed: true },
            { title: '投票权重计算', completed: false, current: true },
            { title: '治理风险控制', completed: false },
            { title: '去中心化实施', completed: false }
        ]
    };
    
    const pathLessons = lessons[pathId] || [];
    return pathLessons.find(lesson => lesson.current) || pathLessons[0];
}

// 获取路径详细信息
function getPathInfo(pathId) {
    const pathsInfo = {
        'dao-basics': {
            icon: 'fas fa-seedling',
            description: '全面系统地学习DAO治理的基础知识，包括概念理解、机制设计、实践应用等方面。',
            estimatedHours: 12,
            level: '初级',
            rating: 4.8,
            students: '1,234',
            prerequisites: [
                '具备基本的区块链概念',
                '了解智能合约基础',
                '有一定的英文阅读能力'
            ],
            curriculum: [
                {
                    title: 'DAO基础概念',
                    description: '了解去中心化自治组织的基本定义和特征',
                    duration: '1.5小时',
                    difficulty: '入门'
                },
                {
                    title: '治理代币机制',
                    description: '学习治理代币的作用和分配机制',
                    duration: '2小时',
                    difficulty: '入门'
                },
                {
                    title: '投票系统设计',
                    description: '掌握不同投票机制的设计原理',
                    duration: '1.5小时',
                    difficulty: '初级'
                },
                {
                    title: '提案流程管理',
                    description: '学习提案的创建、讨论和执行流程',
                    duration: '2小时',
                    difficulty: '初级'
                },
                {
                    title: '社区治理实践',
                    description: '了解实际DAO项目的治理案例',
                    duration: '1.5小时',
                    difficulty: '初级'
                },
                {
                    title: '投票权重计算',
                    description: '深入理解不同权重计算方法',
                    duration: '2小时',
                    difficulty: '中级'
                },
                {
                    title: '治理风险控制',
                    description: '学习识别和控制治理风险',
                    duration: '1小时',
                    difficulty: '中级'
                },
                {
                    title: '去中心化实施',
                    description: '掌握渐进式去中心化的实施策略',
                    duration: '1.5小时',
                    difficulty: '中级'
                }
            ],
            outcomes: [
                '理解DAO的核心概念和运作原理',
                '掌握治理代币的设计和使用',
                '能够参与DAO的治理决策',
                '了解主流DAO项目的治理模式',
                '具备基础的DAO治理分析能力'
            ]
        },
        'tokenomics': {
            icon: 'fas fa-coins',
            description: '深入学习代币经济学的高级概念，包括经济模型设计、激励机制、价值捕获等。',
            estimatedHours: 20,
            level: '中级',
            rating: 4.6,
            students: '856',
            prerequisites: [
                '完成DAO治理基础课程',
                '具备经济学基础知识',
                '了解DeFi基本概念'
            ],
            curriculum: [
                {
                    title: '代币经济学概论',
                    description: '代币经济学的基本理论和框架',
                    duration: '2小时',
                    difficulty: '中级'
                },
                {
                    title: '代币设计原理',
                    description: '代币的功能设计和经济属性',
                    duration: '2.5小时',
                    difficulty: '中级'
                }
                // ... 更多课程
            ],
            outcomes: [
                '掌握代币经济学的核心理论',
                '能够设计代币经济模型',
                '理解各种激励机制的作用',
                '具备代币项目的分析能力'
            ]
        },
        'smart-contract-security': {
            icon: 'fas fa-shield-alt',
            description: '学习智能合约安全审计的专业知识，包括漏洞识别、安全测试、最佳实践等。',
            estimatedHours: 25,
            level: '高级',
            rating: 4.9,
            students: '342',
            prerequisites: [
                '达到中级学习等级',
                '具备Solidity编程基础',
                '完成代币经济学课程'
            ],
            curriculum: [
                {
                    title: '智能合约安全概述',
                    description: '智能合约安全的重要性和常见风险',
                    duration: '2小时',
                    difficulty: '高级'
                }
                // ... 更多课程
            ],
            outcomes: [
                '掌握智能合约安全审计技能',
                '能够识别常见的安全漏洞',
                '具备安全代码编写能力',
                '了解安全审计的最佳实践'
            ]
        }
    };
    
    return pathsInfo[pathId] || {};
}

// 获取解锁要求
function getUnlockRequirements(pathId) {
    const requirements = {
        'smart-contract-security': [
            {
                title: '达到中级学习等级',
                description: '当前等级：初级，需要提升到中级',
                completed: false,
                progress: '35% / 100%'
            },
            {
                title: '完成DAO治理基础入门',
                description: '完成所有8个基础课程',
                completed: false,
                progress: '5 / 8 课程完成'
            },
            {
                title: '通过基础知识测试',
                description: '在DAO基础测试中获得80分以上',
                completed: true
            }
        ]
    };
    
    return requirements[pathId] || [];
}

// 更新路径卡片显示
function updatePathCard(pathCard, pathId) {
    if (!pathCard) return;
    
    const path = LearningState.paths[pathId];
    const progressBar = pathCard.querySelector('.progress-fill');
    const progressText = pathCard.querySelector('.progress-text');
    const actionContainer = pathCard.querySelector('.path-actions');
    
    if (progressBar) {
        progressBar.style.width = path.progress + '%';
    }
    
    if (progressText) {
        if (path.progress === 100) {
        progressText.textContent = '已完成';
        pathCard.classList.add('completed');
        } else if (path.progress === 0) {
            progressText.textContent = '未开始';
    } else {
            progressText.textContent = `${path.completedLessons}/${path.totalLessons} 课程完成`;
        }
    }
    
    // 更新按钮
    if (actionContainer && path.progress > 0) {
        actionContainer.innerHTML = `
            <button class="continue-btn" onclick="continuePath('${pathId}')">
                <i class="fas fa-play"></i>
                继续学习
            </button>
            <button class="path-detail-btn" onclick="showPathDetail('${pathId}')">
                <i class="fas fa-info-circle"></i>
                查看详情
            </button>
        `;
    }
}

// 模拟学习进度
function simulateLearningProgress(pathCard, pathId) {
    const path = LearningState.paths[pathId];
    const progressBar = pathCard.querySelector('.progress-fill');
    const progressText = pathCard.querySelector('.progress-text');
    
    // 增加进度
    const increment = 100 / path.totalLessons;
    const newProgress = Math.min(path.progress + increment, 100);
    const newCompletedLessons = Math.floor((newProgress / 100) * path.totalLessons);
    
    // 更新状态
    LearningState.paths[pathId].progress = newProgress;
    LearningState.paths[pathId].completedLessons = newCompletedLessons;
    
    // 动画更新UI
    progressBar.style.transition = 'width 1s ease-out';
    progressBar.style.width = newProgress + '%';
    
    setTimeout(() => {
        if (newProgress >= 100) {
            progressText.textContent = '已完成';
            pathCard.classList.add('completed');
            showToast('🎉 恭喜！学习路径已完成！', 'success');
            
            // 解锁新内容
            unlockNewContent();
            
            // 更新用户经验
            gainExperience(100);
        } else {
            progressText.textContent = `${newCompletedLessons}/${path.totalLessons} 课程完成`;
        }
    }, 1000);
}

// 课程操作
function filterCourses(level = 'all') {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const courseLevel = card.dataset.level;
        
        if (level === 'all' || courseLevel === level) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 100);
        } else {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    trackLearningActivity('course_filter', level);
}

function startCourse(courseId) {
    const course = LearningState.courses[courseId];
    
    if (!course) {
        showToast('课程不存在', 'error');
        return;
    }
    
    if (course.completed) {
        showToast('该课程已完成，是否重新学习？', 'info');
        return;
    }
    
    showToast(`开始课程: ${getCourseName(courseId)}`, 'success');
    trackLearningActivity('course_start', courseId);
    
    // 显示课程学习界面
    showCoursePlayerModal(courseId);
}

// 显示课程播放器模态框
function showCoursePlayerModal(courseId) {
    const course = LearningState.courses[courseId];
    const courseName = getCourseName(courseId);
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'course-modal';
    modal.innerHTML = `
        <div class="course-modal-content">
            <div class="course-modal-header">
                <h3><i class="fas fa-play-circle"></i> ${courseName}</h3>
                <button class="close-modal" onclick="closeCourseModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="course-modal-body">
                <div class="course-video-placeholder">
                    <div class="video-player">
                        <div class="video-controls">
                            <button class="play-btn" onclick="toggleCourseVideo()">
                                <i class="fas fa-play"></i>
                            </button>
                            <div class="video-progress">
                                <div class="video-progress-bar">
                                    <div class="video-progress-fill" style="width: ${course.progress}%"></div>
                                </div>
                                <span class="video-time">${Math.floor(course.duration * course.progress / 100)}:00 / ${course.duration}:00</span>
                            </div>
                            <button class="fullscreen-btn">
                                <i class="fas fa-expand"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="course-notes">
                    <h4>课程笔记</h4>
                    <textarea placeholder="在这里记录您的学习笔记..."></textarea>
                </div>
            </div>
            <div class="course-modal-footer">
                <button class="btn-secondary" onclick="pauseCourse('${courseId}')">
                    <i class="fas fa-pause"></i> 暂停学习
                </button>
                <button class="btn-primary" onclick="completeCourse('${courseId}')">
                    <i class="fas fa-check"></i> 完成课程
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加显示动画
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // 模拟视频播放
    simulateVideoProgress(courseId);
}

// 模拟视频播放进度
function simulateVideoProgress(courseId) {
    const progressBar = document.querySelector('.video-progress-fill');
    const timeDisplay = document.querySelector('.video-time');
    const course = LearningState.courses[courseId];
    
    let currentProgress = course.progress;
    
    const progressInterval = setInterval(() => {
        currentProgress += 2;
        
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(progressInterval);
            showToast('课程播放完成！', 'success');
        }
        
        // 更新进度条
        if (progressBar) {
            progressBar.style.width = currentProgress + '%';
        }
        
        // 更新时间显示
        if (timeDisplay) {
            const currentTime = Math.floor(course.duration * currentProgress / 100);
            timeDisplay.textContent = `${currentTime}:00 / ${course.duration}:00`;
        }
        
        // 更新课程状态
        LearningState.courses[courseId].progress = currentProgress;
        
    }, 1000);
}

// 学习记录操作
function viewAllHistory() {
    showToast('正在加载完整学习记录...', 'info');
    trackLearningActivity('navigation', 'view_all_history');
    
    setTimeout(() => {
        showToast('学习记录加载完成', 'success');
    }, 1000);
}

function continueLesson(lessonId) {
    showToast(`继续学习: ${getLessonName(lessonId)}`, 'success');
    trackLearningActivity('lesson_continue', lessonId);
    
    // 模拟继续学习
    const historyItem = event.target.closest('.history-item');
    const progressBar = historyItem.querySelector('.progress-fill');
    const progressText = historyItem.querySelector('.progress-text');
    
    let currentProgress = parseInt(progressBar.style.width);
    const targetProgress = Math.min(currentProgress + 25, 100);
    
    // 动画更新进度
    progressBar.style.transition = 'width 1.5s ease-out';
    progressBar.style.width = targetProgress + '%';
    progressText.textContent = targetProgress + '%';
    
    if (targetProgress >= 100) {
        setTimeout(() => {
        historyItem.classList.add('completed');
            progressText.innerHTML = '<div class="completion-badge"><i class="fas fa-check"></i> 已完成</div>';
            showToast('课程完成！', 'success');
            gainExperience(50);
        }, 1500);
    }
}

function reviewLesson(lessonId) {
    showToast(`开始复习: ${getLessonName(lessonId)}`, 'success');
    trackLearningActivity('lesson_review', lessonId);
    
    // 显示复习界面
    showReviewModal(lessonId);
}

// 测试操作
function startQuiz(quizId) {
    const quiz = LearningState.quizzes[quizId];
    
    if (!quiz || !quiz.unlocked) {
        showToast('该测试暂未解锁', 'warning');
        return;
    }
    
    showToast(`开始测试: ${getQuizName(quizId)}`, 'success');
    trackLearningActivity('quiz_start', quizId);
    
    // 显示测试界面
    showQuizModal(quizId);
}

// 显示测试模态框
function showQuizModal(quizId) {
    const quiz = LearningState.quizzes[quizId];
    const quizName = getQuizName(quizId);
    
    const modal = document.createElement('div');
    modal.className = 'quiz-modal';
    modal.innerHTML = `
        <div class="quiz-modal-content">
            <div class="quiz-modal-header">
                <h3><i class="fas fa-brain"></i> ${quizName}</h3>
                <div class="quiz-timer">
                    <i class="fas fa-clock"></i>
                    <span id="quizTimer">15:00</span>
                </div>
                <button class="close-modal" onclick="closeQuizModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="quiz-modal-body">
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 5%"></div>
                    </div>
                    <span class="question-counter">第 1 题 / 20 题</span>
                </div>
                <div class="quiz-question">
                    <h4>什么是DAO（去中心化自治组织）的核心特征？</h4>
                    <div class="quiz-options">
                        <label class="quiz-option">
                            <input type="radio" name="question1" value="a">
                            <span>A. 中心化管理</span>
                        </label>
                        <label class="quiz-option">
                            <input type="radio" name="question1" value="b">
                            <span>B. 智能合约自动执行</span>
                        </label>
                        <label class="quiz-option">
                            <input type="radio" name="question1" value="c">
                            <span>C. 传统公司结构</span>
                        </label>
                        <label class="quiz-option">
                            <input type="radio" name="question1" value="d">
                            <span>D. 政府监管</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="quiz-modal-footer">
                <button class="btn-secondary" onclick="exitQuiz('${quizId}')">
                    <i class="fas fa-arrow-left"></i> 退出测试
                </button>
                <div class="quiz-footer-right">
                    <button class="btn-secondary" onclick="pauseQuiz('${quizId}')">
                        <i class="fas fa-pause"></i> 暂停
                    </button>
                    <button class="btn-primary" onclick="nextQuestion()">
                        <i class="fas fa-arrow-right"></i> 下一题
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // 启动计时器
    startQuizTimer(15 * 60); // 15分钟
    
    // 添加ESC键关闭功能
    const handleEscKey = (e) => {
        if (e.key === 'Escape') {
            exitQuiz(quizId);
            document.removeEventListener('keydown', handleEscKey);
        }
    };
    document.addEventListener('keydown', handleEscKey);
}

// 测试计时器
function startQuizTimer(seconds) {
    const timerElement = document.getElementById('quizTimer');
    
    // 清除之前的计时器
    if (window.currentQuizTimer) {
        clearInterval(window.currentQuizTimer);
    }
    
    window.currentQuizTimer = setInterval(() => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            
            // 时间不足5分钟时变红
            if (seconds <= 300) {
                timerElement.style.color = '#ef4444';
            }
        }
        
        if (seconds <= 0) {
            clearInterval(window.currentQuizTimer);
            showToast('时间到！自动提交测试', 'warning');
            submitQuiz();
        }
        
        seconds--;
    }, 1000);
}

// 退出测试
function exitQuiz(quizId) {
    // 显示确认对话框
    if (confirm('确定要退出测试吗？当前进度将不会保存。')) {
        // 清除计时器
        if (window.currentQuizTimer) {
            clearInterval(window.currentQuizTimer);
            window.currentQuizTimer = null;
        }
        
        // 关闭模态框
        closeQuizModal();
        
        // 显示提示
        showToast('已退出测试', 'info');
        
        // 记录活动
        trackLearningActivity('quiz_exit', quizId);
    }
}

// 暂停测试
function pauseQuiz(quizId) {
    // 清除计时器
    if (window.currentQuizTimer) {
        clearInterval(window.currentQuizTimer);
        window.currentQuizTimer = null;
    }
    
    // 显示暂停提示
    const modal = document.querySelector('.quiz-modal');
    if (modal) {
        const pauseOverlay = document.createElement('div');
        pauseOverlay.className = 'quiz-pause-overlay';
        pauseOverlay.innerHTML = `
            <div class="pause-content">
                <i class="fas fa-pause-circle"></i>
                <h3>测试已暂停</h3>
                <p>点击继续按钮恢复测试</p>
                <div class="pause-actions">
                    <button class="btn-secondary" onclick="exitQuiz('${quizId}')">
                        <i class="fas fa-times"></i> 退出测试
                    </button>
                    <button class="btn-primary" onclick="resumeQuiz('${quizId}')">
                        <i class="fas fa-play"></i> 继续测试
                    </button>
                </div>
            </div>
        `;
        
        modal.appendChild(pauseOverlay);
    }
    
    showToast('测试已暂停', 'info');
    trackLearningActivity('quiz_pause', quizId);
}

// 恢复测试
function resumeQuiz(quizId) {
    const pauseOverlay = document.querySelector('.quiz-pause-overlay');
    if (pauseOverlay) {
        pauseOverlay.remove();
    }
    
    // 恢复计时器（这里简化为重新开始15分钟，实际应该保存剩余时间）
    startQuizTimer(15 * 60);
    
    showToast('测试已恢复', 'success');
    trackLearningActivity('quiz_resume', quizId);
}

// 下一题
function nextQuestion() {
    // 检查是否选择了答案
    const selectedOption = document.querySelector('input[name="question1"]:checked');
    if (!selectedOption) {
        showToast('请选择一个答案', 'warning');
        return;
    }
    
    // 模拟进入下一题
    const progressBar = document.querySelector('.quiz-progress .progress-fill');
    const questionCounter = document.querySelector('.question-counter');
    
    if (progressBar && questionCounter) {
        // 更新进度
        const currentProgress = parseInt(progressBar.style.width) || 5;
        const newProgress = Math.min(currentProgress + 5, 100);
        progressBar.style.width = newProgress + '%';
        
        // 更新题目计数
        const currentQuestion = Math.floor(newProgress / 5);
        questionCounter.textContent = `第 ${currentQuestion} 题 / 20 题`;
        
        if (newProgress >= 100) {
            // 测试完成
            completeQuiz();
        } else {
            // 模拟加载下一题
            loadNextQuestion(currentQuestion);
        }
    }
    
    trackLearningActivity('quiz_next_question', selectedOption.value);
}

// 加载下一题
function loadNextQuestion(questionNumber) {
    const questions = [
        {
            question: "什么是DAO（去中心化自治组织）的核心特征？",
            options: ["A. 中心化管理", "B. 智能合约自动执行", "C. 传统公司结构", "D. 政府监管"]
        },
        {
            question: "在DAO治理中，代币持有者的主要权利是什么？",
            options: ["A. 获得分红", "B. 参与投票决策", "C. 免费使用服务", "D. 优先购买权"]
        },
        {
            question: "智能合约在DAO中的作用是什么？",
            options: ["A. 存储数据", "B. 自动执行治理决策", "C. 提供客服", "D. 管理用户账户"]
        },
        {
            question: "DAO的投票机制通常基于什么？",
            options: ["A. 一人一票", "B. 代币权重", "C. 随机选择", "D. 管理员决定"]
        }
    ];
    
    const questionData = questions[questionNumber % questions.length];
    const questionContainer = document.querySelector('.quiz-question');
    
    if (questionContainer && questionData) {
        questionContainer.innerHTML = `
            <h4>${questionData.question}</h4>
            <div class="quiz-options">
                ${questionData.options.map((option, index) => `
                    <label class="quiz-option">
                        <input type="radio" name="question${questionNumber}" value="${String.fromCharCode(97 + index)}">
                        <span>${option}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }
}

// 完成测试
function completeQuiz() {
    // 清除计时器
    if (window.currentQuizTimer) {
        clearInterval(window.currentQuizTimer);
        window.currentQuizTimer = null;
    }
    
    // 计算分数（模拟）
    const score = Math.floor(Math.random() * 20) + 80; // 80-100分
    
    // 更新测试记录
    LearningState.quizzes['dao-basics-quiz'].attempts += 1;
    LearningState.quizzes['dao-basics-quiz'].bestScore = Math.max(
        LearningState.quizzes['dao-basics-quiz'].bestScore,
        score
    );
    
    // 显示结果
    const modal = document.querySelector('.quiz-modal-content');
    if (modal) {
        modal.innerHTML = `
            <div class="quiz-result-header">
                <h3><i class="fas fa-trophy"></i> 测试完成！</h3>
                <button class="close-modal" onclick="closeQuizModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="quiz-result-body">
                <div class="result-score">
                    <div class="score-circle">
                        <span class="score-value">${score}</span>
                        <span class="score-label">分</span>
                    </div>
                </div>
                <div class="result-details">
                    <div class="result-item">
                        <i class="fas fa-check-circle"></i>
                        <span>正确答题：${Math.floor(score/5)} / 20</span>
                    </div>
                    <div class="result-item">
                        <i class="fas fa-clock"></i>
                        <span>用时：${15 - Math.floor(Math.random() * 5)} 分钟</span>
                    </div>
                    <div class="result-item">
                        <i class="fas fa-medal"></i>
                        <span>历史最佳：${LearningState.quizzes['dao-basics-quiz'].bestScore} 分</span>
                    </div>
                </div>
                <div class="result-feedback">
                    <h4>评价反馈</h4>
                    <p>${score >= 90 ? '优秀！您对DAO治理有很好的理解。' : 
                         score >= 80 ? '良好！建议继续深入学习相关概念。' : 
                         '需要加强学习，建议重新复习课程内容。'}</p>
                </div>
            </div>
            <div class="quiz-result-footer">
                <button class="btn-secondary" onclick="retakeQuiz()">
                    <i class="fas fa-redo"></i> 重新测试
                </button>
                <button class="btn-primary" onclick="closeQuizModal()">
                    <i class="fas fa-check"></i> 完成
                </button>
            </div>
        `;
    }
    
    // 获得经验值
    gainExperience(score);
    
    showToast(`测试完成！获得 ${score} 分`, 'success');
    trackLearningActivity('quiz_complete', { score, quizId: 'dao-basics-quiz' });
}

// 重新测试
function retakeQuiz() {
    closeQuizModal();
    setTimeout(() => {
        startQuiz('dao-basics-quiz');
    }, 300);
}

// 提交测试（时间到时调用）
function submitQuiz() {
    showToast('时间到，自动提交测试...', 'warning');
        setTimeout(() => {
        completeQuiz();
    }, 1000);
}

// 工具函数
function getPathName(pathId) {
    const pathNames = {
        'dao-basics': 'DAO治理基础入门',
        'tokenomics': '代币经济学进阶',
        'smart-contract-security': '智能合约安全'
    };
    return pathNames[pathId] || pathId;
}

function getCourseName(courseId) {
    const courseNames = {
        'dao-intro': '什么是DAO治理？',
        'proposal-voting': '提案创建与投票机制',
        'wallet-security': '钱包安全与最佳实践'
    };
    return courseNames[courseId] || courseId;
}

function getLessonName(lessonId) {
    const lessonNames = {
        'dao-basics-5': 'DAO治理基础 - 第5章：投票权重计算',
        'dao-basics-4': 'DAO治理基础 - 第4章：提案生命周期',
        'wallet-security-3': '钱包安全与最佳实践 - 第3章：私钥管理'
    };
    return lessonNames[lessonId] || lessonId;
}

function getQuizName(quizId) {
    const quizNames = {
        'dao-basics-quiz': 'DAO基础知识测试',
        'tokenomics-quiz': '代币经济学测试'
    };
    return quizNames[quizId] || quizId;
}

// 经验值系统
function gainExperience(amount) {
    LearningState.user.experience += amount;
    
    // 检查是否升级
    if (LearningState.user.experience >= LearningState.user.nextLevelExp) {
        levelUp();
    }
    
    showToast(`获得 ${amount} 经验值！`, 'success');
    updateLevelProgress();
}

function levelUp() {
    const currentLevel = LearningState.user.level;
    const levelProgression = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentIndex = levelProgression.indexOf(currentLevel);
    
    if (currentIndex < levelProgression.length - 1) {
        LearningState.user.level = levelProgression[currentIndex + 1];
        LearningState.user.nextLevelExp *= 2;
        
        showToast('🎉 恭喜升级！', 'success');
        unlockNewContent();
    }
}

function updateLevelProgress() {
    const progressBar = document.querySelector('.level-progress .progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText) {
        const currentExp = LearningState.user.experience;
        const nextLevelExp = LearningState.user.nextLevelExp;
        const progressPercent = (currentExp / nextLevelExp) * 100;
        
        progressBar.style.width = progressPercent + '%';
        progressText.textContent = `${Math.floor(progressPercent)}% 进阶下一级`;
    }
}

// 解锁新内容
function unlockNewContent() {
    const userLevel = LearningState.user.level;
    
    // 根据等级解锁内容
    if (userLevel === 'intermediate') {
        LearningState.paths['smart-contract-security'].locked = false;
        LearningState.quizzes['tokenomics-quiz'].unlocked = true;
        showToast('🔓 解锁新内容：智能合约安全课程', 'success');
    }
    
    checkUnlockedContent();
}

// 学习活动追踪
function trackLearningActivity(action, data) {
    const activity = {
        timestamp: new Date().toISOString(),
        action: action,
        data: data,
        user: LearningState.user.level
    };
    
    console.log('📊 学习活动追踪:', activity);
    
    // 这里可以发送到分析服务
    // analytics.track(activity);
}

// 自动保存学习进度
function autoSaveLearningProgress() {
    console.log('💾 自动保存学习进度...');
    
    // 模拟保存到后端
    setTimeout(() => {
        console.log('✅ 学习进度已保存');
    }, 500);
}

// 关闭模态框函数
function closeCourseModal() {
    const modal = document.querySelector('.course-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function closeQuizModal() {
    const modal = document.querySelector('.quiz-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Toast通知系统
function initializeToastSystem() {
    // 创建Toast容器
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'info', duration = 3000) {
    const container = document.querySelector('.toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
                toast.remove();
        }, 300);
    }, duration);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .path-card.completed {
        border-color: rgba(16, 185, 129, 0.6) !important;
        background: rgba(16, 185, 129, 0.1) !important;
    }
    
    .course-card.in-progress {
        border-color: rgba(59, 130, 246, 0.6) !important;
        background: rgba(59, 130, 246, 0.1) !important;
    }
    
    .quiz-card.in-progress {
        border-color: rgba(236, 72, 153, 0.6) !important;
        background: rgba(236, 72, 153, 0.1) !important;
    }
    
    .history-item.completed {
        background: rgba(16, 185, 129, 0.05) !important;
    }
    
    /* 响应式Toast */
    @media (max-width: 768px) {
        #toast-container {
            left: 20px;
            right: 20px;
            top: 20px;
        }
        
        #toast-container > div {
            min-width: auto;
            width: 100%;
        }
    }
`;
document.head.appendChild(style);

// 全局错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
    showToast('页面出现错误，请刷新重试', 'error');
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // 页面重新可见时刷新数据
        loadUserLearningData();
    }
});

// 键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + R: 刷新学习数据
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        loadUserLearningData();
        showToast('学习数据已刷新', 'success');
    }
    
    // Esc: 关闭所有Toast
    if (e.key === 'Escape') {
        const toasts = document.querySelectorAll('#toast-container > div');
        toasts.forEach(toast => toast.remove());
    }
});

// 导出函数供外部调用
window.LearningPage = {
    showToast,
    loadUserLearningData,
    continuePath,
    startPath,
    startCourse,
    continueLesson,
    reviewLesson,
    startQuiz,
    filterCourses,
    viewAllPaths,
    viewAllHistory
}; 