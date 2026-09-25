const rules = require('../config/rules.json');

class RiskEngine {
  constructor(ruleSet = rules) {
    this.rules = ruleSet;
  }

  analyzeText(text) {
    const startTime = Date.now();
    const normalizedText = text.toLowerCase();
    const findings = [];

    let overallRiskScore = 0; // 0 to 100 scale

    for (const rule of this.rules) {
      const matched = rule.patterns.some(pattern => normalizedText.includes(pattern.toLowerCase()));
      
      if (matched) {
        const impactScore = rule.severity === 'HIGH' ? 30 : rule.severity === 'MEDIUM' ? 15 : 5;
        overallRiskScore += impactScore;

        findings.push({
          ruleId: rule.id,
          category: rule.category,
          name: rule.name,
          severity: rule.severity,
          description: rule.description,
          recommendation: rule.recommendation
        });
      }
    }

    const clampedScore = Math.min(overallRiskScore, 100);
    const overallRiskLevel = clampedScore >= 50 ? 'HIGH' : clampedScore >= 20 ? 'MEDIUM' : 'LOW';

    return {
      metadata: {
        processedAt: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime,
        rulesEvaluated: this.rules.length
      },
      summary: {
        overallRiskLevel,
        overallRiskScore: clampedScore,
        totalFlaggedIssues: findings.length
      },
      findings
    };
  }
}

module.exports = new RiskEngine();
