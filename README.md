# 节气膳灵 (Solar Diet AI)

基于中医理论的智能养生助手，帮助用户根据节气变化和个人体质制定个性化的养生方案。

## 功能特性

- **体质辨识**：通过问卷评估用户的中医体质类型（九种体质）
- **节气养生**：根据二十四节气提供针对性的养生建议
- **五行饮食**：基于五行理论推荐平衡饮食
- **食谱推荐**：根据体质和节气推荐个性化食谱
- **健康追踪**：记录和分析健康数据
- **AI问答**：智能回答养生相关问题

## 技术栈

### 前端
- React 18 + Vite
- Tailwind CSS 3
- React Router
- Chart.js

### 后端
- FastAPI
- SQLAlchemy
- PostgreSQL
- Redis
- LangChain

### AI模型支持
- OpenAI GPT-4
- Anthropic Claude
- 阿里通义千问
- 智谱AI
- Moonshot Kimi

## 快速开始

### 使用Docker Compose（推荐）

```bash
# 启动所有服务
docker-compose up -d

# 访问前端
http://localhost:5173

# 访问后端API
http://localhost:8000

# 查看API文档
http://localhost:8000/docs
```

### 手动启动

#### 后端

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### 前端

```bash
cd frontend
npm install
npm run dev
```

## 项目结构

```
.
├── backend/                 # 后端代码
│   ├── app/
│   │   ├── api/            # API路由
│   │   ├── core/           # 核心配置
│   │   ├── engines/        # 业务引擎
│   │   ├── models/         # 数据库模型
│   │   ├── schemas/        # 数据结构定义
│   │   └── services/       # 业务服务
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── pages/          # 页面
│   │   ├── services/       # API服务
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
```

## 配置说明

### 环境变量

后端支持以下环境变量：

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| DATABASE_URL | PostgreSQL连接URL | postgresql://user:password@localhost:5432/solardiet |
| REDIS_URL | Redis连接URL | redis://localhost:6379/0 |
| SECRET_KEY | JWT密钥 | your-secret-key-here-change-in-production |
| ALGORITHM | JWT算法 | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token过期时间 | 30 |
| OPENAI_API_KEY | OpenAI API密钥 | - |
| CLAUDE_API_KEY | Claude API密钥 | - |
| TONGYI_API_KEY | 通义千问API密钥 | - |
| ZHIPU_API_KEY | 智谱AI API密钥 | - |
| KIMI_API_KEY | Kimi API密钥 | - |

## API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| /api/v1/auth/register | POST | 用户注册 |
| /api/v1/auth/login | POST | 用户登录 |
| /api/v1/auth/me | GET | 获取当前用户 |
| /api/v1/constitution/questions | GET | 获取体质问卷 |
| /api/v1/constitution/assess | POST | 评估体质 |
| /api/v1/solar-term/current | GET | 获取当前节气 |
| /api/v1/recipes/recommend | GET | 获取推荐食谱 |
| /api/v1/health/records | GET/POST | 健康记录 |
| /api/v1/qa/ask | POST | AI问答 |

## 开发说明

### 添加新功能

1. 在 `backend/app/models/` 添加数据库模型
2. 在 `backend/app/schemas/` 添加数据结构定义
3. 在 `backend/app/api/v1/endpoints/` 添加API端点
4. 在 `frontend/src/pages/` 添加前端页面

### 测试

```bash
cd backend
pytest
```

## 许可证

MIT License