import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AgentService } from './agent.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly agentService: AgentService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('prompt')
  async getPrompt(): Promise<string> {
    return await this.agentService.prompt('Entertain me!');
  }
}
