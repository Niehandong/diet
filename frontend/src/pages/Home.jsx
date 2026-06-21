import { useState, useEffect } from 'react'
import { Card, Typography, Button, Statistic, Row, Col, Tag } from 'antd'
import { SunOutlined, HeartOutlined, BookOutlined, MessageOutlined, ArrowRightOutlined, RiseOutlined, CalendarOutlined, EnvironmentOutlined, MoonOutlined, ThunderboltOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { solarTermAPI, constitutionAPI, recipeAPI, healthAPI } from '../services/api'

const { Title, Text, Paragraph } = Typography

function Home() {
  const [currentTerm, setCurrentTerm] = useState(null)
  const [constitution, setConstitution] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [statistics, setStatistics] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [termRes, recipeRes] = await Promise.all([
          solarTermAPI.getCurrent(),
          recipeAPI.recommend({})
        ])
        setCurrentTerm(termRes.data)
        setRecommendations(recipeRes.data)
        
        const constRes = await constitutionAPI.getCurrent().catch(() => null)
        if (constRes) setConstitution(constRes.data)
        
        const statsRes = await healthAPI.getStatistics().catch(() => null)
        if (statsRes) setStatistics(statsRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const constitutionNames = {
    BALANCED: '平和质',
    QI_DEFICIENCY: '气虚质',
    YANG_DEFICIENCY: '阳虚质',
    YIN_DEFICIENCY: '阴虚质',
    PHLEGM_DAMP: '痰湿质',
    DAMP_HEAT: '湿热质',
    BLOOD_STASIS: '血瘀质',
    QI_STAGNATION: '气郁质',
    SPECIAL_CONSTITUTION: '特禀质'
  }

  const navItems = [
    { icon: HeartOutlined, label: '体质辨识', path: '/constitution', color: 'bg-red-500', desc: '了解您的体质类型' },
    { icon: SunOutlined, label: '节气养生', path: '/solar-term', color: 'bg-yellow-500', desc: '二十四节气指南' },
    { icon: BookOutlined, label: '食谱推荐', path: '/recipes', color: 'bg-green-500', desc: '个性化饮食建议' },
    { icon: ThunderboltOutlined, label: '健康追踪', path: '/health', color: 'bg-blue-500', desc: '记录健康数据' },
    { icon: MessageOutlined, label: '养生问答', path: '/qa', color: 'bg-purple-500', desc: 'AI养生顾问' },
  ]

  return (
    <div className="space-y-6">
      <Card 
        className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white"
        styles={{ body: { padding: '2rem' } }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <CalendarOutlined className="text-green-200" />
              <Text className="text-green-200">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
            </div>
            <Title level={2} className="text-white mb-2">今日养生指南</Title>
            {currentTerm && (
              <div className="flex items-center space-x-2">
                <EnvironmentOutlined className="text-green-200" />
                <Text className="text-green-200">当前节气：{currentTerm.name}</Text>
              </div>
            )}
          </div>
          {constitution && (
            <Card 
              className="bg-white/20 backdrop-blur-sm border-0 mt-4 md:mt-0"
              styles={{ body: { padding: '1.5rem' } }}
            >
              <Text className="text-green-200 text-sm">您的体质</Text>
              <Title level={3} className="text-white mt-1">{constitutionNames[constitution.primary_type]}</Title>
            </Card>
          )}
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {navItems.map((item) => (
          <Col xs={12} sm={6} key={item.path}>
            <Card 
              hoverable
              className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => window.location.href = item.path}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                  <item.icon style={{ fontSize: '1.5rem', color: 'white' }} />
                </div>
                <div>
                  <Title level={4} className="mb-0">{item.label}</Title>
                  <Text type="secondary" className="text-sm">{item.desc}</Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="今日食谱推荐" className="shadow-md">
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((recipe) => (
                <Card 
                  key={recipe.id} 
                  hoverable
                  className="border-0 bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/recipes/${recipe.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Title level={4} className="mb-1">{recipe.name}</Title>
                      <Paragraph className="text-sm text-gray-500 mb-0">{recipe.description}</Paragraph>
                    </div>
                    <Tag color="gold">难度 {recipe.difficulty}</Tag>
                  </div>
                </Card>
              ))}
            </div>
            <div className="text-center mt-4">
              <Button type="link" href="/recipes">查看全部 <ArrowRightOutlined className="ml-1" /></Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="健康数据概览" className="shadow-md">
            {statistics ? (
              <Row gutter={[16, 16]}>
                <Col xs={8}>
                  <Card className="border-0 bg-blue-50">
                    <div className="flex items-center justify-center mb-2">
                      <RiseOutlined style={{ fontSize: '1.5rem', color: '#3b82f6' }} />
                    </div>
                    <Statistic 
                      title="平均体重" 
                      value={statistics.average_weight} 
                      suffix="kg"
                      className="text-center"
                    />
                  </Card>
                </Col>
                <Col xs={8}>
                  <Card className="border-0 bg-purple-50">
                    <div className="flex items-center justify-center mb-2">
                      <MoonOutlined style={{ fontSize: '1.5rem', color: '#a855f7' }} />
                    </div>
                    <Statistic 
                      title="平均睡眠" 
                      value={statistics.average_sleep} 
                      suffix="h"
                      className="text-center"
                    />
                  </Card>
                </Col>
                <Col xs={8}>
                  <Card className="border-0 bg-green-50">
                    <div className="flex items-center justify-center mb-2">
                      <ThunderboltOutlined style={{ fontSize: '1.5rem', color: '#10b981' }} />
                    </div>
                    <Statistic 
                      title="平均精力" 
                      value={statistics.average_energy} 
                      suffix="/5"
                      className="text-center"
                    />
                  </Card>
                </Col>
              </Row>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <QuestionCircleOutlined style={{ fontSize: '3rem', color: '#9ca3af', marginBottom: '0.5rem' }} />
                <Paragraph>暂无健康数据</Paragraph>
                <Button type="primary" href="/health">开始记录</Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {currentTerm && (
        <Card title={currentTerm.name + '养生要点'} className="shadow-md">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={6}>
              <div className="bg-orange-50 rounded-lg p-4">
                <Text type="secondary" className="text-sm">气候特点</Text>
                <Paragraph className="mt-1">{currentTerm.climate}</Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div className="bg-red-50 rounded-lg p-4">
                <Text type="secondary" className="text-sm">易发疾病</Text>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentTerm.common_diseases.map((disease) => (
                    <Tag key={disease} color="red">{disease}</Tag>
                  ))}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div className="bg-green-50 rounded-lg p-4">
                <Text type="secondary" className="text-sm">推荐食材</Text>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentTerm.recommended_foods.slice(0, 3).map((food) => (
                    <Tag key={food} color="green">{food}</Tag>
                  ))}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div className="bg-purple-50 rounded-lg p-4">
                <Text type="secondary" className="text-sm">养生功法</Text>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentTerm.exercises.slice(0, 2).map((exercise) => (
                    <Tag key={exercise} color="purple">{exercise}</Tag>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  )
}

export default Home