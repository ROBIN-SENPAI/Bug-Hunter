/**
 * CAI - Cybersecurity AI Hunter Pro
 * Configuration File - ملف الإعدادات الشامل (FIXED & ENHANCED)
 * Version: 5.0.1
 * 
 * التحسينات:
 * - إصلاح مشكلة localStorage
 * - إضافة validation للإعدادات
 * - تحسين إدارة الأخطاء
 * - إضافة export/import للإعدادات
 */

const CONFIG = {
    // معلومات التطبيق
    APP_NAME: 'CAI Hunter Pro',
    VERSION: '5.0.1',
    AUTHOR: 'Alias Robotics Enhanced',
    RELEASE_DATE: '2025-01-19',
    
    // مفاتيح API (تُحمل من localStorage عند التهيئة)
    API_KEYS: {
        OPENAI: '',
        GEMINI: '',
        CLAUDE: '',
        DEEPSEEK: '',
        OLLAMA: ''
    },
    
    // نقاط النهاية للـ APIs
    API_ENDPOINTS: {
        OPENAI: 'https://api.openai.com/v1/chat/completions',
        GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        CLAUDE: 'https://api.anthropic.com/v1/messages',
        DEEPSEEK: 'https://api.deepseek.com/v1/chat/completions',
        OLLAMA: 'http://localhost:11434/api/generate'
    },
    
    // إعدادات المسح
    SCAN: {
        DEFAULT_THREADS: 10,
        MAX_THREADS: 50,
        MIN_THREADS: 1,
        DEFAULT_TIMEOUT: 5000,
        MAX_TIMEOUT: 30000,
        MIN_TIMEOUT: 1000,
        DELAY_BETWEEN_REQUESTS: 100,
        MAX_RETRIES: 3,
        BATCH_SIZE: 20,
        ENABLE_ADAPTIVE_SCANNING: true,
        SMART_THROTTLING: true,
        // جديد: إعدادات متقدمة
        CONCURRENT_REQUESTS: 5,
        RETRY_DELAY: 2000,
        ENABLE_RATE_LIMIT_DETECTION: true
    },
    
    // أنواع الثغرات المدعومة
    VULNERABILITY_TYPES: {
        SQL_INJECTION: {
            name: 'SQL Injection',
            severity: 'Critical',
            category: 'Injection',
            cwe: 'CWE-89',
            owasp: 'A03:2021',
            description: 'ثغرة حقن SQL تسمح بالوصول غير المصرح لقاعدة البيانات',
            cvss: 9.8,
            remediation: 'استخدام Prepared Statements و Input Validation'
        },
        XSS: {
            name: 'Cross-Site Scripting',
            severity: 'High',
            category: 'Injection',
            cwe: 'CWE-79',
            owasp: 'A03:2021',
            description: 'ثغرة XSS تسمح بحقن كود JavaScript ضار',
            cvss: 7.3,
            remediation: 'تطبيق Content Security Policy و Output Encoding'
        },
        CSRF: {
            name: 'CSRF Token Bypass',
            severity: 'Medium',
            category: 'Authentication',
            cwe: 'CWE-352',
            owasp: 'A01:2021',
            description: 'تجاوز حماية CSRF للتلاعب بطلبات المستخدم',
            cvss: 6.5,
            remediation: 'استخدام CSRF Tokens و SameSite Cookies'
        },
        AUTH_BYPASS: {
            name: 'Authentication Bypass',
            severity: 'Critical',
            category: 'Authentication',
            cwe: 'CWE-287',
            owasp: 'A07:2021',
            description: 'تجاوز نظام المصادقة للوصول غير المصرح',
            cvss: 9.1,
            remediation: 'تطبيق MFA و Session Management القوي'
        },
        IDOR: {
            name: 'Insecure Direct Object Reference',
            severity: 'High',
            category: 'Authorization',
            cwe: 'CWE-639',
            owasp: 'A01:2021',
            description: 'الوصول المباشر للكائنات دون تحقق صحيح',
            cvss: 7.5,
            remediation: 'تطبيق Authorization Checks و Access Control'
        },
        XXE: {
            name: 'XML External Entity',
            severity: 'High',
            category: 'Injection',
            cwe: 'CWE-611',
            owasp: 'A05:2021',
            description: 'ثغرة XXE للوصول لملفات النظام',
            cvss: 8.2,
            remediation: 'تعطيل External Entities في XML Parser'
        },
        SSRF: {
            name: 'Server-Side Request Forgery',
            severity: 'High',
            category: 'Server',
            cwe: 'CWE-918',
            owasp: 'A10:2021',
            description: 'تزوير طلبات من جانب الخادم',
            cvss: 8.6,
            remediation: 'Whitelist URLs و Network Segmentation'
        },
        LFI: {
            name: 'Local File Inclusion',
            severity: 'High',
            category: 'File',
            cwe: 'CWE-98',
            owasp: 'A03:2021',
            description: 'تضمين ملفات محلية للوصول لمحتوى حساس',
            cvss: 7.8,
            remediation: 'Input Validation و Path Sanitization'
        },
        RCE: {
            name: 'Remote Code Execution',
            severity: 'Critical',
            category: 'Execution',
            cwe: 'CWE-94',
            owasp: 'A03:2021',
            description: 'تنفيذ كود عن بعد على الخادم',
            cvss: 10.0,
            remediation: 'Disable Dangerous Functions و Sandboxing'
        },
        DIRECTORY_TRAVERSAL: {
            name: 'Directory Traversal',
            severity: 'Medium',
            category: 'File',
            cwe: 'CWE-22',
            owasp: 'A01:2021',
            description: 'الوصول لمسارات غير مصرح بها',
            cvss: 6.8,
            remediation: 'Path Normalization و Access Controls'
        }
    },
    
    // مستويات الخطورة
    SEVERITY_LEVELS: {
        CRITICAL: {
            name: 'حرج',
            level: 5,
            color: '#dc2626',
            bgColor: 'rgba(220, 38, 38, 0.1)',
            borderColor: '#dc2626',
            bountyMin: 5000,
            bountyMax: 15000,
            priority: 1,
            sla: '4 hours'
        },
        HIGH: {
            name: 'عالي',
            level: 4,
            color: '#ef4444',
            bgColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: '#ef4444',
            bountyMin: 2000,
            bountyMax: 5000,
            priority: 2,
            sla: '24 hours'
        },
        MEDIUM: {
            name: 'متوسط',
            level: 3,
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)',
            borderColor: '#f59e0b',
            bountyMin: 500,
            bountyMax: 2000,
            priority: 3,
            sla: '7 days'
        },
        LOW: {
            name: 'منخفض',
            level: 2,
            color: '#3b82f6',
            bgColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: '#3b82f6',
            bountyMin: 100,
            bountyMax: 500,
            priority: 4,
            sla: '30 days'
        },
        INFO: {
            name: 'معلوماتي',
            level: 1,
            color: '#6366f1',
            bgColor: 'rgba(99, 102, 241, 0.1)',
            borderColor: '#6366f1',
            bountyMin: 0,
            bountyMax: 100,
            priority: 5,
            sla: 'Best effort'
        }
    },
    
    // نماذج الذكاء الاصطناعي
    AI_MODELS: {
        GPT4: {
            name: 'GPT-4 Turbo',
            provider: 'OpenAI',
            model: 'gpt-4-turbo-preview',
            maxTokens: 4096,
            temperature: 0.7,
            topP: 1,
            cost: 0.03,
            features: ['analysis', 'payload_generation', 'reporting'],
            enabled: true
        },
        GPT35: {
            name: 'GPT-3.5 Turbo',
            provider: 'OpenAI',
            model: 'gpt-3.5-turbo',
            maxTokens: 2048,
            temperature: 0.7,
            topP: 1,
            cost: 0.002,
            features: ['analysis', 'basic_detection'],
            enabled: true
        },
        CLAUDE: {
            name: 'Claude Sonnet 4.5',
            provider: 'Anthropic',
            model: 'claude-sonnet-4-5-20250929',
            maxTokens: 4096,
            temperature: 0.7,
            cost: 0.015,
            features: ['analysis', 'payload_generation', 'code_review'],
            enabled: true
        },
        GEMINI: {
            name: 'Gemini Pro',
            provider: 'Google',
            model: 'gemini-pro',
            maxTokens: 2048,
            temperature: 0.7,
            cost: 0.001,
            features: ['analysis', 'detection'],
            enabled: true
        },
        DEEPSEEK: {
            name: 'DeepSeek V3',
            provider: 'DeepSeek',
            model: 'deepseek-chat',
            maxTokens: 4096,
            temperature: 0.7,
            cost: 0.001,
            features: ['analysis', 'code_analysis'],
            enabled: true
        },
        OLLAMA: {
            name: 'Ollama Local',
            provider: 'Local',
            model: 'qwen2.5:14b',
            maxTokens: 2048,
            temperature: 0.7,
            cost: 0,
            features: ['offline_analysis', 'privacy'],
            enabled: false
        }
    },
    
    // إعدادات الشبكة
    NETWORK: {
        USER_AGENTS: [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ],
        HEADERS: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'DNT': '1'
        },
        PROXY: {
            enabled: false,
            list: [],
            rotation: true,
            timeout: 10000
        },
        RATE_LIMIT: {
            enabled: true,
            maxRequests: 100,
            timeWindow: 60000,
            backoff: true,
            backoffMultiplier: 1.5
        }
    },
    
    // إعدادات التقارير
    REPORTS: {
        AUTO_GENERATE: true,
        FORMATS: ['markdown', 'pdf', 'json', 'html', 'csv'],
        DEFAULT_FORMAT: 'markdown',
        INCLUDE_SCREENSHOTS: false,
        INCLUDE_PAYLOADS: true,
        INCLUDE_RECOMMENDATIONS: true,
        INCLUDE_POC: true,
        INCLUDE_CVSS: true,
        LANGUAGE: 'ar',
        TEMPLATE: 'professional'
    },
    
    // إعدادات الإشعارات
    NOTIFICATIONS: {
        SOUND: true,
        DESKTOP: false,
        EMAIL: false,
        WEBHOOK: false,
        SLACK: false,
        TELEGRAM: false,
        ALERT_ON_CRITICAL: true,
        ALERT_ON_HIGH: true,
        ALERT_ON_COMPLETE: true,
        ALERT_ON_ERROR: false
    },
    
    // إعدادات واجهة المستخدم
    UI: {
        THEME: 'dark',
        LANGUAGE: 'ar',
        ANIMATION_DURATION: 300,
        AUTO_SCROLL: true,
        MAX_LOG_LINES: 1000,
        SHOW_TIMESTAMPS: true,
        COMPACT_MODE: false,
        SHOW_PROGRESS_BAR: true,
        ENABLE_SOUND_EFFECTS: true,
        FONT_SIZE: 'medium'
    },
    
    // إعدادات التخزين
    STORAGE: {
        USE_LOCAL_STORAGE: true,
        AUTO_SAVE: true,
        SAVE_INTERVAL: 30000,
        MAX_HISTORY: 50,
        CLEAR_ON_EXIT: false,
        COMPRESS_DATA: false,
        ENCRYPTION_ENABLED: false
    },
    
    // إعدادات الأمان
    SECURITY: {
        VALIDATE_INPUT: true,
        SANITIZE_OUTPUT: true,
        MAX_URL_LENGTH: 2048,
        ALLOWED_PROTOCOLS: ['http:', 'https:'],
        BLOCK_INTERNAL_IPS: true,
        ENABLE_CSRF_PROTECTION: true,
        MAX_PAYLOAD_SIZE: 10240,
        ENABLE_XSS_PROTECTION: true
    },
    
    // إعدادات التصحيح
    DEBUG: {
        ENABLED: false,
        LOG_LEVEL: 'info',
        CONSOLE_OUTPUT: true,
        FILE_OUTPUT: false,
        SHOW_STACK_TRACE: false,
        VERBOSE: false,
        PERFORMANCE_MONITORING: false
    },
    
    // الأصوات (Base64 data URLs - مختصرة)
    SOUNDS: {
        SCAN_START: 'data:audio/wav;base64,UklGRnoGAABXQVZF',
        VULN_FOUND: 'data:audio/wav;base64,UklGRnoGAABXQVZF',
        SCAN_COMPLETE: 'data:audio/wav;base64,UklGRnoGAABXQVZF',
        ERROR: 'data:audio/wav;base64,UklGRnoGAABXQVZF'
    },
    
    // الرسائل
    MESSAGES: {
        ar: {
            SCAN_START: '🚀 بدء المسح الأمني بالذكاء الاصطناعي...',
            SCAN_COMPLETE: '✅ اكتمل المسح بنجاح!',
            SCAN_ERROR: '❌ حدث خطأ أثناء المسح',
            NO_VULNS: '✅ لم يتم العثور على ثغرات',
            VULNS_FOUND: '🚨 تم اكتشاف ثغرات أمنية!',
            AI_ANALYZING: '🧠 الذكاء الاصطناعي يحلل النتائج...',
            CRITICAL_FOUND: '⚠️ ثغرة حرجة! معالجة فورية مطلوبة',
            INVALID_URL: '❌ عنوان URL غير صالح',
            RATE_LIMITED: '⚠️ تم تجاوز حد الطلبات'
        },
        en: {
            SCAN_START: '🚀 Starting AI-powered security scan...',
            SCAN_COMPLETE: '✅ Scan completed successfully!',
            SCAN_ERROR: '❌ Error occurred during scan',
            NO_VULNS: '✅ No vulnerabilities found',
            VULNS_FOUND: '🚨 Security vulnerabilities detected!',
            AI_ANALYZING: '🧠 AI analyzing results...',
            CRITICAL_FOUND: '⚠️ Critical vulnerability! Immediate action required',
            INVALID_URL: '❌ Invalid URL',
            RATE_LIMITED: '⚠️ Rate limit exceeded'
        }
    },
    
    // إخلاء المسؤولية القانوني
    LEGAL: {
        DISCLAIMER: 'هذه الأداة للاستخدام القانوني المصرح به فقط. الوصول غير المصرح إلى الأنظمة غير قانوني.',
        WARNING: 'استخدم هذه الأداة بمسؤولية وفقط على الأنظمة التي تملك إذناً بفحصها.',
        COPYRIGHT: '© 2025 CAI Hunter Pro. جميع الحقوق محفوظة.',
        LICENSE: 'MIT License',
        CONTACT: 'security@caihunter.pro'
    },
    
    // === وظائف مساعدة محسّنة ===
    
    // حفظ مفتاح API مع Validation
    saveApiKey(service, key) {
        if (!service || !key) {
            this.log('error', 'خدمة أو مفتاح غير صالح');
            return false;
        }
        
        const storageKey = `cai_${service.toLowerCase()}_key`;
        
        try {
            localStorage.setItem(storageKey, key);
            this.API_KEYS[service.toUpperCase()] = key;
            this.log('info', `✅ تم حفظ مفتاح ${service}`);
            return true;
        } catch (error) {
            this.log('error', `فشل حفظ مفتاح ${service}`, error);
            return false;
        }
    },
    
    // الحصول على مفتاح API
    getApiKey(service) {
        const key = this.API_KEYS[service.toUpperCase()];
        if (!key) {
            this.log('warn', `مفتاح ${service} غير موجود`);
        }
        return key || '';
    },
    
    // حذف مفتاح API
    deleteApiKey(service) {
        const storageKey = `cai_${service.toLowerCase()}_key`;
        localStorage.removeItem(storageKey);
        this.API_KEYS[service.toUpperCase()] = '';
        this.log('info', `تم حذف مفتاح ${service}`);
    },
    
    // التحقق من صحة URL محسّن
    validateUrl(url) {
        if (!url || typeof url !== 'string' || url.trim() === '') {
            return false;
        }
        
        try {
            const urlObj = new URL(url);
            
            // التحقق من البروتوكول
            if (!this.SECURITY.ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
                this.log('warn', `بروتوكول غير مسموح: ${urlObj.protocol}`);
                return false;
            }
            
            // التحقق من طول URL
            if (url.length > this.SECURITY.MAX_URL_LENGTH) {
                this.log('warn', 'URL طويل جداً');
                return false;
            }
            
            // حظر IPs الداخلية إذا كان مفعلاً
            if (this.SECURITY.BLOCK_INTERNAL_IPS) {
                const hostname = urlObj.hostname.toLowerCase();
                const blockedPatterns = [
                    'localhost',
                    '127.0.0.1',
                    '0.0.0.0',
                    '::1'
                ];
                
                const blockedRanges = [
                    /^192\.168\./,
                    /^10\./,
                    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
                    /^169\.254\./
                ];
                
                if (blockedPatterns.includes(hostname)) {
                    this.log('warn', 'محاولة الوصول لـ localhost محظور');
                    return false;
                }
                
                for (const pattern of blockedRanges) {
                    if (pattern.test(hostname)) {
                        this.log('warn', 'محاولة الوصول لـ IP داخلي محظور');
                        return false;
                    }
                }
            }
            
            return true;
        } catch (error) {
            this.log('error', 'URL غير صالح', error);
            return false;
        }
    },
    
    // حساب قيمة Bug Bounty محسّن
    calculateBountyValue(severity, confidence) {
        const severityData = this.SEVERITY_LEVELS[severity];
        if (!severityData) {
            this.log('warn', `مستوى خطورة غير معروف: ${severity}`);
            return 0;
        }
        
        const baseValue = (severityData.bountyMin + severityData.bountyMax) / 2;
        const confidenceMultiplier = Math.max(0, Math.min(confidence, 100)) / 100;
        
        // معادلة محسّنة
        const finalValue = baseValue * (0.5 + confidenceMultiplier * 0.5);
        
        return Math.round(finalValue);
    },
    
    // التحقق من تجاوز معدل الطلبات محسّن
    isRateLimited() {
        if (!this.NETWORK.RATE_LIMIT.enabled) {
            return false;
        }
        
        try {
            const now = Date.now();
            const requests = JSON.parse(localStorage.getItem('cai_rate_limit') || '[]');
            
            // تنظيف الطلبات القديمة
            const validRequests = requests.filter(
                time => now - time < this.NETWORK.RATE_LIMIT.timeWindow
            );
            
            if (validRequests.length >= this.NETWORK.RATE_LIMIT.maxRequests) {
                this.log('warn', `تم تجاوز حد الطلبات: ${validRequests.length}/${this.NETWORK.RATE_LIMIT.maxRequests}`);
                return true;
            }
            
            // إضافة الطلب الحالي
            validRequests.push(now);
            localStorage.setItem('cai_rate_limit', JSON.stringify(validRequests));
            
            return false;
        } catch (error) {
            this.log('error', 'خطأ في فحص Rate Limit', error);
            return false;
        }
    },
    
    // إعادة تعيين Rate Limit
    resetRateLimit() {
        localStorage.removeItem('cai_rate_limit');
        this.log('info', 'تم إعادة تعيين Rate Limit');
    },
    
    // تسجيل محسّن (Logging)
    log(level, message, data = null) {
        if (!this.DEBUG.ENABLED && level === 'debug') {
            return;
        }
        
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level: level.toUpperCase(),
            message,
            data
        };
        
        // Console Output
        if (this.DEBUG.CONSOLE_OUTPUT) {
            const logMethod = console[level] || console.log;
            const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
            
            if (data) {
                logMethod.call(console, prefix, message, data);
            } else {
                logMethod.call(console, prefix, message);
            }
        }
        
        // File Output (Storage)
        if (this.DEBUG.FILE_OUTPUT) {
            this.saveLogToStorage(logEntry);
        }
    },
    
    // حفظ السجلات
    saveLogToStorage(logEntry) {
        try {
            const logs = JSON.parse(localStorage.getItem('cai_logs') || '[]');
            logs.push(logEntry);
            
            // حد أقصى 1000 سجل
            if (logs.length > 1000) {
                logs.shift();
            }
            
            localStorage.setItem('cai_logs', JSON.stringify(logs));
        } catch (error) {
            console.error('فشل حفظ السجل:', error);
        }
    },
    
    // الحصول على السجلات
    getLogs(limit = 100) {
        try {
            const logs = JSON.parse(localStorage.getItem('cai_logs') || '[]');
            return logs.slice(-limit);
        } catch (error) {
            this.log('error', 'فشل جلب السجلات', error);
            return [];
        }
    },
    
    // مسح السجلات
    clearLogs() {
        localStorage.removeItem('cai_logs');
        this.log('info', 'تم مسح جميع السجلات');
    },
    
    // تشغيل الصوت
    playSound(soundName) {
        if (!this.NOTIFICATIONS.SOUND || !this.UI.ENABLE_SOUND_EFFECTS) {
            return;
        }
        
        const soundData = this.SOUNDS[soundName];
        if (!soundData) {
            this.log('warn', `صوت غير موجود: ${soundName}`);
            return;
        }
        
        try {
            const audio = new Audio(soundData);
            audio.volume = 0.3;
            audio.play().catch(error => {
                this.log('debug', 'فشل تشغيل الصوت', error);
            });
        } catch (error) {
            this.log('error', 'خطأ في تشغيل الصوت', error);
        }
    },
    
    // إظهار إشعار سطح المكتب
    showDesktopNotification(title, body, options = {}) {
        if (!this.NOTIFICATIONS.DESKTOP) {
            return;
        }
        
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body: body,
                    icon: options.icon || '🛡️',
                    badge: options.badge || '🛡️',
                    tag: options.tag || 'cai-notification',
                    requireInteraction: options.requireInteraction || false
                });
            } catch (error) {
                this.log('error', 'فشل إظهار الإشعار', error);
            }
        }
    },
    
    // طلب صلاحية الإشعارات
    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                this.log('info', `صلاحية الإشعارات: ${permission}`);
                return permission === 'granted';
            } catch (error) {
                this.log('error', 'فشل طلب صلاحية الإشعارات', error);
                return false;
            }
        }
        return Notification.permission === 'granted';
    },
    
    // حفظ الإعدادات
    saveSettings(settings = {}) {
        try {
            Object.keys(settings).forEach(key => {
                const value = settings[key];
                localStorage.setItem(`cai_setting_${key}`, JSON.stringify(value));
            });
            this.log('info', 'تم حفظ الإعدادات');
            return true;
        } catch (error) {
            this.log('error', 'فشل حفظ الإعدادات', error);
            return false;
        }
    },
    
    // تحميل الإعدادات
    loadSettings() {
        try {
            const settings = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('cai_setting_')) {
                    const settingName = key.replace('cai_setting_', '');
                    const value = localStorage.getItem(key);
                    settings[settingName] = JSON.parse(value);
                }
            }
            return settings;
        } catch (error) {
            this.log('error', 'فشل تحميل الإعدادات', error);
            return {};
        }
    },
    
    // إعادة تعيين الإعدادات
    resetSettings() {
        try {
            const keys = Object.keys(localStorage).filter(key => 
                key.startsWith('cai_setting_')
            );
            keys.forEach(key => localStorage.removeItem(key));
            this.log('info', 'تم إعادة تعيين الإعدادات');
            return true;
        } catch (error) {
            this.log('error', 'فشل إعادة تعيين الإعدادات', error);
            return false;
        }
    },
    
    // تصدير الإعدادات
    exportSettings() {
        try {
            const exportData = {
                version: this.VERSION,
                timestamp: new Date().toISOString(),
                settings: this.loadSettings(),
                apiKeys: Object.keys(this.API_KEYS).reduce((acc, key) => {
                    acc[key] = this.API_KEYS[key] ? '***HIDDEN***' : '';
                    return acc;
                }, {})
            };
            
            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            this.log('error', 'فشل تصدير الإعدادات', error);
            return null;
        }
    },
    
    // استيراد الإعدادات
    importSettings(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            if (data.version !== this.VERSION) {
                this.log('warn', `إصدار مختلف: ${data.version} vs ${this.VERSION}`);
            }
            
            if (data.settings) {
                this.saveSettings(data.settings);
            }
            
            this.log('info', 'تم استيراد الإعدادات بنجاح');
            return true;
        } catch (error) {
            this.log('error', 'فشل استيراد الإعدادات', error);
            return false;
        }
    },
    
    // الحصول على رسالة بناءً على اللغة
    getMessage(key) {
        const language = this.UI.LANGUAGE;
        const messages = this.MESSAGES[language] || this.MESSAGES.ar;
        return messages[key] || key;
    },
    
    // التحقق من صحة الإعدادات
    validateSettings() {
        const issues = [];
        
        // التحقق من SCAN
        if (this.SCAN.DEFAULT_THREADS < this.SCAN.MIN_THREADS) {
            issues.push('DEFAULT_THREADS أقل من MIN_THREADS');
        }
        if (this.SCAN.DEFAULT_THREADS > this.SCAN.MAX_THREADS) {
            issues.push('DEFAULT_THREADS أكبر من MAX_THREADS');
        }
        
        // التحقق من TIMEOUT
        if (this.SCAN.DEFAULT_TIMEOUT < this.SCAN.MIN_TIMEOUT) {
            issues.push('DEFAULT_TIMEOUT أقل من MIN_TIMEOUT');
        }
        if (this.SCAN.DEFAULT_TIMEOUT > this.SCAN.MAX_TIMEOUT) {
            issues.push('DEFAULT_TIMEOUT أكبر من MAX_TIMEOUT');
        }
        
        // التحقق من Rate Limit
        if (this.NETWORK.RATE_LIMIT.maxRequests <= 0) {
            issues.push('maxRequests يجب أن يكون أكبر من 0');
        }
        
        if (issues.length > 0) {
            this.log('warn', 'مشاكل في الإعدادات:', issues);
            return { valid: false, issues };
        }
        
        return { valid: true, issues: [] };
    },
    
    // الحصول على معلومات النظام
    getSystemInfo() {
        return {
            appName: this.APP_NAME,
            version: this.VERSION,
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            language: navigator.language,
            online: navigator.onLine,
            storageAvailable: this.isStorageAvailable(),
            notificationsEnabled: 'Notification' in window && Notification.permission === 'granted'
        };
    },
    
    // التحقق من توفر التخزين
    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    },
    
    // مسح جميع البيانات
    clearAllData() {
        if (confirm('هل أنت متأكد من حذف جميع البيانات؟')) {
            try {
                // مسح كل شيء ما عدا مفاتيح API
                const apiKeys = {};
                Object.keys(this.API_KEYS).forEach(key => {
                    apiKeys[key] = this.getApiKey(key);
                });
                
                // مسح localStorage
                const keysToKeep = Object.keys(apiKeys)
                    .filter(k => apiKeys[k])
                    .map(k => `cai_${k.toLowerCase()}_key`);
                
                Object.keys(localStorage)
                    .filter(key => key.startsWith('cai_') && !keysToKeep.includes(key))
                    .forEach(key => localStorage.removeItem(key));
                
                this.log('info', 'تم مسح جميع البيانات');
                return true;
            } catch (error) {
                this.log('error', 'فشل مسح البيانات', error);
                return false;
            }
        }
        return false;
    },
    
    // حساب حجم التخزين المستخدم
    getStorageSize() {
        try {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key) && key.startsWith('cai_')) {
                    total += localStorage[key].length + key.length;
                }
            }
            return {
                bytes: total,
                kb: (total / 1024).toFixed(2),
                mb: (total / 1024 / 1024).toFixed(2)
            };
        } catch (error) {
            this.log('error', 'فشل حساب حجم التخزين', error);
            return { bytes: 0, kb: 0, mb: 0 };
        }
    },
    
    // التهيئة الأولية المحسّنة
    init() {
        this.log('info', '🚀 بدء تهيئة CAI Hunter Pro...');
        
        try {
            // التحقق من توفر التخزين
            if (!this.isStorageAvailable()) {
                console.error('❌ localStorage غير متوفر!');
                return false;
            }
            
            // تحميل مفاتيح API
            this.API_KEYS.OPENAI = localStorage.getItem('cai_openai_key') || '';
            this.API_KEYS.GEMINI = localStorage.getItem('cai_gemini_key') || '';
            this.API_KEYS.CLAUDE = localStorage.getItem('cai_claude_key') || '';
            this.API_KEYS.DEEPSEEK = localStorage.getItem('cai_deepseek_key') || '';
            this.API_KEYS.OLLAMA = localStorage.getItem('cai_ollama_key') || '';
            
            // تحميل إعدادات UI
            this.UI.THEME = localStorage.getItem('cai_theme') || 'dark';
            this.UI.LANGUAGE = localStorage.getItem('cai_language') || 'ar';
            
            // تحميل الإعدادات المحفوظة
            const savedSettings = this.loadSettings();
            if (Object.keys(savedSettings).length > 0) {
                Object.assign(this, savedSettings);
                this.log('info', '📦 تم تحميل الإعدادات المحفوظة');
            }
            
            // تطبيق السمة
            if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('data-theme', this.UI.THEME);
                document.documentElement.setAttribute('lang', this.UI.LANGUAGE);
            }
            
            // طلب صلاحية الإشعارات
            if (this.NOTIFICATIONS.DESKTOP) {
                this.requestNotificationPermission();
            }
            
            // التحقق من صحة الإعدادات
            const validation = this.validateSettings();
            if (!validation.valid) {
                this.log('warn', '⚠️ بعض الإعدادات غير صحيحة', validation.issues);
            }
            
            // عرض معلومات النظام
            const systemInfo = this.getSystemInfo();
            this.log('info', '💻 معلومات النظام:', systemInfo);
            
            // عرض حجم التخزين
            const storageSize = this.getStorageSize();
            this.log('info', `💾 حجم التخزين: ${storageSize.kb} KB`);
            
            this.log('info', `✅ CAI Hunter Pro v${this.VERSION} جاهز`);
            
            // عرض رسالة ترحيب في Console
            if (typeof console !== 'undefined') {
                console.log('%c🛡️ CAI Hunter Pro - AI Edition v' + this.VERSION, 
                    'color: #6366f1; font-size: 20px; font-weight: bold;');
                console.log('%c🧠 Neural Security Engine Active', 
                    'color: #10b981; font-size: 14px;');
                console.log('%c⚠️ للاستخدام المصرح به فقط', 
                    'color: #ef4444; font-size: 12px;');
            }
            
            return true;
        } catch (error) {
            this.log('error', '❌ فشل التهيئة', error);
            return false;
        }
    }
};

// تهيئة تلقائية عند التحميل
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    
    // تهيئة عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            CONFIG.init();
        });
    } else {
        CONFIG.init();
    }
}

// تصدير للاستخدام في Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}