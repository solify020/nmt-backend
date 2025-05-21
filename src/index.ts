import express, { Request, Response } from 'express';
import morgan from "morgan"
import axios from 'axios';
import {OpenAI} from 'openai';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 5000;

const OPENAI_API_KEY = '';
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
})

app.use(morgan('dev'))

app.post('/analysis', async (req: Request, res: Response) => {
  try {
    const token_info = req.body;
    const prompt = `
    This is my token information that I want to launch.
    - TokenType: ${token_info.tokenType}
    - TokenName: ${token_info.tokenName}
    - TokenDescription: ${token_info.tokenDescription}
    - dex: ${token_info.dex}
    - chain: ${token_info.chain}
    - X_Followers: ${token_info.x_followers}
    - Telegram_Members: ${token_info.telegram_members}
    Please output only just json format with following fields.
    You mustn't output any other text except json.
    You must output start with "{" and end with "}".
    Don't output like "Please provide...", "of course" etc.
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

    My token is not launched yet.
    It is what I want to launch.
    search similar name or desscription tokens online and same blockchain.
    similar tokens chain must be same as my token's chain.
    Each data of similar tokens mustn't be null, must have value (must fetch data from online web search).
    If my chain is Solana, the similar tokens' chain must be Solana.
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

    const response = (await openai.responses.create({
      model: "gpt-4.1",
      tools: [{type: "web_search_preview_2025_03_11"}],
      input: prompt
    })).output_text;

    const result = JSON.parse(response.replace("```json", "").replace("```", "").replace("\n", ""));


    res.json(result);
  } catch (err: any) {
    console.error("agafasdfasdasfas", err);
    res.status(500).json({ error: 'Internal server error' });
  }
  
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});