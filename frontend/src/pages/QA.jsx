import { useState, useEffect, useRef } from 'react'
import { Typography, Input, Button, Tag, Spin, Avatar, Tooltip, message } from 'antd'
import { MessageOutlined, SendOutlined, UserOutlined, RobotOutlined, ReloadOutlined } from '@ant-design/icons'
import { qaAPI } from '../services/api'

const { Title, Text } = Typography
const { TextArea } = Input

function QA() {
  const [questions, setQuestions] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [typingId, setTypingId] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await qaAPI.getHistory().catch(() => ({ data: [] }))
        const history = (res.data || []).slice(0, 20).map((item, i) => ({
          id: item.id || i,
          question: item.question,
          answer: item.answer,
          isUser: false,
          isHistory: true
        }))
        const formatted = []
        history.forEach(h => {
          formatted.push({ id: `${h.id}-q`, question: h.question, isUser: true, isHistory: true })
          formatted.push({ id: `${h.id}-a`, answer: h.answer, isUser: false, isHistory: true })
        })
        setQuestions(formatted.reverse())
      } catch (err) {
        console.error(err)
      }
    }
    fetchHistory()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [questions])

  const exampleQuestions = [
    '白露节气适合吃什么',
    '最近总是口干舌燥怎么办',
    '气虚体质应该怎么调理',
    '春季如何养肝',
    '失眠应该吃什么'
  ]

  const typeText = (text, callback) => {
    let index = 0
    const intervalId = setInterval(() => {
      if (index < text.length) {
        callback(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(intervalId)
        setTypingId(null)
      }
    }, 30)
    return intervalId
  }

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return

    const newQuestion = {
      id: Date.now(),
      question: inputValue,
      isUser: true
    }
    setQuestions(prev => [...prev, newQuestion])
    const currentInput = inputValue
    setInputValue('')
    setLoading(true)

    try {
      const res = await qaAPI.ask(currentInput)
      const answerText = res.data?.answer || '抱歉，暂时无法回答您的问题。'
      
      const answerId = Date.now() + 1
      const answer = {
        id: answerId,
        answer: '',
        isUser: false
      }
      setQuestions(prev => [...prev, answer])
      
      const intervalId = typeText(answerText, (partial) => {
        setQuestions(prev => prev.map(q => 
          q.id === answerId ? { ...q, answer: partial } : q
        ))
      })
      setTypingId(intervalId)
    } catch (err) {
      const errorAnswer = {
        id: Date.now() + 1,
        answer: err.response?.data?.detail || '抱歉，暂时无法回答您的问题，请稍后再试。',
        isUser: false
      }
      setQuestions(prev => [...prev, errorAnswer])
      message.error('问答请求失败')
    } finally {
      setLoading(false)
    }
  }

  const handleExampleClick = (question) => {
    setInputValue(question)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const refreshChat = () => {
    setQuestions([])
  }

  return (
    <div className="qa-page">
      <div className="qa-header">
        <div className="qa-header-content">
          <div className="qa-header-left">
            <Avatar className="qa-avatar-main" icon={<RobotOutlined />} />
            <div className="qa-header-text">
              <Title level={3} className="qa-title">AI养生顾问</Title>
              <div className="qa-status">
                <span className="status-dot"></span>
                <Text className="status-text">在线</Text>
              </div>
            </div>
          </div>
          <div className="qa-header-right">
            <Tooltip title="清空对话">
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={refreshChat}
                className="qa-refresh-btn"
              />
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="qa-chat-container">
        <div className="qa-messages-wrapper">
          {questions.length === 0 ? (
            <div className="qa-empty-state">
              <div className="qa-empty-content">
                <div className="qa-empty-avatar">
                  <RobotOutlined style={{ fontSize: 48 }} />
                </div>
                <Title level={4} className="qa-empty-title">您好！我是您的AI养生顾问</Title>
                <Text type="secondary" className="qa-empty-desc">有任何养生问题都可以问我，我会为您提供专业的养生建议</Text>
              </div>
              <div className="qa-empty-tips">
                <Text type="secondary" style={{ fontSize: 14 }}>试试这些问题：</Text>
                <div className="qa-empty-tags">
                  {exampleQuestions.slice(0, 3).map((question, index) => (
                    <Tag
                      key={index}
                      onClick={() => handleExampleClick(question)}
                      className="qa-quick-tag"
                    >
                      {question}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="qa-message-list">
              {questions.map((item) => (
                <div
                  key={item.id}
                  className={`qa-message ${item.isUser ? 'qa-user-message' : 'qa-ai-message'}`}
                >
                  <Avatar
                    className={`qa-message-avatar ${item.isUser ? 'user-avatar' : 'ai-avatar'}`}
                    icon={item.isUser ? <UserOutlined /> : <RobotOutlined />}
                  />
                  <div className={`qa-message-content ${item.isUser ? 'user-content' : 'ai-content'}`}>
                    <div className={`qa-message-bubble ${item.isUser ? 'user-bubble' : 'ai-bubble'}`}>
                      <div className="qa-message-text">
                        {item.question || item.answer}
                      </div>
                      {!item.isUser && typingId && item.answer && item.answer.length > 0 && (
                        <div className="qa-typing-indicator">
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                        </div>
                      )}
                    </div>
                    {item.isHistory && (
                      <Text className="qa-message-time">历史记录</Text>
                    )}
                  </div>
                </div>
              ))}
              {loading && !typingId && (
                <div className="qa-message qa-ai-message">
                  <Avatar className="qa-message-avatar ai-avatar" icon={<RobotOutlined />} />
                  <div className="qa-message-content ai-content">
                    <div className="qa-message-bubble ai-bubble">
                      <div className="qa-thinking">
                        <Spin size="small" />
                        <Text type="secondary" style={{ marginLeft: 8 }}>正在思考养生方案...</Text>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="qa-input-area">
          <div className="qa-quick-questions">
            <Text type="secondary" className="qa-quick-label">快捷问题：</Text>
            <div className="qa-quick-tags">
              {exampleQuestions.map((question, index) => (
                <Tag
                  key={index}
                  onClick={() => handleExampleClick(question)}
                  className="qa-quick-tag"
                >
                  <MessageOutlined style={{ marginRight: 4 }} />
                  {question}
                </Tag>
              ))}
            </div>
          </div>
          <div className="qa-input-wrapper">
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="输入您的养生问题..."
              autoSize={{ minRows: 1, maxRows: 3 }}
              className="qa-input"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!inputValue.trim() || loading}
              loading={loading}
              className="qa-send-btn"
            >
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QA