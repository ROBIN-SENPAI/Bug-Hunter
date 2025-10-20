/**
 * CAI - 3D Visualization Dashboard
 * لوحة تحكم ثلاثية الأبعاد تفاعلية
 * Version: 1.0.0
 */

class Visualization3DDashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.data = {
            vulnerabilities: [],
            network: [],
            timeline: []
        };
        this.nodes = [];
        this.connections = [];
    }

    initialize() {
        console.log('🎨 تهيئة لوحة التحكم ثلاثية الأبعاد...');
        
        // إنشاء HTML structure
        this.createDashboardHTML();
        
        // تهيئة المخططات
        this.initializeCharts();
        
        // إضافة تأثيرات تفاعلية
        this.addInteractivity();
        
        console.log('✅ لوحة التحكم جاهزة!');
    }

    createDashboardHTML() {
        this.container.innerHTML = `
            <div class="cai-3d-dashboard">
                <!-- Header -->
                <div class="dashboard-header">
                    <h1>🛡️ CAI Hunter Pro - 3D Security Dashboard</h1>
                    <div class="stats-bar">
                        <div class="stat-item critical">
                            <span class="value" id="stat-critical">0</span>
                            <span class="label">Critical</span>
                        </div>
                        <div class="stat-item high">
                            <span class="value" id="stat-high">0</span>
                            <span class="label">High</span>
                        </div>
                        <div class="stat-item medium">
                            <span class="value" id="stat-medium">0</span>
                            <span class="label">Medium</span>
                        </div>
                        <div class="stat-item low">
                            <span class="value" id="stat-low">0</span>
                            <span class="label">Low</span>
                        </div>
                    </div>
                </div>

                <!-- Main Grid -->
                <div class="dashboard-grid">
                    <!-- Network Map -->
                    <div class="dashboard-panel network-map">
                        <h3>🌐 Attack Surface Map</h3>
                        <canvas id="network-canvas"></canvas>
                    </div>

                    <!-- Vulnerability Timeline -->
                    <div class="dashboard-panel timeline">
                        <h3>📊 Vulnerability Discovery Timeline</h3>
                        <canvas id="timeline-canvas"></canvas>
                    </div>

                    <!-- Severity Distribution -->
                    <div class="dashboard-panel severity-chart">
                        <h3>🎯 Severity Distribution</h3>
                        <canvas id="severity-canvas"></canvas>
                    </div>

                    <!-- Risk Score Gauge -->
                    <div class="dashboard-panel risk-gauge">
                        <h3>⚠️ Risk Score</h3>
                        <canvas id="risk-canvas"></canvas>
                    </div>

                    <!-- Vulnerability Types -->
                    <div class="dashboard-panel vuln-types">
                        <h3>🔍 Vulnerability Types</h3>
                        <canvas id="types-canvas"></canvas>
                    </div>

                    <!-- Real-time Activity -->
                    <div class="dashboard-panel activity-feed">
                        <h3>⚡ Real-time Activity</h3>
                        <div id="activity-log"></div>
                    </div>

                    <!-- Exploit Chains -->
                    <div class="dashboard-panel exploit-chains">
                        <h3>⛓️ Exploit Chains Visualization</h3>
                        <div id="chains-viz"></div>
                    </div>

                    <!-- Recommendations -->
                    <div class="dashboard-panel recommendations">
                        <h3>💡 AI Recommendations</h3>
                        <div id="ai-recommendations"></div>
                    </div>
                </div>

                <!-- Floating Stats -->
                <div class="floating-stats">
                    <div class="floating-stat">
                        <span class="icon">🎯</span>
                        <div class="info">
                            <span class="value" id="total-scanned">0</span>
                            <span class="label">Endpoints Scanned</span>
                        </div>
                    </div>
                    <div class="floating-stat">
                        <span class="icon">🚨</span>
                        <div class="info">
                            <span class="value" id="total-vulns">0</span>
                            <span class="label">Vulnerabilities</span>
                        </div>
                    </div>
                    <div class="floating-stat">
                        <span class="icon">⚡</span>
                        <div class="info">
                            <span class="value" id="scan-speed">0</span>
                            <span class="label">Req/sec</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.injectStyles();
    }

    injectStyles() {
        const styles = `
            <style>
                .cai-3d-dashboard {
                    width: 100%;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: #fff;
                    position: relative;
                    overflow: hidden;
                }

                .cai-3d-dashboard::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
                    pointer-events: none;
                }

                .dashboard-header {
                    text-align: center;
                    margin-bottom: 30px;
                    position: relative;
                    z-index: 1;
                }

                .dashboard-header h1 {
                    font-size: 2.5em;
                    margin-bottom: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
                    animation: glow 2s ease-in-out infinite alternate;
                }

                @keyframes glow {
                    from { filter: drop-shadow(0 0 5px rgba(102, 126, 234, 0.5)); }
                    to { filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.8)); }
                }

                .stats-bar {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    flex-wrap: wrap;
                }

                .stat-item {
                    padding: 15px 30px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                }

                .stat-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
                }

                .stat-item.critical {
                    background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(185, 28, 28, 0.2));
                    border-color: rgba(220, 38, 38, 0.3);
                }

                .stat-item.high {
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
                    border-color: rgba(239, 68, 68, 0.3);
                }

                .stat-item.medium {
                    background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2));
                    border-color: rgba(245, 158, 11, 0.3);
                }

                .stat-item.low {
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2));
                    border-color: rgba(59, 130, 246, 0.3);
                }

                .stat-item .value {
                    display: block;
                    font-size: 2em;
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .stat-item .label {
                    display: block;
                    font-size: 0.9em;
                    opacity: 0.8;
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 20px;
                    position: relative;
                    z-index: 1;
                }

                .dashboard-panel {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 25px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .dashboard-panel::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #667eea, #764ba2);
                    transform: scaleX(0);
                    transition: transform 0.3s ease;
                }

                .dashboard-panel:hover::before {
                    transform: scaleX(1);
                }

                .dashboard-panel:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
                }

                .dashboard-panel h3 {
                    margin: 0 0 20px 0;
                    font-size: 1.2em;
                    color: #a78bfa;
                }

                .dashboard-panel canvas {
                    width: 100% !important;
                    height: 300px !important;
                }

                .network-map {
                    grid-column: span 2;
                }

                .activity-feed {
                    max-height: 400px;
                    overflow-y: auto;
                }

                #activity-log {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .activity-item {
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    border-left: 3px solid;
                    animation: slideIn 0.3s ease;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .activity-item.critical { border-left-color: #dc2626; }
                .activity-item.high { border-left-color: #ef4444; }
                .activity-item.medium { border-left-color: #f59e0b; }
                .activity-item.low { border-left-color: #3b82f6; }

                .floating-stats {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    z-index: 1000;
                }

                .floating-stat {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px 20px;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    border-radius: 50px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .floating-stat .icon {
                    font-size: 2em;
                }

                .floating-stat .info {
                    display: flex;
                    flex-direction: column;
                }

                .floating-stat .value {
                    font-size: 1.5em;
                    font-weight: bold;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .floating-stat .label {
                    font-size: 0.8em;
                    opacity: 0.7;
                }

                /* Scrollbar Styling */
                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 10px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #764ba2, #667eea);
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    initializeCharts() {
        this.createNetworkMap();
        this.createTimelineChart();
        this.createSeverityChart();
        this.createRiskGauge();
        this.createTypesChart();
    }

    createNetworkMap() {
        const canvas = document.getElementById('network-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;
        
        // رسم خريطة شبكة بسيطة
        this.animateNetworkMap(ctx, canvas);
    }

    animateNetworkMap(ctx, canvas) {
        const nodes = [];
        const nodeCount = 20;
        
        // إنشاء عقد عشوائية
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 5 + 3,
                color: this.getRandomColor()
            });
        }
        
        const animate = () => {
            ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // رسم الاتصالات
            ctx.strokeStyle = 'rgba(102, 126, 234, 0.2)';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.globalAlpha = 1 - (distance / 150);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
            
            // رسم وتحريك العقد
            nodes.forEach(node => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.fill();
                
                // تحديث الموقع
                node.x += node.vx;
                node.y += node.vy;
                
                // ارتداد من الحواف
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    createTimelineChart() {
        const canvas = document.getElementById('timeline-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;
        
        // رسم خط زمني بسيط
        this.drawTimeline(ctx, canvas);
    }

    drawTimeline(ctx, canvas) {
        const data = [
            { time: 0, value: 0 },
            { time: 20, value: 5 },
            { time: 40, value: 12 },
            { time: 60, value: 8 },
            { time: 80, value: 15 },
            { time: 100, value: 20 }
        ];
        
        ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        
        data.forEach(point => {
            const x = (point.time / 100) * canvas.width;
            const y = canvas.height - (point.value / 20) * canvas.height;
            ctx.lineTo(x, y);
        });
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
        
        // رسم الخط
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = (point.time / 100) * canvas.width;
            const y = canvas.height - (point.value / 20) * canvas.height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // رسم النقاط
        data.forEach(point => {
            const x = (point.time / 100) * canvas.width;
            const y = canvas.height - (point.value / 20) * canvas.height;
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#764ba2';
            ctx.fill();
        });
    }

    createSeverityChart() {
        const canvas = document.getElementById('severity-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;
        
        this.drawPieChart(ctx, canvas, {
            'Critical': 5,
            'High': 12,
            'Medium': 20,
            'Low': 8
        });
    }

    drawPieChart(ctx, canvas, data) {
        const total = Object.values(data).reduce((a, b) => a + b, 0);
        const colors = {
            'Critical': '#dc2626',
            'High': '#ef4444',
            'Medium': '#f59e0b',
            'Low': '#3b82f6'
        };
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        
        let currentAngle = -Math.PI / 2;
        
        Object.entries(data).forEach(([label, value]) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            // رسم الشريحة
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[label];
            ctx.fill();
            
            // رسم التسمية
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
            
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${label}: ${value}`, labelX, labelY);
            
            currentAngle += sliceAngle;
        });
        
        // رسم دائرة في المنتصف (Donut chart)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
        ctx.fillStyle = '#1a1a2e';
        ctx.fill();
        
        // النص في المنتصف
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(total, centerX, centerY);
        ctx.font = '14px Arial';
        ctx.fillText('Total', centerX, centerY + 20);
    }

    createRiskGauge() {
        const canvas = document.getElementById('risk-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;
        
        this.drawGauge(ctx, canvas, 75); // 75% risk score
    }

    drawGauge(ctx, canvas, value) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        
        // رسم الخلفية
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
        ctx.lineWidth = 30;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();
        
        // رسم القيمة
        const angle = Math.PI + (value / 100) * Math.PI;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(0.5, '#f59e0b');
        gradient.addColorStop(1, '#dc2626');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, angle);
        ctx.lineWidth = 30;
        ctx.strokeStyle = gradient;
        ctx.stroke();
        
        // رسم النص
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value, centerX, centerY + 10);
        ctx.font = '18px Arial';
        ctx.fillText('Risk Score', centerX, centerY + 35);
        
        // رسم المؤشر
        const pointerX = centerX + Math.cos(angle) * (radius - 15);
        const pointerY = centerY + Math.sin(angle) * (radius - 15);
        
        ctx.beginPath();
        ctx.arc(pointerX, pointerY, 10, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }

    createTypesChart() {
        const canvas = document.getElementById('types-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;
        
        this.drawBarChart(ctx, canvas, {
            'SQLi': 12,
            'XSS': 8,
            'CSRF': 5,
            'IDOR': 7,
            'LFI': 3,
            'RCE': 2
        });
    }

    drawBarChart(ctx, canvas, data) {
        const padding = 40;
        const barWidth = (canvas.width - padding * 2) / Object.keys(data).length;
        const maxValue = Math.max(...Object.values(data));
        const chartHeight = canvas.height - padding * 2;
        
        Object.entries(data).forEach(([label, value], index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + index * barWidth;
            const y = canvas.height - padding - barHeight;
            
            // رسم الشريط
            const gradient = ctx.createLinearGradient(x, y, x, canvas.height - padding);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
            
            // رسم القيمة
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth / 2, y - 10);
            
            // رسم التسمية
            ctx.font = '12px Arial';
            ctx.fillText(label, x + barWidth / 2, canvas.height - padding + 20);
        });
    }

    // ========================================
    // Real-time Updates
    // ========================================
    
    updateStats(stats) {
        document.getElementById('stat-critical').textContent = stats.critical || 0;
        document.getElementById('stat-high').textContent = stats.high || 0;
        document.getElementById('stat-medium').textContent = stats.medium || 0;
        document.getElementById('stat-low').textContent = stats.low || 0;
        
        document.getElementById('total-scanned').textContent = stats.tested || 0;
        document.getElementById('total-vulns').textContent = stats.vulnerable || 0;
    }

    addActivity(activity) {
        const activityLog = document.getElementById('activity-log');
        if (!activityLog) return;
        
        const item = document.createElement('div');
        item.className = `activity-item ${activity.severity.toLowerCase()}`;
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span><strong>${activity.type}</strong> - ${activity.message}</span>
                <span style="opacity: 0.6; font-size: 0.9em;">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        
        activityLog.insertBefore(item, activityLog.firstChild);
        
        // حذف القديم
        if (activityLog.children.length > 20) {
            activityLog.removeChild(activityLog.lastChild);
        }
    }

    addRecommendation(recommendation) {
        const container = document.getElementById('ai-recommendations');
        if (!container) return;
        
        const item = document.createElement('div');
        item.style.cssText = `
            padding: 15px;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 10px;
            border-left: 3px solid #667eea;
            margin-bottom: 10px;
            animation: slideIn 0.3s ease;
        `;
        item.innerHTML = `
            <strong>🤖 ${recommendation.title}</strong>
            <p style="margin: 10px 0 0 0; opacity: 0.8;">${recommendation.description}</p>
        `;
        
        container.appendChild(item);
    }

    // ========================================
    // Interactive Features
    // ========================================
    
    addInteractivity() {
        // Hover effects on panels
        document.querySelectorAll('.dashboard-panel').forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                panel.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            panel.addEventListener('mouseleave', () => {
                panel.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Click to expand
        document.querySelectorAll('.dashboard-panel canvas').forEach(canvas => {
            canvas.style.cursor = 'pointer';
            canvas.addEventListener('click', () => {
                this.expandChart(canvas);
            });
        });
    }

    expandChart(canvas) {
        // إنشاء modal للعرض الموسع
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        const expandedCanvas = canvas.cloneNode(true);
        expandedCanvas.style.cssText = `
            max-width: 90vw;
            max-height: 90vh;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            border-radius: 20px;
        `;
        
        modal.appendChild(expandedCanvas);
        
        modal.addEventListener('click', () => {
            modal.remove();
        });
        
        document.body.appendChild(modal);
    }

    getRandomColor() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // ========================================
    // Animation Helpers
    // ========================================
    
    animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 16);
    }

    pulsate(element) {
        element.style.animation = 'pulse 1s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 1000);
    }

    // ========================================
    // Export & Screenshot
    // ========================================
    
    async exportDashboard(format = 'png') {
        console.log(`📸 تصدير Dashboard بصيغة ${format}...`);
        
        // في التطبيق الحقيقي، استخدم html2canvas أو مكتبة مشابهة
        return {
            success: true,
            format: format,
            message: 'تم التصدير بنجاح!'
        };
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

if (typeof window !== 'undefined') {
    window.Visualization3DDashboard = Visualization3DDashboard;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Visualization3DDashboard;
}