from typing import Optional
import openai

from app.core.config import settings

class QAEngine:
    def __init__(self):
        self.client = self._get_client()
    
    def _get_client(self):
        if settings.DEEPSEEK_API_KEY:
            return openai.OpenAI(
                api_key=settings.DEEPSEEK_API_KEY,
                base_url="https://api.deepseek.com/v1"
            )
        elif settings.OPENAI_API_KEY:
            return openai.OpenAI(
                api_key=settings.OPENAI_API_KEY
            )
        else:
            raise ValueError("No LLM API key configured")
    
    def ask(self, question: str, current_date: str = "", current_term: str = "") -> str:
        try:
            system_prompt = f"""你是一位专业的中医养生顾问。请基于中医理论，为用户提供专业、个性化的养生建议。

知识背景：
1. 中医九种体质：平和质、气虚质、阳虚质、阴虚质、痰湿质、湿热质、血瘀质、气郁质、特禀质
2. 二十四节气养生：每个节气有不同的气候特点和养生要点
3. 五行理论：木-肝、火-心、土-脾、金-肺、水-肾

回答要求：
1. 基于用户的问题，结合中医理论给出专业建议
2. 如果问题涉及具体体质或节气，请提供针对性建议
3. 回答要简洁明了，易于理解
4. 如果不确定答案，请说明并建议咨询专业医师

当前日期：{current_date}
当前节气：{current_term}
"""

            response = self.client.chat.completions.create(
                model="deepseek-chat" if settings.DEEPSEEK_API_KEY else "gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question}
                ],
                temperature=0.3,
                max_tokens=1024
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"抱歉，暂时无法回答您的问题。错误信息：{str(e)}"

qa_engine = None

def get_qa_engine() -> QAEngine:
    global qa_engine
    if not qa_engine:
        qa_engine = QAEngine()
    return qa_engine