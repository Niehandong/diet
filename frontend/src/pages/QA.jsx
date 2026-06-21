import { useState, useEffect } from 'react'
import { Card, Typography, Input, Button, Tag, Spin, Empty, message } from 'antd'
import { MessageOutlined, SendOutlined, UserOutlined, RobotOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { qaAPI } from '../services/api'

const { Title, Text } = Typography
const { TextArea } = Input

function QA() {
  const [questions, setQuestions] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

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

  const exampleQuestions = [
    '白露节气适合吃什么',
    '最近总是口干舌燥怎么办',
    '气虚体质应该怎么调理',
    '春季如何养肝',
    '失眠应该吃什么'
  ]

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
      const answer = {
        id: Date.now() + 1,
        answer: res.data?.answer || '抱歉，暂时无法回答您的问题。',
        isUser: false
      }
      setQuestions(prev => [...prev, answer])
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

  return (
    <div className="max-w-3xl mx-auto">
      {/* 头部 */}
      <Card
        className="border-0 shadow-md mb-6"
        styles={{ body: { padding: '1.5rem 2rem' } }}
        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
      >
        <div className="flex items-center gap-3 text-white">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <RobotOutlined className="text-2xl" />
          </div>
          <div>
            <Title level={3} className="text-white mb-0">AI 养生问答</Title>
            <Text className="text-green-100">随时咨询您的养生问题</Text>
          </div>
        </div>
      </Card>

      {/* 聊天区 */}
      <Card className="shadow-md mb-4" styles={{ body: { padding: 0 } }}>
        <div className="p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
          {questions.length === 0 ? (
            <Empty
              image={<ThunderboltOutlined className="text-4xl text-gray-300" />}
              description={
                <div className="text-center">
                  <Text type="secondary">开始您的第一次养生咨询吧</Text>
                </div>
              }
            />
          ) : (
            <div className="space-y-4">
              {questions.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 ${item.isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.isUser ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    {item.isUser
                      ? <UserOutlined className="text-white" />
                      : <RobotOutlined className="text-white" />
                    }
                  </div>
                  <div className={`max-w-[75%] ${item.isUser ? 'text-right' : ''}`}>
                    <div className={`inline-block px-4 py-3 rounded-2xl text-left whitespace-pre-wrap ${
                      item.isUser
                        ? 'bg-green-500 text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                    }`}>
                      {item.question || item.answer}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <RobotOutlined className="text-white" />
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                    <Spin size="small" /> <Text type="secondary" className="ml-2">正在思考...</Text>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="mb-3">
            <Text type="secondary" className="text-xs">试试这些问题：</Text>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {exampleQuestions.map((question, index) => (
              <Tag
                key={index}
                onClick={() => handleExampleClick(question)}
                className="cursor-pointer px-3 py-1 rounded-full hover:bg-green-50 hover:border-green-300 transition-colors"
              >
                {question}
              </Tag>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="输入您的养生问题...(Shift+Enter 换行)"
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="flex-1"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!inputValue.trim() || loading}
              loading={loading}
              className="h-10 px-5 bg-green-500 hover:!bg-green-600 border-green-500"
            >
              发送
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default QA