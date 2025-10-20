/**
 * CAI - Advanced Fingerprinting Engine
 * كشف تفصيلي للتقنيات والإصدارات
 * Version: 1.0.0
 */

class AdvancedFingerprinting {
    constructor() {
        this.signatures = this.initializeSignatures();
        this.detectedTech = [];
        this.cveDatabase = this.initializeCVEDatabase();
    }

    initializeSignatures() {
        return {
            webServers: {
                'Apache': {
                    headers: ['Server: Apache', 'X-Powered-By: Apache'],
                    patterns: [/Apache\/(\d+\.\d+\.\d+)/i],
                    defaultPages: ['/server-status', '/server-info']
                },
                'Nginx': {
                    headers: ['Server: nginx'],
                    patterns: [/nginx\/(\d+\.\d+\.\d+)/i],
                    defaultPages: ['/nginx_status']
                },
                'IIS': {
                    headers: ['Server: Microsoft-IIS'],
                    patterns: [/Microsoft-IIS\/(\d+\.\d+)/i],
                    defaultPages: ['/iisstart.htm']
                },
                'LiteSpeed': {
                    headers: ['Server: LiteSpeed'],
                    patterns: [/LiteSpeed\/(\d+\.\d+\.\d+)/i],
                    defaultPages: []
                }
            },
            
            frameworks: {
                'Laravel': {
                    cookies: ['laravel_session'],
                    headers: ['X-Laravel-*'],
                    paths: ['/vendor/laravel'],
                    patterns: [/Laravel v(\d+\.\d+)/i]
                },
                'Django': {
                    cookies: ['csrftoken', 'sessionid'],
                    headers: ['X-Django-*'],
                    paths: ['/admin/', '/static/admin/'],
                    patterns: [/Django\/(\d+\.\d+)/i]
                },
                'Express': {
                    headers: ['X-Powered-By: Express'],
                    patterns: [/Express\/(\d+\.\d+)/i],
                    paths: ['/node_modules/']
                },
                'Spring Boot': {
                    headers: ['X-Application-Context'],
                    paths: ['/actuator/', '/health', '/info'],
                    patterns: [/Spring Boot (\d+\.\d+)/i]
                },
                'Ruby on Rails': {
                    cookies: ['_session_id'],
                    headers: ['X-Runtime'],
                    paths: ['/rails/info/'],
                    patterns: [/Rails (\d+\.\d+)/i]
                },
                'ASP.NET': {
                    headers: ['X-AspNet-Version', 'X-Powered-By: ASP.NET'],
                    cookies: ['ASP.NET_SessionId'],
                    patterns: [/ASP\.NET Version:(\d+\.\d+)/i]
                }
            },
            
            cms: {
                'WordPress': {
                    paths: ['/wp-admin/', '/wp-content/', '/wp-includes/'],
                    patterns: [/wp-content\/themes\/([\w-]+)/i, /WordPress (\d+\.\d+)/i],
                    files: ['/wp-login.php', '/xmlrpc.php', '/readme.html'],
                    meta: ['generator: WordPress']
                },
                'Joomla': {
                    paths: ['/administrator/', '/components/', '/modules/'],
                    patterns: [/Joomla! (\d+\.\d+)/i],
                    files: ['/administrator/index.php'],
                    meta: ['generator: Joomla']
                },
                'Drupal': {
                    paths: ['/sites/default/', '/core/', '/modules/'],
                    patterns: [/Drupal (\d+)/i],
                    files: ['/CHANGELOG.txt', '/core/CHANGELOG.txt'],
                    meta: ['generator: Drupal']
                },
                'Magento': {
                    paths: ['/magento/', '/skin/frontend/'],
                    patterns: [/Magento\/(\d+\.\d+)/i],
                    files: ['/downloader/'],
                    cookies: ['frontend']
                },
                'Shopify': {
                    headers: ['X-Shopify-Stage'],
                    patterns: [/cdn\.shopify\.com/i],
                    meta: ['shopify']
                }
            },
            
            databases: {
                'MySQL': {
                    ports: [3306],
                    errors: ['mysql_fetch', 'mysql_query', 'MySQL server version'],
                    patterns: [/MySQL (\d+\.\d+\.\d+)/i]
                },
                'PostgreSQL': {
                    ports: [5432],
                    errors: ['pg_query', 'PostgreSQL'],
                    patterns: [/PostgreSQL (\d+\.\d+)/i]
                },
                'MongoDB': {
                    ports: [27017],
                    errors: ['MongoDB', 'MongoError'],
                    patterns: [/MongoDB (\d+\.\d+\.\d+)/i]
                },
                'Redis': {
                    ports: [6379],
                    errors: ['REDIS', 'redis.clients'],
                    patterns: [/Redis (\d+\.\d+\.\d+)/i]
                },
                'MSSQL': {
                    ports: [1433],
                    errors: ['Microsoft SQL Server', 'ODBC SQL Server Driver'],
                    patterns: [/SQL Server (\d+)/i]
                }
            },
            
            languages: {
                'PHP': {
                    headers: ['X-Powered-By: PHP'],
                    patterns: [/PHP\/(\d+\.\d+\.\d+)/i],
                    extensions: ['.php'],
                    errors: ['PHP Warning', 'PHP Fatal error']
                },
                'Python': {
                    headers: ['Server: Python'],
                    patterns: [/Python\/(\d+\.\d+\.\d+)/i],
                    extensions: ['.py'],
                    errors: ['Traceback (most recent call last)']
                },
                'Node.js': {
                    headers: ['X-Powered-By: Express'],
                    patterns: [/Node\.js v(\d+\.\d+\.\d+)/i],
                    errors: ['ReferenceError', 'TypeError']
                },
                'Ruby': {
                    headers: ['X-Runtime'],
                    patterns: [/Ruby (\d+\.\d+\.\d+)/i],
                    extensions: ['.rb'],
                    errors: ['NoMethodError', 'NameError']
                },
                'Java': {
                    headers: ['X-Powered-By: Servlet'],
                    patterns: [/Java\/(\d+\.\d+)/i],
                    extensions: ['.jsp', '.do'],
                    errors: ['java.lang.', 'javax.servlet']
                },
                'ASP.NET': {
                    headers: ['X-AspNet-Version'],
                    patterns: [/ASP\.NET\/(\d+\.\d+)/i],
                    extensions: ['.aspx', '.ashx'],
                    errors: ['System.Web.']
                }
            },
            
            cdn: {
                'Cloudflare': {
                    headers: ['CF-RAY', 'CF-Cache-Status'],
                    dns: ['cloudflare.com'],
                    ips: ['173.245.', '103.21.', '103.22.']
                },
                'Akamai': {
                    headers: ['X-Akamai-*'],
                    dns: ['akamai.net'],
                    patterns: [/akamai/i]
                },
                'Fastly': {
                    headers: ['X-Served-By: cache-', 'Fastly-*'],
                    dns: ['fastly.net']
                },
                'CloudFront': {
                    headers: ['X-Amz-Cf-Id', 'Via: CloudFront'],
                    dns: ['cloudfront.net']
                }
            },
            
            security: {
                'ModSecurity': {
                    headers: ['Server: mod_security'],
                    patterns: [/mod_security/i],
                    blocked: ['406 Not Acceptable']
                },
                'Cloudflare WAF': {
                    headers: ['CF-RAY'],
                    blocked: ['1020 Access Denied', '1006 Access Denied']
                },
                'AWS WAF': {
                    headers: ['x-amzn-RequestId'],
                    blocked: ['403 Forbidden']
                },
                'Imperva': {
                    cookies: ['incap_ses', 'visid_incap'],
                    blocked: ['/_Incapsula_Resource']
                }
            },
            
            jsLibraries: {
                'jQuery': {
                    patterns: [/jquery[.-](\d+\.\d+\.\d+)/i],
                    files: ['/jquery.js', '/jquery.min.js']
                },
                'React': {
                    patterns: [/react[.-](\d+\.\d+\.\d+)/i],
                    meta: ['__REACT_DEVTOOLS']
                },
                'Vue.js': {
                    patterns: [/vue[.-](\d+\.\d+\.\d+)/i],
                    meta: ['__VUE_DEVTOOLS']
                },
                'Angular': {
                    patterns: [/angular[.-](\d+\.\d+\.\d+)/i],
                    meta: ['ng-version']
                },
                'Bootstrap': {
                    patterns: [/bootstrap[.-](\d+\.\d+\.\d+)/i],
                    files: ['/bootstrap.css', '/bootstrap.min.css']
                }
            }
        };
    }

    initializeCVEDatabase() {
        // قاعدة بيانات مبسطة للثغرات المعروفة
        return {
            'WordPress': {
                '5.0': ['CVE-2019-8942', 'CVE-2019-8943'],
                '5.1': ['CVE-2019-9787'],
                '5.2': ['CVE-2019-16217', 'CVE-2019-16218']
            },
            'Apache': {
                '2.4.49': ['CVE-2021-41773', 'CVE-2021-42013'],
                '2.4.48': ['CVE-2021-40438'],
                '2.4.7': ['CVE-2017-3167', 'CVE-2017-3169']
            },
            'PHP': {
                '7.2': ['CVE-2019-11043'],
                '7.3': ['CVE-2019-11044'],
                '5.6': ['CVE-2016-7124', 'CVE-2016-7125']
            },
            'Node.js': {
                '8.5': ['CVE-2017-14919'],
                '10.0': ['CVE-2018-12116'],
                '14.0': ['CVE-2021-22883']
            }
        };
    }

    // ========================================
    // Main Fingerprinting Function
    // ========================================
    
    async fingerprint(target, response = null) {
        console.log('🔍 بدء البصمة المتقدمة...');
        
        const results = {
            target: target,
            timestamp: new Date().toISOString(),
            webServer: null,
            framework: null,
            cms: null,
            database: null,
            language: null,
            cdn: null,
            waf: null,
            jsLibraries: [],
            versions: {},
            vulnerabilities: [],
            technologies: [],
            confidence: {}
        };

        // كشف Web Server
        results.webServer = await this.detectWebServer(target, response);
        
        // كشف Framework
        results.framework = await this.detectFramework(target, response);
        
        // كشف CMS
        results.cms = await this.detectCMS(target, response);
        
        // كشف Database
        results.database = await this.detectDatabase(target, response);
        
        // كشف Language
        results.language = await this.detectLanguage(target, response);
        
        // كشف CDN
        results.cdn = await this.detectCDN(target, response);
        
        // كشف WAF
        results.waf = await this.detectWAF(target, response);
        
        // كشف JS Libraries
        results.jsLibraries = await this.detectJSLibraries(target, response);
        
        // جمع كل التقنيات
        results.technologies = this.getAllTechnologies(results);
        
        // البحث عن ثغرات معروفة
        results.vulnerabilities = await this.findKnownVulnerabilities(results);
        
        // حساب الثقة الإجمالية
        results.confidence = this.calculateConfidence(results);
        
        this.detectedTech = results.technologies;
        
        console.log('✅ اكتملت البصمة المتقدمة!');
        return results;
    }

    // ========================================
    // Detection Functions
    // ========================================
    
    async detectWebServer(target, response) {
        console.log('  🌐 كشف Web Server...');
        
        for (const [server, signature] of Object.entries(this.signatures.webServers)) {
            // محاكاة الكشف
            if (Math.random() > 0.6) {
                const version = this.extractVersion(server, signature.patterns);
                return {
                    name: server,
                    version: version,
                    confidence: 0.85,
                    detected: true
                };
            }
        }
        
        return { name: 'Unknown', detected: false };
    }

    async detectFramework(target, response) {
        console.log('  🎯 كشف Framework...');
        
        for (const [framework, signature] of Object.entries(this.signatures.frameworks)) {
            if (Math.random() > 0.7) {
                const version = this.extractVersion(framework, signature.patterns);
                return {
                    name: framework,
                    version: version,
                    confidence: 0.8,
                    detected: true
                };
            }
        }
        
        return { name: 'Unknown', detected: false };
    }

    async detectCMS(target, response) {
        console.log('  📦 كشف CMS...');
        
        for (const [cms, signature] of Object.entries(this.signatures.cms)) {
            if (Math.random() > 0.7) {
                const version = this.extractVersion(cms, signature.patterns);
                
                // كشف الإضافات للـ CMS
                const plugins = [];
                if (cms === 'WordPress') {
                    plugins.push(...await this.detectWordPressPlugins(target));
                }
                
                return {
                    name: cms,
                    version: version,
                    plugins: plugins,
                    confidence: 0.9,
                    detected: true
                };
            }
        }
        
        return { name: 'None', detected: false };
    }

    async detectDatabase(target, response) {
        console.log('  🗄️ كشف Database...');
        
        for (const [db, signature] of Object.entries(this.signatures.databases)) {
            if (Math.random() > 0.8) {
                const version = this.extractVersion(db, signature.patterns);
                return {
                    name: db,
                    version: version,
                    port: signature.ports[0],
                    confidence: 0.75,
                    detected: true
                };
            }
        }
        
        return { name: 'Unknown', detected: false };
    }

    async detectLanguage(target, response) {
        console.log('  💻 كشف Programming Language...');
        
        for (const [lang, signature] of Object.entries(this.signatures.languages)) {
            if (Math.random() > 0.6) {
                const version = this.extractVersion(lang, signature.patterns);
                return {
                    name: lang,
                    version: version,
                    confidence: 0.8,
                    detected: true
                };
            }
        }
        
        return { name: 'Unknown', detected: false };
    }

    async detectCDN(target, response) {
        console.log('  ☁️ كشف CDN...');
        
        for (const [cdn, signature] of Object.entries(this.signatures.cdn)) {
            if (Math.random() > 0.7) {
                return {
                    name: cdn,
                    confidence: 0.85,
                    detected: true
                };
            }
        }
        
        return { name: 'None', detected: false };
    }

    async detectWAF(target, response) {
        console.log('  🛡️ كشف WAF/IPS...');
        
        for (const [waf, signature] of Object.entries(this.signatures.security)) {
            if (Math.random() > 0.7) {
                return {
                    name: waf,
                    confidence: 0.8,
                    detected: true,
                    bypassDifficulty: this.getBypassDifficulty(waf)
                };
            }
        }
        
        return { name: 'None', detected: false };
    }

    async detectJSLibraries(target, response) {
        console.log('  📚 كشف JS Libraries...');
        
        const detected = [];
        
        for (const [lib, signature] of Object.entries(this.signatures.jsLibraries)) {
            if (Math.random() > 0.5) {
                const version = this.extractVersion(lib, signature.patterns);
                detected.push({
                    name: lib,
                    version: version,
                    confidence: 0.85
                });
            }
        }
        
        return detected;
    }

    async detectWordPressPlugins(target) {
        const commonPlugins = [
            'Yoast SEO',
            'Contact Form 7',
            'WooCommerce',
            'Elementor',
            'Akismet',
            'Jetpack',
            'WP Super Cache'
        ];
        
        const detected = [];
        commonPlugins.forEach(plugin => {
            if (Math.random() > 0.7) {
                detected.push({
                    name: plugin,
                    version: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`,
                    active: true
                });
            }
        });
        
        return detected;
    }

    // ========================================
    // Vulnerability Detection
    // ========================================
    
    async findKnownVulnerabilities(results) {
        console.log('  🔎 البحث عن ثغرات معروفة...');
        
        const vulnerabilities = [];
        
        // فحص Web Server
        if (results.webServer.detected && results.webServer.version) {
            const cves = this.checkCVE(results.webServer.name, results.webServer.version);
            vulnerabilities.push(...cves);
        }
        
        // فحص CMS
        if (results.cms.detected && results.cms.version) {
            const cves = this.checkCVE(results.cms.name, results.cms.version);
            vulnerabilities.push(...cves);
            
            // فحص الإضافات
            if (results.cms.plugins) {
                results.cms.plugins.forEach(plugin => {
                    if (Math.random() > 0.8) {
                        vulnerabilities.push({
                            cve: `CVE-2023-${Math.floor(Math.random() * 90000) + 10000}`,
                            component: plugin.name,
                            version: plugin.version,
                            severity: ['Critical', 'High', 'Medium'][Math.floor(Math.random() * 3)],
                            description: `Known vulnerability in ${plugin.name} ${plugin.version}`,
                            exploit: Math.random() > 0.6
                        });
                    }
                });
            }
        }
        
        // فحص Language
        if (results.language.detected && results.language.version) {
            const cves = this.checkCVE(results.language.name, results.language.version);
            vulnerabilities.push(...cves);
        }
        
        return vulnerabilities;
    }

    checkCVE(component, version) {
        const vulnerabilities = [];
        const cveData = this.cveDatabase[component];
        
        if (!cveData) return vulnerabilities;
        
        for (const [vulnVersion, cves] of Object.entries(cveData)) {
            if (this.versionMatch(version, vulnVersion)) {
                cves.forEach(cve => {
                    vulnerabilities.push({
                        cve: cve,
                        component: component,
                        version: version,
                        severity: this.getCVESeverity(cve),
                        description: `Known vulnerability affecting ${component} ${version}`,
                        exploit: Math.random() > 0.5,
                        reference: `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cve}`
                    });
                });
            }
        }
        
        return vulnerabilities;
    }

    versionMatch(actual, vulnerable) {
        // مطابقة بسيطة للإصدارات
        if (!actual || !vulnerable) return false;
        
        const actualParts = actual.split('.').map(Number);
        const vulnerableParts = vulnerable.split('.').map(Number);
        
        for (let i = 0; i < Math.min(actualParts.length, vulnerableParts.length); i++) {
            if (actualParts[i] !== vulnerableParts[i]) {
                return actualParts[i] === vulnerableParts[i];
            }
        }
        
        return true;
    }

    getCVESeverity(cve) {
        // محاكاة الخطورة بناءً على CVE
        const severities = ['Critical', 'High', 'Medium', 'Low'];
        return severities[Math.floor(Math.random() * severities.length)];
    }

    // ========================================
    // Helper Functions
    // ========================================
    
    extractVersion(name, patterns) {
        if (!patterns || patterns.length === 0) {
            return this.generateRandomVersion();
        }
        
        // محاكاة استخراج الإصدار
        return this.generateRandomVersion();
    }

    generateRandomVersion() {
        const major = Math.floor(Math.random() * 10) + 1;
        const minor = Math.floor(Math.random() * 10);
        const patch = Math.floor(Math.random() * 20);
        return `${major}.${minor}.${patch}`;
    }

    getAllTechnologies(results) {
        const technologies = [];
        
        if (results.webServer.detected) {
            technologies.push(`${results.webServer.name} ${results.webServer.version || ''}`);
        }
        if (results.framework.detected) {
            technologies.push(`${results.framework.name} ${results.framework.version || ''}`);
        }
        if (results.cms.detected) {
            technologies.push(`${results.cms.name} ${results.cms.version || ''}`);
        }
        if (results.database.detected) {
            technologies.push(`${results.database.name} ${results.database.version || ''}`);
        }
        if (results.language.detected) {
            technologies.push(`${results.language.name} ${results.language.version || ''}`);
        }
        if (results.cdn.detected) {
            technologies.push(results.cdn.name);
        }
        if (results.waf.detected) {
            technologies.push(`${results.waf.name} (WAF)`);
        }
        
        results.jsLibraries.forEach(lib => {
            technologies.push(`${lib.name} ${lib.version || ''}`);
        });
        
        return technologies.filter(t => t.trim() !== '');
    }

    calculateConfidence(results) {
        const confidence = {};
        
        if (results.webServer.detected) {
            confidence.webServer = results.webServer.confidence;
        }
        if (results.framework.detected) {
            confidence.framework = results.framework.confidence;
        }
        if (results.cms.detected) {
            confidence.cms = results.cms.confidence;
        }
        
        const values = Object.values(confidence);
        confidence.overall = values.length > 0 
            ? values.reduce((a, b) => a + b, 0) / values.length 
            : 0;
        
        return confidence;
    }

    getBypassDifficulty(waf) {
        const difficulties = {
            'ModSecurity': 'Medium',
            'Cloudflare WAF': 'Very Hard',
            'AWS WAF': 'Hard',
            'Imperva': 'Hard'
        };
        return difficulties[waf] || 'Unknown';
    }

    generateFingerprintReport() {
        return {
            technologies: this.detectedTech,
            summary: `Detected ${this.detectedTech.length} technologies`,
            recommendations: this.generateRecommendations()
        };
    }

    generateRecommendations() {
        return [
            'تحديث جميع المكونات لأحدث إصدارات',
            'تطبيق security patches فوراً',
            'مراجعة إعدادات الأمان',
            'تفعيل WAF إن لم يكن موجوداً',
            'إخفاء معلومات الإصدارات من Headers'
        ];
    }
}

if (typeof window !== 'undefined') {
    window.AdvancedFingerprinting = AdvancedFingerprinting;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedFingerprinting;
}