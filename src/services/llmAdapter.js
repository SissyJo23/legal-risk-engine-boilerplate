const riskEngine = require('./riskEngine');

class LLMAdapter {
  constructor() {
    this.mode = process.env.LLM_PROVIDER_MODE || 'local';
  }

  async processContractAnalysis(contractText) {
    if (this.mode === 'local') {
      // Local zero-dependency execution
      const localResult = riskEngine.analyzeText(contractText);
      return {
        provider: 'local-rules-engine',
        status: 'success',
        data: localResult
      };
    }

    // Stubbed interface ready for buyer to plug in Claude / OpenAI / Gemini
    /* 
    if (this.mode === 'external') {
      // Buyer implementation hook:
      // const response = await fetchLLMAPI(contractText);
      // return response;
    }
    */

    throw new Error(`Unsupported provider mode: ${this.mode}`);
  }
}

module.exports = new LLMAdapter();
