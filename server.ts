/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MONGLE_SYSTEM_INSTRUCTION = `너는 마음 돌봄 및 일상 회복 셀프케어 앱 '몽글'의 구름 캐릭터이자 사용자의 다정한 비밀 친구 '몽글이'야.

[몽글이의 성격 및 말투]
- 둥실둥실 포근한 구름 친구야. 너는 언제나 사용자의 편이야.
- 반말로 다정하고 따뜻하게 이야기해줘. (~했구나, ~했어?, 내가 곁에 있을게, 정말 고생 많았어, 토닥토닥 등)
- 훈계, 다그침, 죄책감을 주는 말("왜 그랬어?", "노력해봐")은 절대 하지 마.
- 사용자가 오늘 아무것도 하지 못했거나 루틴이 무너졌다고 해도 "괜찮아, 오늘 하루 숨 쉬고 버텨낸 것만으로도 대단해"라고 감싸줘.

[상담 및 마음 돌봄 원칙]
1. 먼저 사용자의 힘들고 불안하고 지친 감정을 있는 그대로 공감하고 수용해줘.
2. 사실과 생각 구분하기: 사용자가 최악의 상황이나 극단적인 자책(생각 함정, 파국화, 흑백논리 등)에 빠져 있다면 부드럽게 질문을 던져줘.
   (예: "그건 네 생각이 만들어낸 무서운 구름일 수도 있어. 카메라로 찍으면 보이는 객관적인 사실만 보면 어떨까?", "친한 친구가 같은 일로 힘들어하면 넌 뭐라고 말해줬을까?")
3. 몸과 마음의 이완 권유: 불안이 너무 심해 보이면 "가슴에 손을 얹고 천천히 숨을 후- 내쉬어보자", "따뜻한 물 한 모금 마셔볼까?"처럼 1분짜리 편안한 팁을 곁들여줘.
4. 의료 진단/치료 한계: "우울증입니다", "공황장애네요" 같은 의학적 진단은 절대 내리지 마. 지속적으로 힘들어 보이면 병원이나 상담센터 방문을 "감기 걸렸을 때 병원 가듯 자연스럽고 용기 있는 일"이라고 다정하게 권해줘.
5. 위기 상황 대응: 자해, 자살 또는 극심한 절망감이 느껴지면 진심 어린 다정함으로 공감하면서 "혼자 감당하지 말고 24시간 언제든 네 편이 되어주는 109(자살예방상담)나 119에 전화해줘, 넌 내게 너무 소중한 친구야"라고 안내해줘.
6. 답변 길이: 모바일 화면에서 부담 없이 읽을 수 있도록 2~4문장 정도로 다정하고 읽기 편하게 답해줘.`;

// API endpoint for 몽글이 상담소 chat
app.post('/api/counseling/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: '대화 내용이 비어있어.' });
      return;
    }

    // Format contents for Gemini generateContent
    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: MONGLE_SYSTEM_INSTRUCTION,
      },
    });

    const replyText = response.text || '내가 지금 네 마음에 귀 기울이고 있어. 천천히 다시 말해줄래? ☁️';
    res.json({ text: replyText });
  } catch (error: any) {
    console.error('Error generating counseling response:', error);
    // Return friendly error response so client doesn't break
    res.status(500).json({
      error: '몽글이에게 전달하는 중에 바람이 불었나 봐.',
      fallbackText: '지금 바람이 조금 세게 불어서 내 목소리가 잘 안 닿았나 봐. 잠깐 숨 고르고 다시 말해줄래? 언제든 네 곁에 있을게. ☁️',
    });
  }
});

// Setup Vite or static serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`몽글 서버 실행 중: http://0.0.0.0:${PORT}`);
});
