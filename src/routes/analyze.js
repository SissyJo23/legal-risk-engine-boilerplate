const express = require('express');
const { z } = require('zod');
const llmAdapter = require('../services/llmAdapter');

const router = express.Router();

// Input Validation Schema
const AnalyzeSchema = z.object({
  documentTitle: z.string().optional().default('Untitled Document'),
  content: z.string().min(10, { message: 'Content must be at least 10 characters long.' })
});

// POST /api/v1/analyze-risk
router.post('/analyze-risk', async (req, res) => {
  try {
    const validatedData = AnalyzeSchema.parse(req.body);
    
    const analysis = await llmAdapter.processContractAnalysis(validatedData.content);

    return res.status(200).json({
      success: true,
      documentTitle: validatedData.documentTitle,
      ...analysis
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: error.errors
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal Processing Error',
      message: error.message
    });
  }
});

// GET /api/v1/health
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    mode: process.env.LLM_PROVIDER_MODE || 'local',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
