import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, Alert, Spin } from 'antd'
import { SunOutlined, MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { authAPI } from '../services/api'

const { Title, Text } = Typography

function Login() {
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (values) => {
    setLoading(true)
    setError('')

    try {
      const response = await authAPI.login(values.email, values.password)
      localStorage.setItem('token', response.data.access_token)
      
      const userResponse = await authAPI.getCurrentUser()
      localStorage.setItem('user', JSON.stringify(userResponse.data))
      
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || '登录失败，请检查邮箱和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card 
        className="w-full max-w-md shadow-2xl" 
        bordered={false}
        styles={{ body: { padding: '2rem' } }}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <SunOutlined style={{ fontSize: '2rem', color: 'white' }} />
          </div>
          <Title level={2} className="mb-1">节气膳灵</Title>
          <Text type="secondary">跟着节气吃饭，养出好体质</Text>
        </div>

        {error && (
          <Alert
            message="登录失败"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="请输入邮箱"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 h-12 text-base"
            >
              {loading ? <Spin size="small" /> : '登录'}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text type="secondary">
            还没有账号？{' '}
            <Link to="/register" className="text-green-600 hover:text-green-700">
              立即注册
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default Login