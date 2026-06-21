import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Avatar, Dropdown, Button, Typography } from 'antd'
import { HomeOutlined, HeartOutlined, SunOutlined, BookOutlined, ThunderboltOutlined, MessageOutlined, LogoutOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = AntLayout
const { Text } = Typography

function Layout() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) {
    return null
  }

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/constitution', icon: <HeartOutlined />, label: '体质辨识' },
    { key: '/solar-term', icon: <SunOutlined />, label: '节气养生' },
    { key: '/recipes', icon: <BookOutlined />, label: '食谱推荐' },
    { key: '/health', icon: <ThunderboltOutlined />, label: '健康追踪' },
    { key: '/qa', icon: <MessageOutlined />, label: '养生问答' },
  ]

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: handleLogout,
    },
  ]

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 100, 
          display: 'flex', 
          alignItems: 'center',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '0 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 24 }}>
          <div 
            style={{ 
              width: 40, 
              height: 40, 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              borderRadius: 8, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <SunOutlined style={{ fontSize: 20, color: '#fff' }} />
          </div>
          <Text strong style={{ fontSize: 20 }}>节气膳灵</Text>
        </div>
        
        <Menu 
          mode="horizontal" 
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
          style={{ 
            flex: 1, 
            border: 'none',
            background: 'transparent',
          }}
        />

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} style={{ marginRight: 8, backgroundColor: '#10b981' }} />
            <Text className="hidden-mobile">{user.username}</Text>
          </div>
        </Dropdown>
      </Header>

      <Content style={{ padding: '24px', background: '#f5f5f5', minHeight: 'calc(100vh - 134px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Outlet />
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        <Text type="secondary">© 2026 节气膳灵 - 跟着节气吃饭，养出好体质</Text>
      </Footer>
    </AntLayout>
  )
}

export default Layout