import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT, AI_MODELS } from '@/constants';
import { generateFallbackHTML, buildEnhancedPrompt} from '@/lib/prompt';

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = 'gpt-5' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const selectedModel = AI_MODELS.find(m => m.id === model);
    if (!selectedModel || !selectedModel.available) {
      return NextResponse.json({ error: 'Invalid or unavailable model' }, { status: 400 });
    }

    if (!isProjectPrompt(prompt)) {
      return NextResponse.json({ 
        error: 'Sorry, I can only help with project generation. Please describe a web application you\'d like me to create.' 
      }, { status: 400 });
    }

    let response: string;
    // if (selectedModel.provider === 'github') {
    //   response = await generateWithGitHub(prompt, model);
    // } else {
    //   response = generateFallbackHTML(prompt);
    // }
    response = generateFallbackHTML(prompt);

    return NextResponse.json({ 
      content: response,
      model: model,
      provider: selectedModel.provider
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate project. Please try again.' },
      { status: 500 }
    );
  }
}

function isProjectPrompt(prompt: string): boolean {
  const projectKeywords = [
    'create', 'build', 'make', 'generate', 'develop',
    'app', 'application', 'website', 'project', 'game',
    'dashboard', 'interface', 'platform', 'tool',
    'dapp', 'defi', 'nft', 'wallet', 'crypto', 'blockchain'
  ];

  const lowerPrompt = prompt.toLowerCase();
  return projectKeywords.some(keyword => lowerPrompt.includes(keyword));
}

async function generateWithGitHub(prompt: string, model: string): Promise<string> {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    
    if (!githubToken) {
      throw new Error('GitHub token not configured');
    }

    const modelMap: Record<string, string> = {
      'gpt-5': 'gpt-5',
      'gpt-4o': 'gpt-4o',
      'gpt-4-turbo': 'gpt-4-turbo',
      'gpt-4': 'gpt-4'
    };

    const githubModel = modelMap[model] || 'gpt-4';
    
    const enhancedPrompt = buildEnhancedPrompt(prompt);
    
    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${githubToken}`,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: enhancedPrompt }
        ],
        model: githubModel,
        max_completion_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API error:', response.status, errorText);
      
      if (response.status === 429) {
        const errorData = JSON.parse(errorText);
        const waitTime = extractWaitTime(errorData.error?.message) || 10;
        console.log(`Rate limited. Waiting ${waitTime} seconds before fallback...`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        return generateFallbackHTML(prompt);
      }
      
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || generateFallbackHTML(prompt);
  } catch (error) {
    console.error('GitHub generation error:', error);
    return generateFallbackHTML(prompt);
  }
}

function extractWaitTime(message: string): number | null {
  if (!message) return null;
  
  const match = message.match(/wait (\d+) seconds?/i);
  return match ? parseInt(match[1], 10) : null;
}