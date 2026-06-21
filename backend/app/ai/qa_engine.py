from typing import Optional
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate

from app.core.config import settings

class QAEngine:
    def __init__(self):
        self.llm = self._get_llm()
        self.memory = ConversationBufferMemory()
        self.chain = self._create_chain()
    
    def _get_llm(self):
        if settings.OPENAI_API_KEY:
            return ChatOpenAI(
                model="gpt-4",
                openai_api_key=settings.OPENAI_API_KEY,
                temperature=0.3
            )
        elif settings.CLAUDE_API_KEY:
            return ChatAnthropic(
                anthropic_api_key=settings.CLAUDE_API_KEY,
                model="claude-3-sonnet-20240229",
                temperature=0.3
            )
        else:
            raise ValueError("No LLM API key configured")
    
    def _create_chain(self):
        system_template = """你是一位专业的中医养生顾问。请基于中医理论，为用户提供专业、个性化的养生建议。

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
        
        human_template = "{input}"
        
        chat_prompt = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(system_template),
            HumanMessagePromptTemplate.from_template(human_template)
        ])
        
        return ConversationChain(
            llm=self.llm,
            memory=self.memory,
            prompt=chat_prompt,
            verbose=True
        )
    
    def ask(self, question: str, current_date: str = "", current_term: str = "") -> str:
        try:
            response = self.chain.run(
                input=question,
                current_date=current_date,
                current_term=current_term
            )
            return response
        except Exception as e:
            return f"抱歉，暂时无法回答您的问题。错误信息：{str(e)}"

qa_engine = None

def get_qa_engine() -> QAEngine:
    global qa_engine
    if not qa_engine:
        qa_engine = QAEngine()
    return qa_engine