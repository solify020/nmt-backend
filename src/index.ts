import express, { Request, Response } from 'express';
import morgan from "morgan"
import axios from 'axios';
import {OpenAI} from 'openai';


const app = express();
const port = 5000;

const OPENAI_API_KEY = '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';
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
})

app.use(morgan('dev'))

app.post('/analysis', async (req: Request, res: Response) => {
  try {
    const prompt = `
    This is my token information that I want to launch. ${req.body}
    Please output only just json format with following fields.
    {
        similarTokens: [<Token>],
        analyze: <Analyze>
    }

    Token {
      tokenName: string,
      marketCap: number,
      liquidity: number,
      h24Volume: number,
      holders: number,
      chain: string,
      similarityPercentage: number,
    }

    Analyze {
      analyze_result: string,
      success_rate: number,
      way_to_success: string,
    }

    analyze_result is the result of analyzing the token.
    success_rate is the success rate of the token.
    way_to_success is the way to success of the token.
  `
  
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4",
  //   messages: [
  //     { role: "system", content: "You are a meme coin analyzer." },
  //     { role: "user", content: prompt }
  //   ]
  // });

    const response = await openai.responses.create({
      model: "gpt-4.1",
      tools: [{type: "web_search_preview_2025_03_11"}],
      input: prompt
    })

    res.json(response);
  } catch (err: any) {
    console.error("agafasdfasdasfas", err);
    res.status(500).json({ error: 'Internal server error' });
  }
  
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});