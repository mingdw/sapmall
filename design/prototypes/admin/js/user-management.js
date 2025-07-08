// 用户管理页面 JS

// 模拟数据（实际应由后端API获取）
const users = [
  {
    id: 'U001', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=80&fit=crop',
    nickname: 'Alice', wallet: '0x1234...abcd', role: 'user', status: 'active', kyc: 'approved',
    sap: '1,200', reg: '2024-01-01', last: '2024-06-01',
  },
  {
    id: 'U002', avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=80&h=80&fit=crop',
    nickname: 'Bob', wallet: '0x5678...efgh', role: 'merchant', status: 'pending', kyc: 'pending',
    sap: '8,500', reg: '2024-02-15', last: '2024-06-02',
  },
  {
    id: 'U003', avatar: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=80&h=80&fit=crop',
    nickname: 'Carol', wallet: '0x9abc...1234', role: 'admin', status: 'active', kyc: 'approved',
    sap: '15,000', reg: '2024-03-10', last: '2024-06-03',
  },
  {
    id: 'U004', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
    nickname: 'David', wallet: '0xdef0...5678', role: 'user', status: 'disabled', kyc: 'rejected',
    sap: '500', reg: '2024-04-20', last: '2024-05-15',
  },
  {
    id: 'U005', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
    nickname: 'Emma', wallet: '0x2468...acef', role: 'merchant', status: 'active', kyc: 'approved',
    sap: '12,800', reg: '2024-05-05', last: '2024-06-04',
  },
];

// KYC申请数据
const kycApplications = {
  pending: [
    {
      id: 'KYC001', name: '张三', wallet: '0x1234...abcd', certType: '身份证', certNumber: '110101199001011234',
      applyTime: '2024-06-01 10:30:00', riskLevel: 'low', status: 'pending'
    },
    {
      id: 'KYC002', name: '李四', wallet: '0x5678...efgh', certType: '护照', certNumber: 'E12345678',
      applyTime: '2024-06-02 14:20:00', riskLevel: 'medium', status: 'pending'
    },
    {
      id: 'KYC003', name: '王五', wallet: '0x9abc...1234', certType: '身份证', certNumber: '320101199203033456',
      applyTime: '2024-06-03 09:15:00', riskLevel: 'low', status: 'pending'
    }
  ],
  reviewed: [
    {
      id: 'KYC004', name: '赵六', wallet: '0xdef0...5678', certType: '身份证', certNumber: '440101199505055678',
      applyTime: '2024-05-30 16:45:00', riskLevel: 'low', status: 'approved'
    },
    {
      id: 'KYC005', name: '钱七', wallet: '0x2468...acef', certType: '护照', certNumber: 'G87654321',
      applyTime: '2024-05-29 11:20:00', riskLevel: 'high', status: 'rejected'
    }
  ]
};

// 角色数据
const roles = [
  { id: 1, name: '超级管理员', code: 'SUPER_ADMIN', status: 'active', description: '系统最高权限管理员', userCount: 2 },
  { id: 2, name: '普通管理员', code: 'ADMIN', status: 'active', description: '普通系统管理员', userCount: 5 },
  { id: 3, name: '商家管理员', code: 'MERCHANT_ADMIN', status: 'active', description: '商家端管理员', userCount: 12 },
  { id: 4, name: '客服人员', code: 'CUSTOMER_SERVICE', status: 'active', description: '客服人员', userCount: 8 },
  { id: 5, name: '财务人员', code: 'FINANCE', status: 'inactive', description: '财务相关人员', userCount: 3 }
];

// 全局变量
let currentTab = 'user-list', currentPage = 1, pageSize = 20, filteredUsers = users, selectedUsers = new Set();
let currentKYCTab = 'pending', currentKYCPage = 1, kycPageSize = 10;
let currentRolePage = 1, rolePageSize = 10;

// 标签映射
const labels = {
  role: { user: '普通用户', merchant: '商家用户', admin: '管理员' },
  status: { active: '正常', disabled: '已禁用', pending: '待审核' },
  kyc: { unverified: '未认证', pending: '审核中', approved: '已通过', rejected: '已拒绝' }
};

// 工具函数
const getLabel = (type, value) => labels[type][value] || value;
const showModal = (id) => document.getElementById(id).classList.add('show');
const hideModal = (id) => document.getElementById(id).classList.remove('show');

// 功能切换
function switchToFunction(functionId) {
  document.querySelectorAll('.quick-action-card').forEach(card => card.classList.remove('active'));
  document.querySelector(`.quick-action-card[data-function="${functionId}"]`)?.classList.add('active');
  
  document.querySelectorAll('.function-content').forEach(content => {
    content.classList.remove('active');
    content.style.display = 'none';
  });
  
  const targetContent = document.getElementById(functionId + '-function');
  if (targetContent) {
    targetContent.classList.add('active');
    targetContent.style.display = 'block';
  }
  
  currentTab = functionId;
  
  // 初始化对应功能
  const initFunctions = {
    'kyc-review': initKYCReview,
    'permissions': loadRoles
  };
  initFunctions[functionId]?.();
}

// 用户管理相关函数
function refreshUserStats() { console.log('刷新用户统计数据'); }
function exportUserReport() { console.log('导出用户报告'); }

function initFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      applyFilters();
    });
  });
}

function renderUserList() {
  const userList = document.getElementById('userList');
  if (!userList) return;
  
  userList.innerHTML = '';
  
  if (filteredUsers.length === 0) {
    document.getElementById('emptyState').style.display = 'flex';
    return;
  }
  
  document.getElementById('emptyState').style.display = 'none';
  
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, filteredUsers.length);
  
  for (let i = start; i < end; i++) {
    const user = filteredUsers[i];
    const userItem = document.createElement('div');
    userItem.className = 'user-item';
    userItem.innerHTML = `
      <div class="user-checkbox">
        <input type="checkbox" onchange="toggleUserSelection('${user.id}')" ${selectedUsers.has(user.id) ? 'checked' : ''}>
      </div>
      <div class="user-info">
        <img class="user-avatar" src="${user.avatar}" alt="avatar">
        <div class="user-details">
          <div class="user-name">${user.nickname}</div>
          <div class="user-wallet">${user.wallet}</div>
          <div class="user-id">${user.id}</div>
        </div>
      </div>
      <div class="user-role">${getLabel('role', user.role)}</div>
      <div class="user-status">
        <span class="status-badge status-${user.status}">${getLabel('status', user.status)}</span>
      </div>
      <div class="user-kyc">
        <span class="kyc-badge kyc-${user.kyc}">${getLabel('kyc', user.kyc)}</span>
      </div>
      <div class="user-assets">${user.sap} SAP</div>
      <div class="user-register">${user.reg}</div>
      <div class="user-active">${user.last}</div>
      <div class="user-actions">
        <button class="action-btn-icon" onclick="showUserDetail('${user.id}')" title="查看详情">
          <i class="fas fa-eye"></i>查看
        </button>
        <button class="action-btn-icon edit" onclick="editUser('${user.id}')" title="编辑用户">
          <i class="fas fa-edit"></i>编辑
        </button>
        <button class="action-btn-icon danger" onclick="confirmDisable('${user.id}')" title="禁用用户">
          <i class="fas fa-ban"></i>禁用
        </button>
      </div>
    `;
    userList.appendChild(userItem);
  }
  
  updatePaginationInfo();
}

function applyFilters() {
  const search = document.getElementById('userSearch').value.trim().toLowerCase();
  const roleFilter = document.querySelector('.filter-btn.active').dataset.role;
  const status = document.getElementById('statusFilter').value;
  const kyc = document.getElementById('kycFilter').value;
  
  filteredUsers = users.filter(user => {
    const searchMatch = !search || 
      user.nickname.toLowerCase().includes(search) || 
      user.wallet.toLowerCase().includes(search) || 
      user.id.toLowerCase().includes(search);
    
    const roleMatch = roleFilter === 'all' || user.role === roleFilter;
    const statusMatch = !status || user.status === status;
    const kycMatch = !kyc || user.kyc === kyc;
    
    return searchMatch && roleMatch && statusMatch && kycMatch;
  });
  
  currentPage = 1;
  renderUserList();
}

function toggleUserSelection(userId) {
  if (selectedUsers.has(userId)) {
    selectedUsers.delete(userId);
  } else {
    selectedUsers.add(userId);
  }
  updateBatchToolbar();
}

function toggleSelectAll() {
  const selectAll = document.getElementById('selectAll');
  const checkboxes = document.querySelectorAll('.user-item input[type="checkbox"]');
  
  checkboxes.forEach(checkbox => {
    checkbox.checked = selectAll.checked;
    const userId = checkbox.getAttribute('onchange').match(/'([^']+)'/)[1];
    if (selectAll.checked) {
      selectedUsers.add(userId);
    } else {
      selectedUsers.delete(userId);
    }
  });
  
  updateBatchToolbar();
}

function updateBatchToolbar() {
  const batchActions = document.getElementById('batchActions');
  const selectedCount = document.getElementById('selectedCount');
  
  if (selectedUsers.size > 0) {
    batchActions.style.display = 'flex';
    selectedCount.textContent = selectedUsers.size;
  } else {
    batchActions.style.display = 'none';
  }
}

function clearUserSelection() {
  selectedUsers.clear();
  document.getElementById('selectAll').checked = false;
  document.querySelectorAll('.user-item input[type="checkbox"]').forEach(cb => cb.checked = false);
  updateBatchToolbar();
}

function batchOperation(action) {
  if (selectedUsers.size === 0) {
    alert('请先选择用户');
    return;
  }
  
  const actionText = action === 'enable' ? '启用' : '禁用';
  if (confirm(`确定要${actionText}选中的 ${selectedUsers.size} 个用户吗？`)) {
    console.log(`${actionText}用户:`, Array.from(selectedUsers));
    clearUserSelection();
  }
}

function batchEnableUsers() { batchOperation('enable'); }
function batchDisableUsers() { batchOperation('disable'); }

function updatePaginationInfo() {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, filteredUsers.length);
  
  document.getElementById('startIndex').textContent = start;
  document.getElementById('endIndex').textContent = end;
  document.getElementById('totalItems').textContent = filteredUsers.length;
}

function goToPage(page) {
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  
  if (page === 'prev') page = Math.max(1, currentPage - 1);
  else if (page === 'next') page = Math.min(totalPages, currentPage + 1);
  else if (page === 'last') page = totalPages;
  
  if (page >= 1 && page <= totalPages && page !== currentPage) {
    currentPage = page;
    renderUserList();
  }
}

function changePageSize() {
  pageSize = parseInt(document.getElementById('pageSize').value);
  currentPage = 1;
  renderUserList();
}

// 用户详情模态框
function showUserDetail(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;
  
  const modalBody = document.querySelector('#userDetailModal .modal-body');
  modalBody.innerHTML = `
    <div class="user-profile-header">
      <img class="user-profile-avatar" src="${user.avatar}" alt="avatar">
      <div class="user-profile-info">
        <h4>${user.nickname}</h4>
        <div class="user-profile-wallet">${user.wallet}</div>
        <div class="user-profile-id">用户ID: ${user.id}</div>
      </div>
    </div>
    <div class="user-details-grid">
      <div class="detail-card">
        <h5><i class="fas fa-user-tag"></i> 基本信息</h5>
        <div class="detail-item">
          <span class="detail-label">用户角色:</span>
          <span class="detail-value">${getLabel('role', user.role)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">账户状态:</span>
          <span class="detail-value">${getLabel('status', user.status)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">KYC状态:</span>
          <span class="detail-value">${getLabel('kyc', user.kyc)}</span>
        </div>
      </div>
      <div class="detail-card">
        <h5><i class="fas fa-coins"></i> 资产信息</h5>
        <div class="detail-item">
          <span class="detail-label">SAP余额:</span>
          <span class="detail-value">${user.sap} SAP</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">注册时间:</span>
          <span class="detail-value">${user.reg}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">最后活跃:</span>
          <span class="detail-value">${user.last}</span>
        </div>
      </div>
      <div class="detail-card">
        <h5><i class="fas fa-chart-line"></i> 活动统计</h5>
        <div class="detail-item">
          <span class="detail-label">登录次数:</span>
          <span class="detail-value">156次</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">交易次数:</span>
          <span class="detail-value">89次</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">活跃天数:</span>
          <span class="detail-value">45天</span>
        </div>
      </div>
    </div>
  `;
  
  showModal('userDetailModal');
}

function closeUserDetailModal() { hideModal('userDetailModal'); }

function confirmDisable(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;
  
  document.getElementById('confirmMessage').textContent = `确定要禁用用户 "${user.nickname}" 吗？`;
  document.getElementById('confirmExecuteBtn').onclick = () => {
    console.log('禁用用户:', id);
    hideModal('confirmModal');
  };
  
  showModal('confirmModal');
}

function closeConfirmModal() { hideModal('confirmModal'); }

function executeConfirmAction() {
  const password = document.getElementById('adminPassword').value;
  if (!password) {
    alert('请输入管理员密码');
    return;
  }
  
  console.log('执行确认操作，密码:', password);
  hideModal('confirmModal');
  document.getElementById('adminPassword').value = '';
}

// 初始化用户管理
function initUserManagement() {
  initFilterButtons();
  renderUserList();
  
  // 搜索框事件
  document.getElementById('userSearch').addEventListener('input', applyFilters);
  document.getElementById('statusFilter').addEventListener('change', applyFilters);
  document.getElementById('kycFilter').addEventListener('change', applyFilters);
  
  // 模态框关闭事件
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.modal').classList.remove('show');
    });
  });
  
  // 点击模态框背景关闭
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) this.classList.remove('show');
    });
  });
}

// 角色管理相关函数
function showRoleAddEditModal(mode = 'add', roleId = null) {
  const modal = document.getElementById('roleAddEditModal');
  const title = document.getElementById('roleAddEditTitle');
  const form = document.getElementById('roleForm');
  
  title.innerHTML = `<i class="fas fa-user-tag"></i> ${mode === 'add' ? '添加角色' : '编辑角色'}`;
  
  if (mode === 'edit' && roleId) {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      document.getElementById('roleName').value = role.name;
      document.getElementById('roleCode').value = role.code;
      document.getElementById('roleStatus').value = role.status;
      document.getElementById('roleDescription').value = role.description;
    }
  } else {
    form.reset();
  }
  
  renderAllMenusForRoleAssign();
  modal.classList.add('show');
}

function closeRoleAddEditModal() { hideModal('roleAddEditModal'); }

function saveRole() {
  const formData = new FormData(document.getElementById('roleForm'));
  const roleData = Object.fromEntries(formData.entries());
  
  if (!roleData.roleName || !roleData.roleCode) {
    alert('请填写必填字段');
    return;
  }
  
  console.log('保存角色:', roleData);
  console.log('选中的权限:', getSelectedPermissions());
  
  hideModal('roleAddEditModal');
  loadRoles();
}

function saveRoleDraft() { console.log('保存角色草稿'); }

function getSelectedPermissions() {
  const permissions = [];
  document.querySelectorAll('#menuTreeContainer input[type="checkbox"]:checked').forEach(checkbox => {
    permissions.push(checkbox.value);
  });
  return permissions;
}

function renderAllMenusForRoleAssign() {
  const allMenus = [
    {
      title: '个人中心',
      items: [
        { name: '个人信息', url: 'profile.html', supports: ['查看', '编辑', '开启KYC认证'] },
        { name: '安全设置', url: 'security.html', supports: ['查看', '编辑'] },
        { name: '通知设置', url: 'notifications.html', supports: ['查看', '编辑'] },
      ]
    },
    {
      title: '我的资产',
      items: [
        { name: '账户余额', url: 'balance.html', supports: ['查看'] },
        { name: '质押管理', url: 'staking.html', supports: ['查看', '编辑'] },
        { name: '交易记录', url: 'transactions.html', supports: ['查看'] },
      ]
    },
    {
      title: '交易管理',
      items: [
        { name: '我的订单', url: 'orders.html', supports: ['查看', '编辑'] },
        { name: '我的收货地址', url: 'addresses.html', supports: ['查看', '编辑'] },
        { name: '退款/售后', url: 'refunds.html', supports: ['查看'] },
      ]
    },
    {
      title: 'DAO治理',
      items: [
        { name: '治理概览', url: 'governance-overview.html', supports: ['查看'] },
        { name: '提案管理', url: 'user-proposals.html', supports: ['查看', '编辑'] },
        { name: '社区参与', url: 'user-community.html', supports: ['查看'] },
        { name: '治理学习', url: 'governance-learn.html', supports: ['查看'] },
      ]
    },
  ];
  const container = document.getElementById('menuTreeContainer');
  container.innerHTML = '';
  allMenus.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'menu-group-title';
    groupDiv.textContent = group.title;
    container.appendChild(groupDiv);
    group.items.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'menu-item-row';
      // 二级菜单前置选择框
      const itemCheckbox = document.createElement('input');
      itemCheckbox.type = 'checkbox';
      itemCheckbox.className = 'menu-item-checkbox';
      itemCheckbox.id = `menuitem_${group.title}_${idx}`;
      row.appendChild(itemCheckbox);
      // 菜单名
      const name = document.createElement('span');
      name.className = 'menu-item-name';
      name.textContent = item.name;
      row.appendChild(name);
      // 权限操作
      const permCheckboxes = [];
      item.supports.forEach((perm, pidx) => {
        const label = document.createElement('label');
        label.className = 'menu-perm-checkbox';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = item.url + ':' + perm;
        cb.className = 'menu-perm-checkbox-input';
        label.appendChild(cb);
        label.appendChild(document.createTextNode(perm));
        row.appendChild(label);
        permCheckboxes.push(cb);
      });
      // 交互：主选择框控制所有权限
      itemCheckbox.addEventListener('change', function() {
        permCheckboxes.forEach(cb => { cb.checked = this.checked; });
      });
      // 交互：权限变动影响主选择框
      permCheckboxes.forEach(cb => {
        cb.addEventListener('change', function() {
          const checkedCount = permCheckboxes.filter(c => c.checked).length;
          if (checkedCount === 0) {
            itemCheckbox.checked = false;
            itemCheckbox.indeterminate = false;
          } else if (checkedCount === permCheckboxes.length) {
            itemCheckbox.checked = true;
            itemCheckbox.indeterminate = false;
          } else {
            itemCheckbox.checked = false;
            itemCheckbox.indeterminate = true;
          }
        });
      });
      container.appendChild(row);
    });
  });
}

function renderRoleTable() {
  const tbody = document.getElementById('roleTableBody');
  if (!tbody) return;
  
  const start = (currentRolePage - 1) * rolePageSize;
  const end = Math.min(start + rolePageSize, roles.length);
  const pageRoles = roles.slice(start, end);
  
  tbody.innerHTML = pageRoles.map(role => `
    <tr>
      <td>${role.name}</td>
      <td>${role.code}</td>
      <td>
        <span class="status-badge status-${role.status === 'active' ? 'enabled' : 'disabled'}">
          ${role.status === 'active' ? '启用' : '禁用'}
        </span>
      </td>
      <td>${role.description}</td>
      <td class="text-center">
        <button class="btn btn-xs btn-primary" onclick="showRoleAddEditModal('edit', ${role.id})">
          <i class="fas fa-edit"></i> 编辑
        </button>
        <button class="btn btn-xs btn-outline" onclick="viewRoleDetail(${role.id})">
          <i class="fas fa-eye"></i> 查看
        </button>
        <button class="btn btn-xs btn-danger" onclick="deleteRole(${role.id})">
          <i class="fas fa-trash"></i> 删除
        </button>
      </td>
    </tr>
  `).join('');
  
  updateRolePaginationInfo(start + 1, end, roles.length);
  updateRolePagination();
}

function addNewRole() { showRoleAddEditModal('add'); }

function deleteRole(roleId) {
  if (confirm('确定要删除这个角色吗？')) {
    console.log('删除角色:', roleId);
    loadRoles();
  }
}

function updateRolePaginationInfo(start, end, total) {
  console.log(`角色分页: ${start}-${end}/${total}`);
}

function updateRolePagination() {
  const totalPages = Math.ceil(roles.length / rolePageSize);
  const pagination = document.getElementById('rolePagination');
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  let paginationHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <button class="pagination-btn ${i === currentRolePage ? 'active' : ''}" 
              onclick="goToRolePage(${i})">${i}</button>
    `;
  }
  
  pagination.innerHTML = paginationHTML;
}

function loadRoles() {
  renderRoleTable();
}

// 其他功能函数
function editUser(id) { console.log('编辑用户:', id); }
function exportUserData() { console.log('导出用户数据'); }
function editUserProfile() { console.log('编辑用户资料'); }
function saveSettings() { console.log('保存设置'); }

// 通知相关函数
function updateNotifyPreview() {
  const title = document.getElementById('notifyTitle').value || '通知标题预览';
  const content = document.getElementById('notifyContent').value || '通知内容预览';
  const type = document.getElementById('notifyType').value;
  
  const preview = document.getElementById('notifyPreview');
  preview.innerHTML = `
    <div class="preview-title">${title}</div>
    <div class="preview-message">${content}</div>
  `;
  
  preview.className = `preview-content preview-${type}`;
}

function previewNotify() { console.log('预览通知'); }

function sendBatchNotify() {
  const title = document.getElementById('notifyTitle').value;
  const content = document.getElementById('notifyContent').value;
  
  if (!title || !content) {
    alert('请填写通知标题和内容');
    return;
  }
  
  console.log('发送批量通知:', { title, content, users: Array.from(selectedUsers) });
  hideModal('batchNotifyModal');
}

function closeBatchNotifyModal() { hideModal('batchNotifyModal'); }

function batchNotifyUsers() {
  if (selectedUsers.size === 0) {
    alert('请先选择用户');
    return;
  }
  
  document.getElementById('notifyTitle').value = '';
  document.getElementById('notifyContent').value = '';
  document.getElementById('notifyType').value = 'info';
  updateNotifyPreview();
  showModal('batchNotifyModal');
}

// KYC相关函数
function viewKYCDetail(id) {
  const application = [...kycApplications.pending, ...kycApplications.reviewed].find(app => app.id === id);
  if (!application) return;
  
  const modalBody = document.querySelector('#kycDetailModal .modal-body');
  modalBody.innerHTML = `
    <div class="user-profile-header">
      <div class="user-profile-info">
        <h4>${application.name}</h4>
        <div class="user-profile-wallet">${application.wallet}</div>
        <div class="user-profile-id">申请ID: ${application.id}</div>
      </div>
    </div>
    <div class="user-details-grid">
      <div class="detail-card">
        <h5><i class="fas fa-id-card"></i> 证件信息</h5>
        <div class="detail-item">
          <span class="detail-label">证件类型:</span>
          <span class="detail-value">${application.certType}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">证件号码:</span>
          <span class="detail-value">${application.certNumber}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">申请时间:</span>
          <span class="detail-value">${application.applyTime}</span>
        </div>
      </div>
      <div class="detail-card">
        <h5><i class="fas fa-shield-alt"></i> 审核信息</h5>
        <div class="detail-item">
          <span class="detail-label">风险等级:</span>
          <span class="detail-value">
            <span class="risk-badge risk-${application.riskLevel}">
              ${application.riskLevel === 'low' ? '低风险' : application.riskLevel === 'medium' ? '中风险' : '高风险'}
            </span>
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">审核状态:</span>
          <span class="detail-value">
            <span class="kyc-status-badge kyc-${application.status}">
              ${getKYCStatusLabel(application.status)}
            </span>
          </span>
        </div>
      </div>
      <div class="detail-card">
        <h5><i class="fas fa-file-alt"></i> 证件文件</h5>
        <div class="detail-item">
          <span class="detail-label">身份证正面:</span>
          <span class="detail-value">
            <button class="btn btn-xs btn-primary" onclick="viewDocument('front')">
              <i class="fas fa-eye"></i> 查看
            </button>
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">身份证反面:</span>
          <span class="detail-value">
            <button class="btn btn-xs btn-primary" onclick="viewDocument('back')">
              <i class="fas fa-eye"></i> 查看
            </button>
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">手持证件:</span>
          <span class="detail-value">
            <button class="btn btn-xs btn-primary" onclick="viewDocument('selfie')">
              <i class="fas fa-eye"></i> 查看
            </button>
          </span>
        </div>
      </div>
    </div>
  `;
  
  showModal('kycDetailModal');
}

function closeKYCDetailModal() { hideModal('kycDetailModal'); }

function viewDocument(type) { console.log('查看证件:', type); }

function closePermissionEditModal() { hideModal('permissionEditModal'); }

function savePermissions() {
  console.log('保存权限设置');
  hideModal('permissionEditModal');
}

// KYC Tab切换
function switchKYCTab(tab) {
  currentKYCTab = tab;
  currentKYCPage = 1;
  
  document.querySelectorAll('.kyc-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  
  const pendingList = document.getElementById('pendingKYCList');
  const reviewedList = document.getElementById('reviewedKYCList');
  
  if (tab === 'pending') {
    pendingList.style.display = 'block';
    reviewedList.style.display = 'none';
  } else {
    pendingList.style.display = 'none';
    reviewedList.style.display = 'block';
  }
  
  renderKYCList();
}

function renderKYCList() {
  const applications = currentKYCTab === 'pending' ? kycApplications.pending : kycApplications.reviewed;
  const container = document.getElementById(currentKYCTab === 'pending' ? 'pendingKYCList' : 'reviewedKYCList');
  
  if (!container) return;
  
  if (applications.length === 0) {
    document.getElementById('kycEmptyState').style.display = 'flex';
    return;
  }
  
  document.getElementById('kycEmptyState').style.display = 'none';
  
  const start = (currentKYCPage - 1) * kycPageSize;
  const end = Math.min(start + kycPageSize, applications.length);
  const pageApplications = applications.slice(start, end);
  
  container.innerHTML = pageApplications.map(app => `
    <div class="kyc-item">
      <div class="kyc-user-info">
        <div class="kyc-user-details">
          <div class="kyc-name">${app.name}</div>
          <div class="kyc-wallet">${app.wallet}</div>
          <div class="kyc-id">ID: ${app.id}</div>
        </div>
      </div>
      <div class="kyc-cert-info">
        <div class="kyc-cert-type">${app.certType}</div>
        <div class="kyc-cert-number">${app.certNumber}</div>
      </div>
      <div class="kyc-apply-time">
        <div class="kyc-time-main">${app.applyTime.split(' ')[0]}</div>
        <div class="kyc-time-relative">${app.applyTime.split(' ')[1]}</div>
      </div>
      <div class="kyc-risk-level">
        <span class="risk-badge risk-${app.riskLevel}">
          ${app.riskLevel === 'low' ? '低风险' : app.riskLevel === 'medium' ? '中风险' : '高风险'}
        </span>
      </div>
      <div class="kyc-status-cell">
        <span class="kyc-status-badge kyc-${app.status}">
          ${getKYCStatusLabel(app.status)}
        </span>
      </div>
      <div class="kyc-actions">
        <button class="action-btn-icon" onclick="viewKYCDetail('${app.id}')" title="查看详情">
          <i class="fas fa-eye"></i>查看
        </button>
        ${app.status === 'pending' ? `
          <button class="action-btn-icon success" onclick="approveKYC('${app.id}')" title="通过审核">
            <i class="fas fa-check"></i>通过
          </button>
          <button class="action-btn-icon danger" onclick="rejectKYC('${app.id}')" title="拒绝审核">
            <i class="fas fa-times"></i>拒绝
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');
  
  updateKYCPaginationInfo();
}

function getKYCStatusLabel(status) {
  const statusMap = {
    pending: '审核中',
    approved: '已通过',
    rejected: '已拒绝',
    processing: '处理中'
  };
  return statusMap[status] || status;
}

function updateKYCPaginationInfo() {
  const applications = currentKYCTab === 'pending' ? kycApplications.pending : kycApplications.reviewed;
  const start = (currentKYCPage - 1) * kycPageSize + 1;
  const end = Math.min(currentKYCPage * kycPageSize, applications.length);
  
  document.getElementById('kycStartIndex').textContent = start;
  document.getElementById('kycEndIndex').textContent = end;
  document.getElementById('kycTotalItems').textContent = applications.length;
}

function goToKYCPage(page) {
  const applications = currentKYCTab === 'pending' ? kycApplications.pending : kycApplications.reviewed;
  const totalPages = Math.ceil(applications.length / kycPageSize);
  
  if (page === 'prev') page = Math.max(1, currentKYCPage - 1);
  else if (page === 'next') page = Math.min(totalPages, currentKYCPage + 1);
  else if (page === 'last') page = totalPages;
  
  if (page >= 1 && page <= totalPages && page !== currentKYCPage) {
    currentKYCPage = page;
    renderKYCList();
  }
}

function changeKYCPageSize() {
  kycPageSize = parseInt(document.getElementById('kycPageSize').value);
  currentKYCPage = 1;
  renderKYCList();
}

function approveKYC(id) {
  if (confirm('确定要通过这个KYC申请吗？')) {
    console.log('通过KYC申请:', id);
    switchKYCTab('pending');
  }
}

function rejectKYC(id) {
  if (confirm('确定要拒绝这个KYC申请吗？')) {
    console.log('拒绝KYC申请:', id);
    switchKYCTab('pending');
  }
}

function downloadKYCReport(id) { console.log(`下载KYC报告: ${id}`); }

function updateKYCTabBadges() {
  const pendingBadge = document.querySelector('[data-tab="pending"] .tab-badge');
  const reviewedBadge = document.querySelector('[data-tab="reviewed"] .tab-badge');
  
  if (pendingBadge) pendingBadge.textContent = kycApplications.pending.length;
  if (reviewedBadge) reviewedBadge.textContent = kycApplications.reviewed.length;
}

function initKYCReview() {
  updateKYCTabBadges();
  renderKYCList();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  initUserManagement();
}); 