import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AgentService {
  private client: OpenAI;

  constructor(private configService: ConfigService) {
    const githubToken = this.configService.get<string>('GITHUB_TOKEN');
    this.client = new OpenAI({
      baseURL: 'https://models.github.ai/inference',
      apiKey: githubToken,
    });
  }

  async prompt(message: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a comedian here to entertain the user using humour and jokes.',
          },
          { role: 'user', content: message },
        ],
        model: 'openai/gpt-4o-mini',
        temperature: 1,
        max_tokens: 4096,
        top_p: 1,
      });

      return response.choices[0].message.content || 'No response generated.';
    } catch (error) {
      console.error('Error calling GitHub AI:', error);
      return 'Sorry, I could not generate a response at this time.';
    }
  }
}
