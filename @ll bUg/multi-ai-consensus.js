/**
 * CAI - Multi-AI Consensus Engine
 * نظام التصويت الجماعي بين نماذج AI - أقوى ميزة للدقة!
 * Version: 1.0.0
 */

class MultiAIConsensus {
    constructor(apiIntegration) {
        this.api = apiIntegration;
        this.votingThreshold = 0.6; // 60% consensus
        this.weights = {
            'gpt4': 0.30,
            'claude': 0.30,
            'gemini': 0.20,
            'deepseek': 0.20
        };
        this.cache = new Map();
    }

    async analyzeWithConsensus(vulnerability) {
        console.log('🤖 بدء التحليل الجماعي...');
        
        const cacheKey = this.getCacheKey(vulnerability);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const analyses = await Promise.allSettled([
            this.getModelOpinion('gpt4', vulnerability),
            this.getModelOpinion('claude', vulnerability),
            this.getModelOpinion('gemini', vulnerability),
            this.getModelOpinion('deepseek', vulnerability)
        ]);

        const validAnalyses = analyses
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value)
            .filter(a => a !== null);

        if (validAnalyses.length < 2) {
            console.warn('⚠️ عدد قليل من النماذج استجابت');
            return validAnalyses[0] || null;
        }

        const consensus = this.calculateConsensus(validAnalyses);
        this.cache.set(cacheKey, consensus);
        
        return consensus;
    }

    async getModelOpinion(model, vuln) {
        const prompt = `تحليل هذه الثغرة بدقة:
النوع: ${vuln.vulnType}
الخطورة: ${vuln.severity}
الثقة: ${vuln.confidence}%
المسار: ${vuln.endpoint}
Payload: ${vuln.payload}

قدم تحليل مختصر يتضمن:
1. هل هي ثغرة حقيقية؟ (نعم/لا)
2. تقييم الخطورة (1-10)
3. نسبة الثقة (0-100%)
4. توصية واحدة مهمة

الرد بصيغة JSON فقط.`;

        try {
            this.api.setModel(model);
            const response = await this.api.callAI(prompt, { maxTokens: 300 });
            return this.parseResponse(response, model);
        } catch (error) {
            console.warn(`❌ فشل ${model}:`, error.message);
            return null;
        }
    }

    parseResponse(response, model) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const data = JSON.parse(jsonMatch[0]);
                return {
                    model: model,
                    isVulnerable: data.vulnerable || data.isVulnerable || false,
                    severity: data.severity || 5,
                    confidence: data.confidence || 50,
                    recommendation: data.recommendation || ''
                };
            }
        } catch (e) {
            // Fallback parsing
            const isVuln = /نعم|yes|true|vulnerable/i.test(response);
            return {
                model: model,
                isVulnerable: isVuln,
                severity: isVuln ? 7 : 3,
                confidence: 60,
                recommendation: 'تحليل يدوي مطلوب'
            };
        }
        return null;
    }

    calculateConsensus(analyses) {
        let totalWeight = 0;
        let weightedVotes = 0;
        let severitySum = 0;
        let confidenceSum = 0;

        analyses.forEach(analysis => {
            const weight = this.weights[analysis.model] || 0.1;
            totalWeight += weight;
            
            if (analysis.isVulnerable) {
                weightedVotes += weight;
            }
            
            severitySum += analysis.severity * weight;
            confidenceSum += analysis.confidence * weight;
        });

        const consensusScore = weightedVotes / totalWeight;
        const isConsensus = consensusScore >= this.votingThreshold;

        return {
            isVulnerable: isConsensus,
            consensusScore: Math.round(consensusScore * 100),
            averageSeverity: Math.round(severitySum / totalWeight),
            averageConfidence: Math.round(confidenceSum / totalWeight),
            votes: {
                agree: analyses.filter(a => a.isVulnerable).length,
                disagree: analyses.filter(a => !a.isVulnerable).length,
                total: analyses.length
            },
            details: analyses,
            recommendation: this.generateConsensusRecommendation(analyses, isConsensus)
        };
    }

    generateConsensusRecommendation(analyses, isVulnerable) {
        if (!isVulnerable) {
            return '✅ معظم النماذج تؤكد عدم وجود ثغرة حقيقية - False Positive محتمل';
        }

        const recommendations = analyses
            .filter(a => a.recommendation)
            .map(a => a.recommendation);
        
        return `⚠️ إجماع على وجود ثغرة! التوصيات:\n${recommendations.join('\n')}`;
    }

    getCacheKey(vuln) {
        return `${vuln.vulnType}_${vuln.endpoint}_${vuln.payload}`.substring(0, 100);
    }

    clearCache() {
        this.cache.clear();
    }
}

if (typeof window !== 'undefined') {
    window.MultiAIConsensus = MultiAIConsensus;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiAIConsensus;
}