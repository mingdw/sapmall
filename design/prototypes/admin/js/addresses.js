// 收货地址管理页面JavaScript

// 全局变量
let allAddresses = [];
let currentEditId = null;

// 模拟省市区数据
const regionData = {
    '北京市': {
        '北京市': ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区']
    },
    '上海市': {
        '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区']
    },
    '广东省': {
        '广州市': ['荔湾区', '越秀区', '海珠区', '天河区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '从化区', '增城区'],
        '深圳市': ['罗湖区', '福田区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区', '大鹏新区'],
        '珠海市': ['香洲区', '斗门区', '金湾区']
    },
    '江苏省': {
        '南京市': ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区', '雨花台区', '江宁区', '六合区', '溧水区', '高淳区'],
        '苏州市': ['虎丘区', '吴中区', '相城区', '姑苏区', '吴江区', '常熟市', '张家港市', '昆山市', '太仓市']
    },
    '浙江省': {
        '杭州市': ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '富阳区', '临安区', '桐庐县', '淳安县', '建德市'],
        '宁波市': ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区', '余姚市', '慈溪市', '象山县', '宁海县']
    }
};

// 模拟地址数据
const mockAddresses = [
    {
        id: 'addr_001',
        receiverName: '张三',
        receiverPhone: '138****1234',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detailAddress: '建国路88号SOHO现代城A座2208室',
        postalCode: '100022',
        addressLabel: 'company',
        isDefault: true,
        createTime: '2024-01-15',
        lastUsed: '2024-05-28'
    },
    {
        id: 'addr_002',
        receiverName: '李四',
        receiverPhone: '139****5678',
        province: '上海市',
        city: '上海市',
        district: '浦东新区',
        detailAddress: '陆家嘴环路1000号恒生银行大厦36楼',
        postalCode: '200120',
        addressLabel: 'company',
        isDefault: false,
        createTime: '2024-02-20',
        lastUsed: '2024-05-25'
    },
    {
        id: 'addr_003',
        receiverName: '王五',
        receiverPhone: '136****9999',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detailAddress: '深南大道10000号腾讯滨海大厦39楼',
        postalCode: '518054',
        addressLabel: 'home',
        isDefault: false,
        createTime: '2024-03-10',
        lastUsed: '2024-04-15'
    }
];

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeAddressesPage();
});

function initializeAddressesPage() {
    console.log('初始化收货地址页面...');
    
    // 初始化数据
    allAddresses = [...mockAddresses];
    
    // 初始化表单
    initForm();
    
    // 渲染页面
    renderAddresses();
    initRegionSelects();
    
    console.log('收货地址页面初始化完成');
}

// 渲染地址列表
function renderAddresses() {
    const addressesList = document.getElementById('addressesList');
    const emptyState = document.getElementById('emptyState');
    
    if (!addressesList) return;
    
    if (allAddresses.length === 0) {
        addressesList.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        addressesList.innerHTML = allAddresses.map(address => createAddressHTML(address)).join('');
    }
}

// 创建地址HTML
function createAddressHTML(address) {
    const labelMap = {
        home: '家',
        company: '公司',
        school: '学校',
        other: '其他'
    };
    const fullAddress = `${address.province} ${address.city} ${address.district} ${address.detailAddress}`;
    
    return `
        <div class="address-row">
            <div class="address-col address-receiver">
                <div class="receiver-info">
                    <span class="receiver-name">${address.receiverName}</span>
                    ${address.isDefault ? '<span class="default-badge">默认</span>' : ''}
                    <span class="address-label-badge">${labelMap[address.addressLabel] || '其他'}</span>
                </div>
            </div>
            <div class="address-col address-phone">
                <span class="phone-number">${address.receiverPhone}</span>
            </div>
            <div class="address-col address-location">
                <div class="address-full">${fullAddress}</div>
                <div class="address-meta">
                    ${address.postalCode ? `邮编: ${address.postalCode} | ` : ''}创建: ${address.createTime} | 最近使用: ${address.lastUsed}
                </div>
            </div>
            <div class="address-col address-actions">
                ${!address.isDefault ? `<button class="admin-btn admin-btn-primary" onclick="setDefaultAddress('${address.id}')"><i class="fas fa-star"></i>设为默认</button>` : ''}
                <button class="admin-btn admin-btn-outline" onclick="editAddress('${address.id}')"><i class="fas fa-edit"></i>编辑</button>
                <button class="admin-btn admin-btn-danger" onclick="showDeleteModal('${address.id}')"><i class="fas fa-trash"></i>删除</button>
            </div>
        </div>
    `;
}

// 初始化省市区选择器
function initRegionSelects() {
    const provinceSelect = document.getElementById('province');
    if (!provinceSelect) return;
    
    // 清空并添加省份选项
    provinceSelect.innerHTML = '<option value="">请选择省份</option>';
    Object.keys(regionData).forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });
}

// 更新城市选项
function updateCities() {
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    
    if (!provinceSelect || !citySelect || !districtSelect) return;
    
    const selectedProvince = provinceSelect.value;
    
    // 清空城市和区县选项
    citySelect.innerHTML = '<option value="">请选择城市</option>';
    districtSelect.innerHTML = '<option value="">请选择区县</option>';
    
    if (selectedProvince && regionData[selectedProvince]) {
        Object.keys(regionData[selectedProvince]).forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// 更新区县选项
function updateDistricts() {
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    
    if (!provinceSelect || !citySelect || !districtSelect) return;
    
    const selectedProvince = provinceSelect.value;
    const selectedCity = citySelect.value;
    
    // 清空区县选项
    districtSelect.innerHTML = '<option value="">请选择区县</option>';
    
    if (selectedProvince && selectedCity && regionData[selectedProvince] && regionData[selectedProvince][selectedCity]) {
        regionData[selectedProvince][selectedCity].forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
}

// 显示添加地址模态框
function showAddAddressModal() {
    currentEditId = null;
    const modal = document.getElementById('addressModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('addressForm');
    
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> 添加收货地址';
    }
    
    if (form) {
        form.reset();
        initRegionSelects();
    }
    
    if (modal) {
        modal.style.display = 'block';
    }
}

// 编辑地址
function editAddress(addressId) {
    const address = allAddresses.find(addr => addr.id === addressId);
    if (!address) return;
    
    currentEditId = addressId;
    const modal = document.getElementById('addressModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-edit"></i> 编辑收货地址';
    }
    
    // 填充表单数据
    fillFormData(address);
    
    if (modal) {
        modal.style.display = 'block';
    }
}

// 填充表单数据
function fillFormData(address) {
    const form = document.getElementById('addressForm');
    if (!form) return;
    
    // 先初始化省市区选择器
    initRegionSelects();
    
    // 等待DOM更新后填充数据
    setTimeout(() => {
        const elements = {
            receiverName: address.receiverName,
            receiverPhone: address.receiverPhone,
            province: address.province,
            detailAddress: address.detailAddress,
            postalCode: address.postalCode || '',
            addressLabel: address.addressLabel,
            isDefault: address.isDefault
        };
        
        Object.entries(elements).forEach(([key, value]) => {
            const element = form.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
        });
        
        // 更新城市选项并设置值
        updateCities();
        setTimeout(() => {
            const citySelect = document.getElementById('city');
            if (citySelect) {
                citySelect.value = address.city;
                updateDistricts();
                setTimeout(() => {
                    const districtSelect = document.getElementById('district');
                    if (districtSelect) {
                        districtSelect.value = address.district;
                    }
                }, 100);
            }
        }, 100);
    }, 100);
}

// 初始化表单
function initForm() {
    const form = document.getElementById('addressForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveAddress();
    });
}

// 保存地址
function saveAddress() {
    const form = document.getElementById('addressForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const addressData = {
        receiverName: formData.get('receiverName'),
        receiverPhone: formData.get('receiverPhone'),
        province: formData.get('province'),
        city: formData.get('city'),
        district: formData.get('district') || '',
        detailAddress: formData.get('detailAddress'),
        postalCode: formData.get('postalCode') || '',
        addressLabel: formData.get('addressLabel'),
        isDefault: formData.get('isDefault') === 'on'
    };
    
    // 表单验证
    if (!validateForm(addressData)) {
        return;
    }
    
    if (currentEditId) {
        // 编辑现有地址
        const index = allAddresses.findIndex(addr => addr.id === currentEditId);
        if (index !== -1) {
            // 如果设为默认地址，取消其他地址的默认状态
            if (addressData.isDefault) {
                allAddresses.forEach(addr => addr.isDefault = false);
            }
            
            allAddresses[index] = {
                ...allAddresses[index],
                ...addressData,
                lastUsed: new Date().toISOString().split('T')[0]
            };
            showToast('地址更新成功！', 'success');
            renderAddresses();
        }
    } else {
        // 添加新地址
        const newAddress = {
            id: 'addr_' + Date.now(),
            ...addressData,
            createTime: new Date().toISOString().split('T')[0],
            lastUsed: new Date().toISOString().split('T')[0]
        };
        
        // 如果设为默认地址，取消其他地址的默认状态
        if (addressData.isDefault) {
            allAddresses.forEach(addr => addr.isDefault = false);
        }
        
        allAddresses.push(newAddress);
        showToast('地址添加成功！', 'success');
        renderAddresses();
    }
    
    closeAddressModal();
}

// 表单验证
function validateForm(data) {
    const requiredFields = [
        { field: 'receiverName', message: '请输入收货人姓名' },
        { field: 'receiverPhone', message: '请输入联系电话' },
        { field: 'province', message: '请选择省份' },
        { field: 'city', message: '请选择城市' },
        { field: 'detailAddress', message: '请输入详细地址' }
    ];
    
    for (const { field, message } of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showToast(message, 'error');
            return false;
        }
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(data.receiverPhone.replace(/\D/g, ''))) {
        showToast('请输入正确的手机号码', 'error');
        return false;
    }
    
    return true;
}

// 设置默认地址
function setDefaultAddress(addressId) {
    // 取消所有地址的默认状态
    allAddresses.forEach(addr => addr.isDefault = false);
    
    // 设置指定地址为默认
    const address = allAddresses.find(addr => addr.id === addressId);
    if (address) {
        address.isDefault = true;
        showToast('默认地址设置成功！', 'success');
        renderAddresses();
    }
}

// 显示删除确认模态框
function showDeleteModal(addressId) {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.setAttribute('data-delete-id', addressId);
        modal.style.display = 'block';
    }
}

// 确认删除地址
function confirmDeleteAddress() {
    const modal = document.getElementById('deleteModal');
    const addressId = modal?.getAttribute('data-delete-id');
    
    if (addressId) {
        const index = allAddresses.findIndex(addr => addr.id === addressId);
        if (index !== -1) {
            allAddresses.splice(index, 1);
            showToast('地址删除成功！', 'success');
            closeDeleteModal();
            renderAddresses();
        }
    }
}

// 关闭地址模态框
function closeAddressModal() {
    const modal = document.getElementById('addressModal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentEditId = null;
}

// 关闭删除确认模态框
function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.style.display = 'none';
        modal.removeAttribute('data-delete-id');
    }
}

// 显示提示消息
function showToast(message, type = 'info') {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 添加样式
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        background: ${getToastColor(type)};
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getToastColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// 模态框外点击关闭
window.addEventListener('click', function(event) {
    const addressModal = document.getElementById('addressModal');
    const deleteModal = document.getElementById('deleteModal');
    
    if (event.target === addressModal) {
        closeAddressModal();
    }
    
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
}); 