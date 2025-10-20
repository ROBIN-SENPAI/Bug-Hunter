/**
 * CAI - Natural Language Processing Scanner
 * امسح بأوامر اللغة الطبيعية!
 * Version: 1.0.0
 */

class NLPScanner {
    constructor(apiIntegration) {
        this.api = apiIntegration;
        this.commandPatterns = this.initializePatterns();
        this.context = {};
    }

    initializePatterns() {
        return {
            // أنماط المسح
            scan: {
                ar: [
                    /افحص\s+(.+)/,
                    /امسح\s+(.+)/,
                    /اختبر\s+(.+)/,
                    /ابحث عن ثغرات في\s+(.+)/
                ],
                en: [
                    /scan\s+(.+)/i,
                    /test\s+(.+)/i,
                    /check\s+(.+)/i,
                    /find vulnerabilities in\s+(.+)/i
                ]
            },
            
            // أنواع الثغرات
            vulnTypes: {
                ar: {
                    'sql': ['sql', 'حقن', 'sqli', 'injection'],
                    'xss': ['xss', 'سكريبت', 'script', 'javascript'],
                    'csrf': ['csrf', 'تزوير', 'forge'],
                    'lfi': ['lfi', 'ملف', 'file inclusion'],
                    'rce': ['rce', 'تنفيذ', 'execute', 'command'],
                    'all': ['كل', 'جميع', 'all', 'everything']
                },
                en: {
                    'sql': ['sql', 'sqli', 'injection'],
                    'xss': ['xss', 'cross-site', 'script'],
                    'csrf': ['csrf', 'cross-site request'],
                    'lfi': ['lfi', 'file inclusion', 'local file'],
                    'rce': ['rce', 'remote code', 'command execution'],
                    'all': ['all', 'everything', 'every']
                }
            },
            
            // مستويات الخطورة
            severity: {
                ar: {
                    'critical': ['حرجة', 'خطيرة جدا', 'critical'],
                    'high': ['عالية', 'خطيرة', 'high'],
                    'medium': ['متوسطة', 'medium'],
                    'low': ['منخفضة', 'low']
                },
                en: {
                    'critical': ['critical', 'severe'],
                    'high': ['high', 'dangerous'],
                    'medium': ['medium', 'moderate'],
                    'low': ['low', 'minor']
                }
            },
            
            // خيارات إضافية
            options: {
                ar: {
                    'deep': ['عميق', 'شامل', 'deep', 'thorough'],
                    'quick': ['سريع', 'quick', 'fast'],
                    'stealth': ['خفي', 'stealth', 'silent'],
                    'aggressive': ['عدواني', 'aggressive', 'intensive']
                },
                en: {
                    'deep': ['deep', 'thorough', 'comprehensive'],
                    'quick': ['quick', 'fast', 'rapid'],
                    'stealth': ['stealth', 'silent', 'quiet'],
                    'aggressive': ['aggressive', 'intensive', 'heavy']
                }
            }
        };
    }

    async parseCommand(command) {
        console.log('🧠 تحليل الأمر بالذكاء الاصطناعي...');
        
        const parsed = {
            action: null,
            target: null,
            vulnTypes: [],
            severity: null,
            options: {},
            confidence: 0
        };

        // تحديد اللغة
        const language = this.detectLanguage(command);
        
        // استخراج الهدف
        parsed.target = this.extractTarget(command, language);
        
        // استخراج أنواع الثغرات
        parsed.vulnTypes = this.extractVulnTypes(command, language);
        
        // استخراج مستوى الخطورة
        parsed.severity = this.extractSeverity(command, language);
        
        // استخراج الخيارات
        parsed.options = this.extractOptions(command, language);
        
        // تحديد الإجراء
        parsed.action = 'scan'; // افتراضي
        
        // حساب الثقة
        parsed.confidence = this.calculateConfidence(parsed);
        
        // إذا كانت الثقة منخفضة، استخدم AI للتحليل
        if (parsed.confidence < 0.7) {
            console.log('🤖 استخدام AI لتحليل أعمق...');
            const aiParsed = await this.parseWithAI(command);
            return aiParsed;
        }
        
        return parsed;
    }

    detectLanguage(text) {
        const arabicChars = text.match(/[\u0600-\u06FF]/g);
        return arabicChars && arabicChars.length > 3 ? 'ar' : 'en';
    }

    extractTarget(command, language) {
        // البحث عن URLs
        const urlPattern = /(https?:\/\/[^\s]+)/gi;
        const match = command.match(urlPattern);
        
        if (match) {
            return match[0];
        }
        
        // البحث عن domains
        const domainPattern = /([a-z0-9]+\.)+[a-z]{2,}/gi;
        const domainMatch = command.match(domainPattern);
        
        if (domainMatch) {
            return 'http://' + domainMatch[0];
        }
        
        return null;
    }

    extractVulnTypes(command, language) {
        const types = [];
        const patterns = this.commandPatterns.vulnTypes[language];
        
        for (const [type, keywords] of Object.entries(patterns)) {
            for (const keyword of keywords) {
                if (command.toLowerCase().includes(keyword.toLowerCase())) {
                    types.push(type);
                    break;
                }
            }
        }
        
        return types.length > 0 ? types : ['all'];
    }

    extractSeverity(command, language) {
        const patterns = this.commandPatterns.severity[language];
        
        for (const [severity, keywords] of Object.entries(patterns)) {
            for (const keyword of keywords) {
                if (command.toLowerCase().includes(keyword.toLowerCase())) {
                    return severity;
                }
            }
        }
        
        return null;
    }

    extractOptions(command, language) {
        const options = {};
        const patterns = this.commandPatterns.options[language];
        
        for (const [option, keywords] of Object.entries(patterns)) {
            for (const keyword of keywords) {
                if (command.toLowerCase().includes(keyword.toLowerCase())) {
                    options[option] = true;
                    break;
                }
            }
        }
        
        // تحويل إلى خيارات قابلة للاستخدام
        const scanOptions = {};
        
        if (options.deep) {
            scanOptions.depth = 'deep';
            scanOptions.maxPayloads = 50;
        } else if (options.quick) {
            scanOptions.depth = 'quick';
            scanOptions.maxPayloads = 10;
        } else {
            scanOptions.depth = 'standard';
            scanOptions.maxPayloads = 20;
        }
        
        if (options.stealth) {
            scanOptions.delay = 1000;
            scanOptions.threads = 1;
        } else if (options.aggressive) {
            scanOptions.delay = 50;
            scanOptions.threads = 20;
        }
        
        return scanOptions;
    }

    calculateConfidence(parsed) {
        let confidence = 0;
        
        if (parsed.target) confidence += 0.4;
        if (parsed.vulnTypes.length > 0) confidence += 0.3;
        if (parsed.options && Object.keys(parsed.options).length > 0) confidence += 0.2;
        if (parsed.severity) confidence += 0.1;
        
        return confidence;
    }

    async parseWithAI(command) {
        const prompt = `أنت محلل أوامر لأداة أمن سيبراني. حلل هذا الأمر واستخرج:

الأمر: "${command}"

استخرج:
1. الهدف (URL أو domain)
2. نوع الثغرات المطلوب فحصها (sql, xss, csrf, lfi, rce, all)
3. مستوى الخطورة المطلوب (critical, high, medium, low)
4. خيارات المسح (deep, quick, stealth, aggressive)

الرد بصيغة JSON فقط:
{
  "target": "URL",
  "vulnTypes": ["type1", "type2"],
  "severity": "level",
  "options": {"option": true}
}`;

        try {
            const response = await this.api.callAI(prompt, { maxTokens: 300 });
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                parsed.confidence = 0.9; // AI parsing has high confidence
                return parsed;
            }
        } catch (error) {
            console.error('فشل تحليل AI:', error);
        }
        
        // Fallback
        return {
            action: 'scan',
            target: null,
            vulnTypes: ['all'],
            severity: null,
            options: {},
            confidence: 0.3
        };
    }

    // ========================================
    // Command Execution
    // ========================================
    
    async executeCommand(command, scannerApp) {
        console.log('🎯 تنفيذ الأمر:', command);
        
        const parsed = await this.parseCommand(command);
        
        if (!parsed.target) {
            return {
                success: false,
                error: 'لم يتم تحديد هدف صحيح',
                suggestion: 'مثال: افحص https://example.com عن ثغرات SQL'
            };
        }
        
        console.log('✅ تم تحليل الأمر:');
        console.log('  الهدف:', parsed.target);
        console.log('  الثغرات:', parsed.vulnTypes.join(', '));
        console.log('  الخيارات:', parsed.options);
        console.log('  الثقة:', Math.round(parsed.confidence * 100) + '%');
        
        // تنفيذ المسح
        const scanOptions = {
            ...parsed.options,
            vulnType: parsed.vulnTypes[0] === 'all' ? 'all' : parsed.vulnTypes.join(','),
            aiAnalysis: true
        };
        
        return await scannerApp.startScan(parsed.target, scanOptions);
    }

    // ========================================
    // Voice Command Support
    // ========================================
    
    async startVoiceRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('❌ المتصفح لا يدعم التعرف على الصوت');
            return false;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'ar-SA'; // يمكن تغييره لـ 'en-US'
        recognition.continuous = false;
        recognition.interimResults = false;
        
        return new Promise((resolve, reject) => {
            recognition.onresult = (event) => {
                const command = event.results[0][0].transcript;
                console.log('🎤 الأمر الصوتي:', command);
                resolve(command);
            };
            
            recognition.onerror = (event) => {
                console.error('❌ خطأ في التعرف على الصوت:', event.error);
                reject(event.error);
            };
            
            recognition.start();
            console.log('🎤 استمع...');
        });
    }

    // ========================================
    // Smart Suggestions
    // ========================================
    
    getSuggestions(partialCommand) {
        const suggestions = [
            'افحص https://example.com عن ثغرات SQL',
            'امسح example.com بحثاً عن XSS',
            'اختبر https://target.com للثغرات الحرجة',
            'ابحث عن ثغرات في https://site.com بشكل عميق',
            'افحص example.com عن جميع الثغرات بسرعة',
            'scan https://example.com for SQL injection',
            'test example.com for XSS vulnerabilities',
            'check https://target.com for all vulnerabilities deeply'
        ];
        
        if (!partialCommand) return suggestions;
        
        return suggestions.filter(s => 
            s.toLowerCase().includes(partialCommand.toLowerCase())
        );
    }

    // ========================================
    // Command History
    // ========================================
    
    saveToHistory(command) {
        const history = JSON.parse(localStorage.getItem('cai_command_history') || '[]');
        history.unshift({
            command: command,
            timestamp: new Date().toISOString()
        });
        
        // حفظ آخر 50 أمر فقط
        if (history.length > 50) {
            history.pop();
        }
        
        localStorage.setItem('cai_command_history', JSON.stringify(history));
    }

    getHistory() {
        return JSON.parse(localStorage.getItem('cai_command_history') || '[]');
    }

    clearHistory() {
        localStorage.removeItem('cai_command_history');
    }
}

if (typeof window !== 'undefined') {
    window.NLPScanner = NLPScanner;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NLPScanner;
}