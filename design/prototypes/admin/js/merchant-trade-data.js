// 交易数据页面JS
// 模拟数据与业务逻辑

document.addEventListener('DOMContentLoaded', function() {
    // 1. 数据模拟
    const coins = ['USDT', 'ETH', 'BTC', 'BUSD'];
    const chainStatus = [
        {label: '已上链', value: 'success', icon: 'fa-circle-check'},
        {label: '待确认', value: 'pending', icon: 'fa-clock'},
        {label: '失败', value: 'failed', icon: 'fa-circle-xmark'}
    ];
    const orderTypes = ['普通订单', 'NFT交易', '虚拟商品'];
    // 生成模拟订单
    function randomHash() {
        const chars = 'abcdef0123456789';
        let h = '';
        for(let i=0;i<64;i++) h+=chars[Math.floor(Math.random()*chars.length)];
        return h;
    }
    function randomStatus() {
        const r = Math.random();
        if(r>0.85) return 'failed';
        if(r>0.65) return 'pending';
        return 'success';
    }
    function randomCoin() { return coins[Math.floor(Math.random()*coins.length)]; }
    function randomType() { return orderTypes[Math.floor(Math.random()*orderTypes.length)]; }
    function randomAmount() { return (Math.random()*1000+10).toFixed(2); }
    function randomDate(days=60) {
        const d = new Date();
        d.setDate(d.getDate()-Math.floor(Math.random()*days));
        d.setHours(Math.floor(Math.random()*24),Math.floor(Math.random()*60));
        return d;
    }
    function formatDate(d) {
        return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
    }
    // 生成100条订单
    let allOrders = [];
    for(let i=1;i<=100;i++){
        const status = randomStatus();
        allOrders.push({
            id: 'ORD'+String(10000+i),
            buyer: ['Alice','Bob','Carol','David','Eve'][i%5],
            product: ['数字藏品','在线课程','会员服务','链游道具','NFT头像'][i%5],
            type: randomType(),
            amount: randomAmount(),
            coin: randomCoin(),
            hash: randomHash(),
            chainStatus: status,
            time: randomDate(),
        });
    }

    // 1. 数据卡片数字动画增长
    function animateNumber(el, to, duration=900) {
        let start = 0, startTime = null;
        function step(ts) {
            if(!startTime) startTime = ts;
            let progress = Math.min((ts-startTime)/duration,1);
            el.textContent = (to*progress).toFixed(2);
            if(progress<1) requestAnimationFrame(step); else el.textContent = to;
        }
        requestAnimationFrame(step);
    }
    function renderStats() {
        const total = allOrders.length;
        const totalAmount = allOrders.reduce((sum,o)=>sum+parseFloat(o.amount),0).toFixed(2);
        const nftCount = allOrders.filter(o=>o.type==='NFT交易').length;
        const chainSuccess = allOrders.filter(o=>o.chainStatus==='success').length;
        const chainRate = total ? Math.round(chainSuccess/total*100) : 0;
        document.getElementById('tradeStatsGrid').innerHTML = `
            <div class="trade-stat-card"><div class="stat-icon stat-icon-blue"><i class="fas fa-coins"></i></div><div class="stat-content"><div class="stat-value" id="statAmount">0</div><div class="stat-label">总交易额</div></div></div>
            <div class="trade-stat-card"><div class="stat-icon stat-icon-green"><i class="fas fa-file-invoice-dollar"></i></div><div class="stat-content"><div class="stat-value" id="statTotal">0</div><div class="stat-label">订单总数</div></div></div>
            <div class="trade-stat-card"><div class="stat-icon stat-icon-purple"><i class="fas fa-cube"></i></div><div class="stat-content"><div class="stat-value" id="statNFT">0</div><div class="stat-label">NFT交易数</div></div></div>
            <div class="trade-stat-card"><div class="stat-icon stat-icon-yellow"><i class="fas fa-link"></i></div><div class="stat-content"><div class="stat-value" id="statChain">0%</div><div class="stat-label">链上确认率</div></div></div>
        `;
        animateNumber(document.getElementById('statAmount'), totalAmount);
        animateNumber(document.getElementById('statTotal'), total, 700);
        animateNumber(document.getElementById('statNFT'), nftCount, 700);
        animateNumber(document.getElementById('statChain'), chainRate, 700);
    }

    // 2. 筛选区
    let filter = { range: 1, type: '', status: '', search: '' };
    // 绑定筛选区事件
    function bindFilterEvents() {
        // 快速时间范围Tab切换
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filter.range = parseInt(btn.getAttribute('data-range'));
                renderTable(); // 只刷新表格
            };
        });
        // 类型下拉
        document.getElementById('typeFilter').onchange = function() {
            filter.type = this.value;
            renderTable();
            renderChart();
        };
        // 状态下拉
        document.getElementById('statusFilter').onchange = function() {
            filter.status = this.value;
            renderTable();
            renderChart();
        };
        // 搜索框
        document.getElementById('searchInput').onkeydown = function(e) {
            if (e.key === 'Enter') {
                filter.search = this.value.trim();
                renderTable();
                renderChart();
            }
        };
    }

    // 4. 图表区
    let chartInstance = null;
    let chartType = 'amount';
    let chartRange = 30; // 图表时间范围，默认30天
    function bindChartRangeEvent() {
        document.getElementById('chartRangeSelect').onchange = function() {
            chartRange = parseInt(this.value);
            renderChart();
        };
    }
    function renderChartTabs() {
        document.querySelectorAll('.trade-chart-tab').forEach(btn => {
            btn.onclick = function() {
                document.querySelectorAll('.trade-chart-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                chartType = btn.getAttribute('data-type');
                renderChart();
            };
        });
    }
    function renderChart() {
        // 按天统计，天数由chartRange决定
        const filtered = getFilteredOrdersForChart();
        const days = [];
        const dayMap = {};
        for(let i=0;i<chartRange;i++){
            const d = new Date();
            d.setDate(d.getDate()-i);
            const key = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
            days.unshift(key);
            dayMap[key] = 0;
        }
        filtered.forEach(o=>{
            const key = o.time.getFullYear()+'-'+String(o.time.getMonth()+1).padStart(2,'0')+'-'+String(o.time.getDate()).padStart(2,'0');
            if(dayMap[key]!==undefined) {
                if(chartType==='amount') dayMap[key]+=parseFloat(o.amount);
                else dayMap[key]++;
            }
        });
        const data = days.map(d=>dayMap[d]);
        if(chartInstance) chartInstance.destroy();
        chartInstance = new Chart(document.getElementById('tradeChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: chartType==='amount'?'交易额':'订单数',
                    data,
                    borderColor: chartType==='amount'?'#3b82f6':'#10b981',
                    backgroundColor: chartType==='amount'?'rgba(59,130,246,0.08)':'rgba(16,185,129,0.08)',
                    tension: 0.3,
                    fill: true,
                    pointRadius: 2,
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#94a3b8', font: {size:12} } },
                    y: { ticks: { color: '#94a3b8', font: {size:12} } }
                },
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }
    function getFilteredOrdersForChart() {
        // 图表只受类型、状态、搜索影响，不受表格时间Tab影响
        return allOrders.filter(o => {
            if (filter.type && o.type !== filter.type) return false;
            if (filter.status && o.chainStatus !== filter.status) return false;
            if (filter.search && !(
                o.id.includes(filter.search) || o.buyer.includes(filter.search) || o.product.includes(filter.search)
            )) return false;
            return true;
        });
    }

    // 5. 明细表格
    let currentPage = 1, pageSize = 10;
    function getFilteredOrders() {
        const now = new Date();
        return allOrders.filter(o => {
            // 时间范围
            if (filter.range && filter.range > 0) {
                const daysAgo = new Date();
                daysAgo.setHours(0,0,0,0);
                daysAgo.setDate(now.getDate() - filter.range + 1);
                if (o.time < daysAgo) return false;
            }
            if (filter.type && o.type !== filter.type) return false;
            if (filter.status && o.chainStatus !== filter.status) return false;
            if (filter.search && !(
                o.id.includes(filter.search) || o.buyer.includes(filter.search) || o.product.includes(filter.search)
            )) return false;
            return true;
        });
    }
    function renderTable() {
        const filtered = getFilteredOrders();
        const total = filtered.length;
        const start = (currentPage-1)*pageSize;
        const pageOrders = filtered.slice(start, start+pageSize);
        let html = `<table class="trade-table">
            <thead><tr>
                <th>订单号</th><th>买家</th><th>商品</th><th>类型</th><th>金额</th><th>币种</th><th>链上TxHash</th><th>链上状态</th><th>下单时间</th><th>操作</th>
            </tr></thead><tbody>`;
        if(pageOrders.length===0){
            html += `<tr><td colspan="10"><div class='empty-state'><i class='fas fa-box-open'></i><div>暂无数据</div></div></td></tr>`;
        } else {
            pageOrders.forEach(o=>{
                const statusObj = chainStatus.find(s=>s.value===o.chainStatus);
                html += `<tr>
                    <td><span class='order-link' onclick='showOrderDetail("${o.id}")'>${o.id}</span></td>
                    <td><span class='order-link' onclick='showOrderDetail("${o.id}")'>${o.buyer}</span></td>
                    <td><span class='order-link' onclick='showOrderDetail("${o.id}")'>${o.product}</span></td>
                    <td>${o.type}</td>
                    <td>${o.amount}</td>
                    <td><span class="coin-badge">${o.coin}</span></td>
                    <td><span class="hash-link" title="点击复制TxHash" onclick="copyToClipboard('${o.hash}')">${o.hash.slice(0,8)}...${o.hash.slice(-6)}</span></td>
                    <td><span class="chain-status chain-status-${o.chainStatus}"><i class="fas ${statusObj.icon}"></i> ${statusObj.label}</span></td>
                    <td>${formatDate(o.time)}</td>
                    <td><button class="action-btn" onclick="showOrderDetail('${o.id}')"><i class="fas fa-eye"></i> 查看</button></td>
                </tr>`;
            });
        }
        html += '</tbody></table>';
        document.getElementById('tradeTableContainer').innerHTML = html;
        // 分页
        renderPagination(total);
    }
    function renderPagination(total) {
        const pageCount = Math.ceil(total/pageSize);
        let html = '';
        // 每页条数选择器
        html += `<select class="page-size-select" id="pageSizeSelect">
            <option value="10"${pageSize==10?' selected':''}>10条/页</option>
            <option value="20"${pageSize==20?' selected':''}>20条/页</option>
            <option value="50"${pageSize==50?' selected':''}>50条/页</option>
            <option value="100"${pageSize==100?' selected':''}>100条/页</option>
        </select>`;
        // 上一页
        html += `<button class="pagination-btn" ${currentPage===1?'disabled':''} onclick="goPage(${currentPage-1})"><i class="fas fa-chevron-left"></i></button>`;
        // 页码（带省略号）
        if(pageCount<=5){
            for(let i=1;i<=pageCount;i++){
                html += `<button class="pagination-page${i===currentPage?' active':''}" onclick="goPage(${i})">${i}</button>`;
            }
        }else{
            if(currentPage>2){
                html += `<button class="pagination-page" onclick="goPage(1)">1</button>`;
                if(currentPage>3) html += `<span style='color:#64748b;margin:0 4px;'>...</span>`;
            }
            let start=Math.max(2,currentPage-1),end=Math.min(pageCount-1,currentPage+1);
            for(let i=start;i<=end;i++){
                html += `<button class="pagination-page${i===currentPage?' active':''}" onclick="goPage(${i})">${i}</button>`;
            }
            if(currentPage<pageCount-1){
                if(currentPage<pageCount-2) html += `<span style='color:#64748b;margin:0 4px;'>...</span>`;
                html += `<button class="pagination-page" onclick="goPage(${pageCount})">${pageCount}</button>`;
            }
        }
        // 下一页
        html += `<button class="pagination-btn" ${currentPage===pageCount||pageCount===0?'disabled':''} onclick="goPage(${currentPage+1})"><i class="fas fa-chevron-right"></i></button>`;
        // 总条数
        html += `<span style="color:#64748b;font-size:14px;margin-left:16px;">共${total}条</span>`;
        document.getElementById('pagination').innerHTML = html;
        // 美化分页按钮
        document.querySelectorAll('.pagination-btn, .pagination-page').forEach(btn=>{
            btn.classList.add('pg-btn');
        });
        // 绑定每页条数选择
        document.getElementById('pageSizeSelect').onchange = function() {
            pageSize = parseInt(this.value);
            currentPage = 1;
            renderTable();
        };
    }
    window.goPage = function(page){ currentPage=page; renderTable(); };

    // 6. 导出功能（模拟）
    document.getElementById('exportBtn').onclick = function(){
        alert('导出功能为演示，实际业务请对接后端接口！');
    };

    // 7. hash一键复制，toast提示
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(()=>{
            showToast('已复制TxHash！');
        });
    }
    function showToast(msg) {
        let toast = document.getElementById('toastMsg');
        if(!toast){
            toast = document.createElement('div');
            toast.id = 'toastMsg';
            toast.style.position = 'fixed';
            toast.style.bottom = '40px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.background = '#232c3b';
            toast.style.color = '#fff';
            toast.style.padding = '12px 28px';
            toast.style.borderRadius = '18px';
            toast.style.fontSize = '15px';
            toast.style.boxShadow = '0 2px 12px 0 #232c3b88';
            toast.style.zIndex = 9999;
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.opacity = 1;
        setTimeout(()=>{ toast.style.opacity=0; }, 1600);
    }

    // 8. 表格表头吸顶，hover高亮行，点击订单号/买家/商品弹窗详情（模拟）
    window.showOrderDetail = function(id){
        showToast('订单详情弹窗（模拟）：'+id);
    };

    // 初始化
    renderStats();
    bindFilterEvents();
    bindChartRangeEvent();
    renderChartTabs();
    renderTable();
    renderChart();
}); 