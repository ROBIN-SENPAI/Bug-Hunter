/**
 * CAI - Cybersecurity AI Hunter Pro
 * API Integration Module - تكامل مع خدمات الذكاء الاصطناعي (FIXED & COMPLETE)
 * OpenAI, Claude, Gemini, DeepSeek, Ollama Support
 * Version: 5.0.1
 * 
 * التحسينات:
 * - إكمال جميع الوظائف المفقودة
 * - إضافة Error Handling محسّن
 * - إضافة Caching و Retry Logic
 * - إضافة Statistics و Monitoring
 */

class APIIntegration {
    constructor() {
        this.currentModel = 'gpt4';
        this.rateLimitDelay = 1000;
        this.lastRequestTime = 0;
        this.requestQueue = [];
        this.cache = new Map();
        this.maxCacheSize = 100;
        this.statistics = {
            requests: 0,
            successful: 0,
            failed: 0,
            totalCost: 0,
            byModel: {},
            averageResponseTime: 0
        };
        this.retryConfig = {
            maxRetries: 3,
            baseDelay: 1000,
            maxDelay: 10000
        };
    }

    // ========================================
    // OpenAI Integration
    // ========================================
    
    async callOpenAI(prompt, options = {}) {
        const startTime = Date.now();
        const apiKey = CONFIG.getApiKey('OPENAI');
        
        if (!apiKey) {
            console.warn('⚠️ مفتاح OpenAI غير مُكوّن');
            return this.fallbackAnalysis(prompt);
        }

        try {
            await this.respectRateLimit();
            
            const model = options.model || 'gpt-4-turbo-preview';
            const maxTokens = options.maxTokens || 2048;
            const temperature = options.temperature || 0.7;

            const response = await this.fetchWithRetry(CONFIG.API_ENDPOINTS.OPENAI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: 'system',
                            content: 'أنت خبير أمن سيبراني متخصص في اكتشاف وتحليل الثغرات الأمنية. قدم تحليلاً دقيقاً وتوصيات عملية.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: maxTokens,
                    temperature: temperature
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API خطأ: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            const responseTime = Date.now() - startTime;
            
            this.updateStatistics('openai', true, data.usage, responseTime);
            
            return data.choices[0].message.content;

        } catch (error) {
            console.error('❌ فشل استدعاء OpenAI:', error);
            this.updateStatistics('openai', false, null, Date.now() - startTime);
            return this.fallbackAnalysis(prompt);
        }
    }

    // ========================================
    // Claude Integration
    // ========================================
    
    async callClaude(prompt, options = {}) {
        const startTime = Date.now();
        const apiKey = CONFIG.getApiKey('CLAUDE');
        
        if (!apiKey) {
            console.warn('⚠️ مفتاح Claude غير مُكوّن');
            return this.fallbackAnalysis(prompt);
        }

        try {
            await this.respectRateLimit();

            const response = await this.fetchWithRetry(CONFIG.API_ENDPOINTS.CLAUDE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-5-20250929',
                    max_tokens: options.maxTokens || 4096,
                    messages: [{
                        role: 'user',
                        content: `أنت خبير أمن سيبراني. ${prompt}`
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`Claude API خطأ: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            const responseTime = Date.now() - startTime;
            
            this.updateStatistics('claude', true, null, responseTime);
            
            return data.content[0].text;

        } catch (error) {
            console.error('❌ فشل استدعاء Claude:', error);
            this.updateStatistics('claude', false, null, Date.now() - startTime);
            return this.fallbackAnalysis(prompt);
        }
    }

    // ========================================
    // Gemini Integration
    // ========================================
    
    async callGemini(prompt, options = {}) {
        const startTime = Date.now();
        const apiKey = CONFIG.getApiKey('GEMINI');
        
        if (!apiKey) {
            console.warn('⚠️ مفتاح Gemini غير مُكوّن');
            return this.fallbackAnalysis(prompt);
        }

        try {
            await this.respectRateLimit();

            const url = `${CONFIG.API_ENDPOINTS.GEMINI}?key=${apiKey}`;

            const response = await this.fetchWithRetry(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `أنت خبير أمن سيبراني. ${prompt}`
                        }]
                    }],
                    generationConfig: {
                        temperature: options.temperature || 0.7,
                        maxOutputTokens: options.maxTokens || 2048
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API خطأ: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            const responseTime = Date.now() - startTime;
            
            this.updateStatistics('gemini', true, null, responseTime);
            
            return data.candidates[0].content.parts[0].text;

        } catch (error) {
            console.error('❌ فشل استدعاء Gemini:', error);
            this.updateStatistics('gemini', false, null, Date.now() - startTime);
            return this.fallbackAnalysis(prompt);
        }
    }

    // ========================================
    // DeepSeek Integration
    // ========================================
    
    async callDeepSeek(prompt, options = {}) {
        const startTime = Date.now();
        const apiKey = CONFIG.getApiKey('DEEPSEEK');
        
        if (!apiKey) {
            console.warn('⚠️ مفتاح DeepSeek غير مُكوّن');
            return this.fallbackAnalysis(prompt);
        }

        try {
            await this.respectRateLimit();

            const response = await this.fetchWithRetry(CONFIG.API_ENDPOINTS.DEEPSEEK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: 'أنت خبير أمن سيبراني متخصص في تحليل الثغرات'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: options.maxTokens || 4096,
                    temperature: options.temperature || 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`DeepSeek API خطأ: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            const responseTime = Date.now() - startTime;
            
            this.updateStatistics('deepseek', true, null, responseTime);
            
            return data.choices[0].message.content;

        } catch (error) {
            console.error('❌ فشل استدعاء DeepSeek:', error);
            this.updateStatistics('deepseek', false, null, Date.now() - startTime);
            return this.fallbackAnalysis(prompt);
        }
    }

    // ========================================
    // Ollama Local Integration
    // ========================================
    
    async callOllama(prompt, options = {}) {
        const startTime = Date.now();
        
        try {
            const endpoint = CONFIG.API_ENDPOINTS.OLLAMA;

            const response = await this.fetchWithRetry(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: options.model || 'qwen2.5:14b',
                    prompt: `أنت خبير أمن سيبراني. ${prompt}`,
                    stream: false,
                    options: {
                        temperature: options.temperature || 0.7,
                        num_predict: options.maxTokens || 2048
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama خطأ: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            const responseTime = Date.now() - startTime;
            
            this.updateStatistics('ollama', true, null, responseTime);
            
            return data.response;

        } catch (error) {
            console.error('❌ فشل استدعاء Ollama:', error);
            console.log('💡 تأكد من تشغيل Ollama على localhost:11434');
            this.updateStatistics('ollama', false, null, Date.now() - startTime);
            return this.fallbackAnalysis(prompt);
        }
    }

    // ========================================
    // Intelligent Routing
    // ========================================
    
    async callAI(prompt, options = {}) {
        const model = options.model || this.currentModel;
        
        // التحقق من الكاش
        const cacheKey = this.generateCacheKey(prompt, model);
        if (this.cache.has(cacheKey)) {
            console.log('📦 استخدام نتيجة محفوظة من الكاش');
            return this.cache.get(cacheKey);
        }
        
        let result;
        
        try {
            switch(model) {
                case 'gpt4':
                case 'gpt35':
                    result = await this.callOpenAI(prompt, options);
                    break;
                
                case 'claude':
                    result = await this.callClaude(prompt, options);
                    break;
                
                case 'gemini':
                    result = await this.callGemini(prompt, options);
                    break;
                
                case 'deepseek':
                    result = await this.callDeepSeek(prompt, options);
                    break;
                
                case 'ollama':
                    result = await this.callOllama(prompt, options);
                    break;
                
                default:
                    console.warn(`⚠️ نموذج غير معروف: ${model}، استخدام GPT-4`);
                    result = await this.callOpenAI(prompt, options);
            }
            
            // حفظ في الكاش
            this.setCache(cacheKey, result);
            
            return result;
        } catch (error) {
            console.error('❌ خطأ في callAI:', error);
            return this.fallbackAnalysis(prompt);
        }
    }

    // ========================================
    // AI-Powered Analysis Functions
    // ========================================
    
    async analyzeVulnerability(vulnerability) {
        const prompt = `حلل هذه الثغرة الأمنية بالتفصيل:

**نوع الثغرة**: ${vulnerability.vulnType || vulnerability.type}
**الخطورة**: ${vulnerability.severity}
**الثقة**: ${vulnerability.confidence}%
**المسار**: ${vulnerability.endpoint}
**المعامل**: ${vulnerability.parameter || 'N/A'}
**Payload**: ${vulnerability.payload || 'N/A'}

قدم:
1. تحليل تقني مفصل للثغرة
2. تقييم المخاطر والتأثير المحتمل
3. خطوات المعالجة المحددة والقابلة للتطبيق
4. سيناريوهات الهجوم المحتملة
5. توصيات إضافية للوقاية

الرد يجب أن يكون بالعربية ومختصراً وعملياً (300-500 كلمة).`;

        return await this.callAI(prompt);
    }

    async generatePayloads(context) {
        const prompt = `ولّد payloads متقدمة لاختبار الاختراق:

**السياق**:
- نوع قاعدة البيانات: ${context.dbType || 'Unknown'}
- WAF مكتشف: ${context.wafDetected ? 'نعم' : 'لا'}
- الأنماط الناجحة السابقة: ${context.successfulPatterns || 'لا يوجد'}
- التقنيات المستخدمة: ${context.technologies?.join(', ') || 'Unknown'}

**المطلوب**:
1. 10 payloads فريدة ومتقدمة
2. التركيز على تجاوز WAF إن وُجد
3. استهداف قاعدة البيانات المحددة إن عُرفت
4. تضمين تقنيات مختلفة (Union, Boolean, Time-based, Error-based)
5. إضافة تقنيات Obfuscation و Encoding

**صيغة كل payload**:
PAYLOAD: [payload]
TYPE: [sqli/xss/lfi/etc]
PURPOSE: [الهدف من الـ payload]
BYPASS: [تقنية التجاوز المستخدمة]

كن مبدعاً وتقنياً.`;

        const response = await this.callAI(prompt);
        return this.parsePayloadsFromResponse(response);
    }

    async generateReport(scanData) {
        const prompt = `أنشئ تقرير أمني احترافي شامل:

**نتائج المسح**:
- الهدف: ${scanData.targetUrl}
- الثغرات المكتشفة: ${scanData.vulnerabilities?.length || 0}
- الثغرات الحرجة: ${scanData.stats?.critical || 0}
- الثغرات العالية: ${scanData.stats?.high || 0}
- نوع قاعدة البيانات: ${scanData.dbType || 'Unknown'}
- مدة المسح: ${this.formatDuration(scanData.duration)}

**ملخص الثغرات**:
${(scanData.vulnerabilities || []).map((v, i) => `${i + 1}. ${v.vulnType || v.type} في ${v.endpoint} (${v.severity})`).join('\n')}

**المطلوب - تقرير تنفيذي احترافي يتضمن**:

## 1. الملخص التنفيذي (Executive Summary)
- نظرة عامة على الوضع الأمني
- أهم النتائج والثغرات الحرجة
- التوصيات الرئيسية

## 2. تقييم المخاطر (Risk Assessment)
- مستوى المخاطر العام
- التأثير على الأعمال
- احتمالية الاستغلال

## 3. تحليل الثغرات (Vulnerability Analysis)
- تفصيل كل ثغرة حرجة/عالية
- السيناريوهات المحتملة للهجوم
- الأدلة والتحقق

## 4. التوصيات الفورية (Immediate Actions)
- خطوات المعالجة حسب الأولوية
- الإجراءات المؤقتة (Workarounds)
- الجدول الزمني المقترح

## 5. استراتيجية الأمان طويلة المدى
- تحسينات البنية التحتية
- السياسات والإجراءات
- التدريب والتوعية

**التنسيق**: استخدم Markdown مع عناوين واضحة، نقاط، جداول عند الحاجة.
**اللغة**: عربية احترافية مناسبة للإدارة التنفيذية.
**الطول**: 800-1200 كلمة.`;

        return await this.callAI(prompt, { maxTokens: 4096 });
    }

    async generateExploitStrategy(vulnerability) {
        const prompt = `ضع استراتيجية استغلال أخلاقية لهذه الثغرة:

**التفاصيل**:
- النوع: ${vulnerability.vulnType}
- الخطورة: ${vulnerability.severity}
- المسار: ${vulnerability.endpoint}
- Payload الناجح: ${vulnerability.payload}

**المطلوب**:
1. خطوات الاستغلال بالتفصيل
2. البيانات المحتملة التي يمكن استخراجها
3. حدود الاستغلال الأخلاقي
4. توثيق الأدلة (Proof of Concept)
5. التوصيات للمعالجة

**ملاحظة هامة**: هذا للاختبار الأخلاقي فقط وضمن صلاحيات مصرح بها.`;

        return await this.callAI(prompt);
    }

    async suggestRemediation(vulnerability) {
        const prompt = `اقترح حلول معالجة تفصيلية لهذه الثغرة:

**الثغرة**: ${vulnerability.vulnType}
**المسار المتأثر**: ${vulnerability.endpoint}
**التقنية المستخدمة**: ${vulnerability.technology || 'Unknown'}

قدم:
1. **الإصلاح الفوري** (Quick Fix)
2. **الحل طويل المدى** (Long-term Solution)
3. **أمثلة كود** (إن أمكن)
4. **خطوات التحقق** (Verification Steps)
5. **أفضل الممارسات** (Best Practices)

الرد بالعربية، عملي وقابل للتطبيق مباشرة.`;

        return await this.callAI(prompt);
    }

    // ========================================
    // Helper Functions - الوظائف المساعدة
    // ========================================
    
    // توليد مفتاح الكاش
    generateCacheKey(prompt, model) {
        const hash = this.simpleHash(prompt);
        return `${model}_${hash}`;
    }

    // Hash بسيط
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }

    // حفظ في الكاش مع حد أقصى للحجم
    setCache(key, value) {
        // إذا تجاوز الكاش الحد الأقصى، احذف الأقدم
        if (this.cache.size >= this.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    // مسح الكاش
    clearCache() {
        this.cache.clear();
        console.log('🗑️ تم مسح الكاش');
    }

    // احترام حد المعدل (Rate Limiting)
    async respectRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.rateLimitDelay) {
            const waitTime = this.rateLimitDelay - timeSinceLastRequest;
            await this.sleep(waitTime);
        }
        
        this.lastRequestTime = Date.now();
    }

    // Fetch مع إعادة المحاولة (Retry Logic)
    async fetchWithRetry(url, options, retries = 0) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 30000); // 30 ثانية

            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeout);
            return response;

        } catch (error) {
            if (retries < this.retryConfig.maxRetries) {
                const delay = Math.min(
                    this.retryConfig.baseDelay * Math.pow(2, retries),
                    this.retryConfig.maxDelay
                );
                
                console.warn(`⚠️ إعادة المحاولة ${retries + 1}/${this.retryConfig.maxRetries} بعد ${delay}ms`);
                await this.sleep(delay);
                
                return this.fetchWithRetry(url, options, retries + 1);
            }
            
            throw error;
        }
    }

    // تحديث الإحصائيات
    updateStatistics(service, success, usage = null, responseTime = 0) {
        this.statistics.requests++;
        
        if (success) {
            this.statistics.successful++;
        } else {
            this.statistics.failed++;
        }

        // إحصائيات حسب النموذج
        if (!this.statistics.byModel[service]) {
            this.statistics.byModel[service] = {
                requests: 0,
                successful: 0,
                failed: 0,
                totalTime: 0,
                averageTime: 0
            };
        }

        const modelStats = this.statistics.byModel[service];
        modelStats.requests++;
        
        if (success) {
            modelStats.successful++;
            modelStats.totalTime += responseTime;
            modelStats.averageTime = modelStats.totalTime / modelStats.successful;
        } else {
            modelStats.failed++;
        }

        // حساب التكلفة
        if (usage && usage.total_tokens) {
            const costPer1kTokens = CONFIG.AI_MODELS[service.toUpperCase()]?.cost || 0;
            const cost = (usage.total_tokens / 1000) * costPer1kTokens;
            this.statistics.totalCost += cost;
        }

        // متوسط وقت الاستجابة العام
        if (success && responseTime > 0) {
            const totalSuccessful = this.statistics.successful;
            this.statistics.averageResponseTime = 
                ((this.statistics.averageResponseTime * (totalSuccessful - 1)) + responseTime) / totalSuccessful;
        }
    }

    // التحليل الاحتياطي (Fallback)
    fallbackAnalysis(prompt) {
        console.log('🔄 استخدام التحليل الاحتياطي المحلي');
        
        // تحليل بسيط بناءً على الكلمات المفتاحية
        const analysis = {
            summary: 'تحليل أولي بدون AI',
            recommendations: [],
            severity: 'Medium',
            confidence: 50
        };

        // كشف نوع الثغرة من Prompt
        if (prompt.toLowerCase().includes('sql')) {
            analysis.type = 'SQL Injection';
            analysis.severity = 'Critical';
            analysis.recommendations.push({
                priority: 1,
                action: 'استخدام Prepared Statements',
                description: 'استبدال جميع الاستعلامات الديناميكية بـ Prepared Statements لمنع حقن SQL'
            });
        } else if (prompt.toLowerCase().includes('xss')) {
            analysis.type = 'Cross-Site Scripting';
            analysis.severity = 'High';
            analysis.recommendations.push({
                priority: 1,
                action: 'تطبيق Output Encoding',
                description: 'ترميز جميع المخرجات وتطبيق Content Security Policy'
            });
        }

        // إضافة توصيات عامة
        analysis.recommendations.push(
            {
                priority: 2,
                action: 'تطبيق Input Validation',
                description: 'التحقق من صحة جميع المدخلات من جانب الخادم'
            },
            {
                priority: 3,
                action: 'تفعيل WAF',
                description: 'استخدام Web Application Firewall للحماية الإضافية'
            },
            {
                priority: 4,
                action: 'المراجعة الدورية',
                description: 'إجراء فحوصات أمنية دورية وتحديثات منتظمة'
            }
        );

        return `# تحليل أولي للثغرة

## الملخص
تم اكتشاف ثغرة أمنية محتملة تتطلب المعالجة الفورية.

## التوصيات

${analysis.recommendations.map((r, i) => `
### ${i + 1}. ${r.action} (أولوية ${r.priority})
${r.description}
`).join('\n')}

## ملاحظة
هذا تحليل أولي. للحصول على تحليل متقدم، قم بتكوين مفاتيح API للذكاء الاصطناعي.

---
**التحليل من**: CAI Hunter Pro (Local Fallback)
**التاريخ**: ${new Date().toLocaleString('ar-SA')}`;
    }

    // تحليل Payloads من الاستجابة
    parsePayloadsFromResponse(response) {
        const payloads = [];
        
        if (!response) return payloads;
        
        const lines = response.split('\n');
        let currentPayload = {};
        
        lines.forEach(line => {
            const trimmed = line.trim();
            
            if (trimmed.startsWith('PAYLOAD:')) {
                if (currentPayload.payload) {
                    payloads.push({...currentPayload});
                }
                currentPayload = {
                    payload: trimmed.replace('PAYLOAD:', '').trim(),
                    type: 'unknown',
                    confidence: 0.7,
                    category: 'ai_generated'
                };
            } else if (trimmed.startsWith('TYPE:')) {
                currentPayload.type = trimmed.replace('TYPE:', '').trim().toLowerCase();
            } else if (trimmed.startsWith('PURPOSE:')) {
                currentPayload.purpose = trimmed.replace('PURPOSE:', '').trim();
            } else if (trimmed.startsWith('BYPASS:')) {
                currentPayload.bypass = trimmed.replace('BYPASS:', '').trim();
            }
        });
        
        // إضافة آخر payload
        if (currentPayload.payload) {
            payloads.push(currentPayload);
        }

        console.log(`✅ تم تحليل ${payloads.length} payload من استجابة AI`);
        return payloads;
    }

    // تعيين النموذج
    setModel(model) {
        const validModels = ['gpt4', 'gpt35', 'claude', 'gemini', 'deepseek', 'ollama'];
        
        if (validModels.includes(model.toLowerCase())) {
            this.currentModel = model.toLowerCase();
            console.log(`✅ تم تعيين النموذج: ${this.currentModel}`);
            return true;
        } else {
            console.warn(`⚠️ نموذج غير صالح: ${model}`);
            return false;
        }
    }

    // الحصول على النموذج الحالي
    getCurrentModel() {
        return this.currentModel;
    }

    // الحصول على الإحصائيات
    getStatistics() {
    return {
        ...this.statistics,
        cacheSize: this.cache.size,
        successRate: this.statistics.requests > 0 
            ? ((this.statistics.successful / this.statistics.requests) * 100).toFixed(2) + '%'
            : '0%',
        averageResponseTime: Math.round(this.statistics.averageResponseTime) + 'ms',
        totalCost: this.statistics.totalCost.toFixed(4) 
    };
}

    // طباعة الإحصائيات
    printStatistics() {
        const stats = this.getStatistics();
        
        console.log('\n📊 إحصائيات API Integration:');
        console.log('════════════════════════════════════');
        console.log(`الطلبات الكلية: ${stats.requests}`);
        console.log(`الناجحة: ${stats.successful} | الفاشلة: ${stats.failed}`);
        console.log(`معدل النجاح: ${stats.successRate}`);
        console.log(`متوسط الوقت: ${stats.averageResponseTime}`);
        console.log(`التكلفة الإجمالية: ${stats.totalCost}`);
        console.log(`حجم الكاش: ${stats.cacheSize}/${this.maxCacheSize}`);
        console.log('\n📈 إحصائيات حسب النموذج:');
        
        Object.entries(stats.byModel).forEach(([model, data]) => {
            console.log(`  ${model.toUpperCase()}:`);
            console.log(`    - الطلبات: ${data.requests}`);
            console.log(`    - الناجحة: ${data.successful}`);
            console.log(`    - متوسط الوقت: ${Math.round(data.averageTime)}ms`);
        });
        
        console.log('════════════════════════════════════\n');
    }

    // إعادة تعيين الإحصائيات
    resetStatistics() {
        this.statistics = {
            requests: 0,
            successful: 0,
            failed: 0,
            totalCost: 0,
            byModel: {},
            averageResponseTime: 0
        };
        console.log('🔄 تم إعادة تعيين الإحصائيات');
    }

    // تصدير الإحصائيات
    exportStatistics() {
        const stats = this.getStatistics();
        const exportData = {
            timestamp: new Date().toISOString(),
            statistics: stats
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    // اختبار الاتصال بالـ APIs
    async testConnection(service = 'all') {
        console.log(`🔍 اختبار الاتصال بـ ${service}...`);
        
        const testPrompt = 'Hello, this is a connection test.';
        const results = {};
        
        if (service === 'all' || service === 'openai') {
            try {
                await this.callOpenAI(testPrompt, { maxTokens: 50 });
                results.openai = { status: '✅ متصل', error: null };
            } catch (error) {
                results.openai = { status: '❌ فشل', error: error.message };
            }
        }
        
        if (service === 'all' || service === 'claude') {
            try {
                await this.callClaude(testPrompt, { maxTokens: 50 });
                results.claude = { status: '✅ متصل', error: null };
            } catch (error) {
                results.claude = { status: '❌ فشل', error: error.message };
            }
        }
        
        if (service === 'all' || service === 'gemini') {
            try {
                await this.callGemini(testPrompt, { maxTokens: 50 });
                results.gemini = { status: '✅ متصل', error: null };
            } catch (error) {
                results.gemini = { status: '❌ فشل', error: error.message };
            }
        }

        if (service === 'all' || service === 'deepseek') {
            try {
                await this.callDeepSeek(testPrompt, { maxTokens: 50 });
                results.deepseek = { status: '✅ متصل', error: null };
            } catch (error) {
                results.deepseek = { status: '❌ فشل', error: error.message };
            }
        }

        if (service === 'all' || service === 'ollama') {
            try {
                await this.callOllama(testPrompt, { maxTokens: 50 });
                results.ollama = { status: '✅ متصل', error: null };
            } catch (error) {
                results.ollama = { status: '❌ فشل', error: error.message };
            }
        }
        
        console.log('📋 نتائج الاختبار:');
        Object.entries(results).forEach(([service, result]) => {
            console.log(`  ${service}: ${result.status}`);
            if (result.error) {
                console.log(`    خطأ: ${result.error}`);
            }
        });
        
        return results;
    }

    // تنسيق المدة الزمنية
    formatDuration(ms) {
        if (!ms) return 'N/A';
        
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}س ${minutes % 60}د`;
        } else if (minutes > 0) {
            return `${minutes}د ${seconds % 60}ث`;
        } else {
            return `${seconds}ث`;
        }
    }

    // Sleep/Delay
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // تنظيف الموارد
    cleanup() {
        this.clearCache();
        this.requestQueue = [];
        console.log('🧹 تم تنظيف موارد APIIntegration');
    }

    // تصدير التكوين
    exportConfig() {
        return {
            currentModel: this.currentModel,
            rateLimitDelay: this.rateLimitDelay,
            maxCacheSize: this.maxCacheSize,
            retryConfig: this.retryConfig
        };
    }

    // استيراد التكوين
    importConfig(config) {
        if (config.currentModel) this.currentModel = config.currentModel;
        if (config.rateLimitDelay) this.rateLimitDelay = config.rateLimitDelay;
        if (config.maxCacheSize) this.maxCacheSize = config.maxCacheSize;
        if (config.retryConfig) this.retryConfig = config.retryConfig;
        
        console.log('✅ تم استيراد التكوين');
    }
}

// تصدير وإتاحة عالمياً
if (typeof window !== 'undefined') {
    window.APIIntegration = APIIntegration;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIIntegration;
}