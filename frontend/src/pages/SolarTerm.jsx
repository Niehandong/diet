import { useState, useEffect } from 'react'
import { Card, Typography, Tag, Empty, Button } from 'antd'
import { 
  SunOutlined, CalendarOutlined, AlertOutlined, EnvironmentOutlined, 
  HeartOutlined, BulbOutlined, CloudOutlined, ThunderboltOutlined,
  StarOutlined
} from '@ant-design/icons'
import { solarTermAPI } from '../services/api'

const { Title, Text, Paragraph } = Typography

function SolarTerm() {
  const [currentTerm, setCurrentTerm] = useState(null)
  const [allTerms, setAllTerms] = useState([])
  const [selectedTerm, setSelectedTerm] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currentRes, allRes] = await Promise.all([
          solarTermAPI.getCurrent().catch(() => ({ data: null })),
          solarTermAPI.getAll().catch(() => ({ data: [] }))
        ])
        setCurrentTerm(currentRes.data)
        setAllTerms(allRes.data || [])
        setSelectedTerm(currentRes.data || (allRes.data && allRes.data[0]))
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const handleTermClick = (term) => {
    setSelectedTerm(term)
  }

  const seasonConfig = {
    '春': { 
      bg: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)', 
      bgLight: 'rgba(134, 239, 172, 0.1)',
      border: '#4ade80',
      icon: <StarOutlined />
    },
    '夏': { 
      bg: 'linear-gradient(135deg, #fca5a5 0%, #f87171 100%)', 
      bgLight: 'rgba(252, 165, 165, 0.1)',
      border: '#f87171',
      icon: <SunOutlined />
    },
    '秋': { 
      bg: 'linear-gradient(135deg, #fdba74 0%, #fb923c 100%)', 
      bgLight: 'rgba(253, 186, 116, 0.1)',
      border: '#fb923c',
      icon: <CloudOutlined />
    },
    '冬': { 
      bg: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)', 
      bgLight: 'rgba(147, 197, 253, 0.1)',
      border: '#60a5fa',
      icon: <ThunderboltOutlined />
    }
  }

  const getSeason = (termName) => {
    const springTerms = ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨']
    const summerTerms = ['立夏', '小满', '芒种', '夏至', '小暑', '大暑']
    const autumnTerms = ['立秋', '处暑', '白露', '秋分', '寒露', '霜降']
    const winterTerms = ['立冬', '小雪', '大雪', '冬至', '小寒', '大寒']

    if (springTerms.includes(termName)) return '春'
    if (summerTerms.includes(termName)) return '夏'
    if (autumnTerms.includes(termName)) return '秋'
    return '冬'
  }

  const groupedTerms = {
    '春': allTerms.filter(t => ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨'].includes(t.name)),
    '夏': allTerms.filter(t => ['立夏', '小满', '芒种', '夏至', '小暑', '大暑'].includes(t.name)),
    '秋': allTerms.filter(t => ['立秋', '处暑', '白露', '秋分', '寒露', '霜降'].includes(t.name)),
    '冬': allTerms.filter(t => ['立冬', '小雪', '大雪', '冬至', '小寒', '大寒'].includes(t.name))
  }

  const seasonTips = {
    '春': '春季阳气生发，应晚睡早起，养护肝脏，多食绿色蔬菜。',
    '夏': '夏季炎热，应晚睡早起，养护心脏，保持心静，多食红色食物。',
    '秋': '秋季干燥，应早睡早起，养护肺脏，滋阴润燥，多食白色食物。',
    '冬': '冬季寒冷，应早睡晚起，养护肾脏，注意保暖，多食黑色食物。'
  }

  const termIcons = {
    '立春': '🌱', '雨水': '💧', '惊蛰': '🐛', '春分': '⚖️', '清明': '🌸', '谷雨': '🌧️',
    '立夏': '🌿', '小满': '🌾', '芒种': '🌱', '夏至': '☀️', '小暑': '🔥', '大暑': '💥',
    '立秋': '🍂', '处暑': '🌤️', '白露': '💦', '秋分': '🍁', '寒露': '🌬️', '霜降': '❄️',
    '立冬': '🍃', '小雪': '🌨️', '大雪': '❄️', '冬至': '☃️', '小寒': '🌫️', '大寒': '🧊'
  }

  return (
    <div className="solar-term-page">
      {/* 页面标题 */}
      <div className="solar-term-hero">
        <div className="solar-term-hero-content">
          <div className="solar-term-hero-icon">
            <StarOutlined />
          </div>
          <div className="solar-term-hero-text">
            <Title level={2} className="solar-term-hero-title">节气膳灵</Title>
            <Text className="solar-term-hero-subtitle">顺应天时，养生有道</Text>
          </div>
        </div>
      </div>

      <div className="solar-term-container">
        {/* 左侧节气选择 */}
        <div className="solar-term-sidebar">
          <Card className="solar-term-sidebar-card" styles={{ body: { padding: '1.25rem' } }}>
            <div className="solar-term-sidebar-header">
              <CalendarOutlined className="solar-term-sidebar-icon" />
              <span>二十四节气</span>
            </div>
            
            <div className="solar-term-season-list">
              {['春', '夏', '秋', '冬'].map((season) => (
                groupedTerms[season] && groupedTerms[season].length > 0 && (
                  <div key={season} className="solar-term-season-group">
                    <div 
                      className="solar-term-season-header"
                      style={{ borderColor: seasonConfig[season].border }}
                    >
                      <span className="solar-term-season-icon" style={{ color: seasonConfig[season].border }}>
                        {seasonConfig[season].icon}
                      </span>
                      <Text strong className="solar-term-season-name">{season}季</Text>
                    </div>
                    
                    <div className="solar-term-term-grid">
                      {groupedTerms[season].map((term) => {
                        const isSelected = selectedTerm?.id === term.id
                        const isCurrent = currentTerm?.id === term.id
                        return (
                          <button
                            key={term.id}
                            onClick={() => handleTermClick(term)}
                            className={`solar-term-term-button ${isSelected ? 'is-selected' : ''} ${isCurrent ? 'is-current' : ''}`}
                            style={isSelected ? { background: seasonConfig[season].bg } : {}}
                          >
                            <span className="solar-term-term-icon">{termIcons[term.name] || '🌑'}</span>
                            <span className="solar-term-term-name">{term.name}</span>
                            {isCurrent && <span className="solar-term-current-badge">今</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              ))}
            </div>
          </Card>
        </div>

        {/* 右侧详情 */}
        <div className="solar-term-content">
          {selectedTerm ? (
            <>
              {/* 节气头部 */}
              <Card 
                className="solar-term-hero-card" 
                styles={{ body: { padding: 0 } }}
              >
                <div 
                  className="solar-term-hero-inner"
                  style={{ background: seasonConfig[getSeason(selectedTerm.name)].bg }}
                >
                  <div className="solar-term-hero-decoration" />
                  
                  <div className="solar-term-hero-main">
                    <div className="solar-term-hero-left">
                      <div className="solar-term-icon-wrapper">
                        <span className="solar-term-icon-large">{termIcons[selectedTerm.name] || '🌑'}</span>
                      </div>
                      <div className="solar-term-info">
                        <div className="solar-term-tag-row">
                          <span className="solar-term-season-tag" style={{ background: seasonConfig[getSeason(selectedTerm.name)].bgLight, color: seasonConfig[getSeason(selectedTerm.name)].border }}>
                            {getSeason(selectedTerm.name)}季
                          </span>
                          {currentTerm?.id === selectedTerm.id && (
                            <span className="solar-term-current-tag">当前节气</span>
                          )}
                        </div>
                        <Title level={1} className="solar-term-title">{selectedTerm.name}</Title>
                        <Text className="solar-term-subtitle">{selectedTerm.name_en}</Text>
                        <Paragraph className="solar-term-desc">{selectedTerm.climate}</Paragraph>
                      </div>
                    </div>
                    
                    <div className="solar-term-hero-right">
                      <div className="solar-term-stats">
                        <div className="solar-term-stat-item">
                          <Text className="solar-term-stat-value">24</Text>
                          <Text className="solar-term-stat-label">节气总数</Text>
                        </div>
                        <div className="solar-term-stat-divider" />
                        <div className="solar-term-stat-item">
                          <Text className="solar-term-stat-value">4</Text>
                          <Text className="solar-term-stat-label">季节</Text>
                        </div>
                        <div className="solar-term-stat-divider" />
                        <div className="solar-term-stat-item">
                          <Text className="solar-term-stat-value">15</Text>
                          <Text className="solar-term-stat-label">天/节气</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 季节养生 */}
              <Card className="solar-term-card" styles={{ body: { padding: '1.5rem' } }}>
                <div className="solar-term-card-header">
                  <BulbOutlined className="solar-term-card-icon" style={{ color: '#eab308' }} />
                  <span>{getSeason(selectedTerm.name)}季养生要点</span>
                </div>
                <div className="solar-term-tip-box" style={{ borderLeftColor: seasonConfig[getSeason(selectedTerm.name)].border }}>
                  <div className="solar-term-tip-icon">💡</div>
                  <Paragraph className="solar-term-tip-text">{seasonTips[getSeason(selectedTerm.name)]}</Paragraph>
                </div>
              </Card>

              {/* 饮食建议 */}
              <div className="solar-term-grid">
                <Card className="solar-term-card solar-term-card-food" styles={{ body: { padding: '1.5rem' } }}>
                  <div className="solar-term-card-header">
                    <EnvironmentOutlined className="solar-term-card-icon" style={{ color: '#22c55e' }} />
                    <span>推荐食材</span>
                  </div>
                  <div className="solar-term-tag-list">
                    {selectedTerm.recommended_foods && selectedTerm.recommended_foods.length > 0 ? (
                      selectedTerm.recommended_foods.map((food) => (
                        <Tag key={food} className="solar-term-tag solar-term-tag-green">{food}</Tag>
                      ))
                    ) : (
                      <Text type="secondary">暂无推荐</Text>
                    )}
                  </div>
                </Card>

                <Card className="solar-term-card solar-term-card-food" styles={{ body: { padding: '1.5rem' } }}>
                  <div className="solar-term-card-header">
                    <AlertOutlined className="solar-term-card-icon" style={{ color: '#ef4444' }} />
                    <span>禁忌食物</span>
                  </div>
                  <div className="solar-term-tag-list">
                    {selectedTerm.forbidden_foods && selectedTerm.forbidden_foods.length > 0 ? (
                      selectedTerm.forbidden_foods.map((food) => (
                        <Tag key={food} className="solar-term-tag solar-term-tag-red">{food}</Tag>
                      ))
                    ) : (
                      <Text type="secondary">暂无</Text>
                    )}
                  </div>
                </Card>

                <Card className="solar-term-card solar-term-card-food" styles={{ body: { padding: '1.5rem' } }}>
                  <div className="solar-term-card-header">
                    <AlertOutlined className="solar-term-card-icon" style={{ color: '#f97316' }} />
                    <span>易发疾病</span>
                  </div>
                  <div className="solar-term-tag-list">
                    {selectedTerm.common_diseases && selectedTerm.common_diseases.length > 0 ? (
                      selectedTerm.common_diseases.map((disease) => (
                        <Tag key={disease} className="solar-term-tag solar-term-tag-orange">{disease}</Tag>
                      ))
                    ) : (
                      <Text type="secondary">暂无</Text>
                    )}
                  </div>
                </Card>

                <Card className="solar-term-card solar-term-card-food" styles={{ body: { padding: '1.5rem' } }}>
                  <div className="solar-term-card-header">
                    <HeartOutlined className="solar-term-card-icon" style={{ color: '#a855f7' }} />
                    <span>养生功法</span>
                  </div>
                  <div className="solar-term-tag-list">
                    {selectedTerm.exercises && selectedTerm.exercises.length > 0 ? (
                      selectedTerm.exercises.map((exercise) => (
                        <Tag key={exercise} className="solar-term-tag solar-term-tag-purple">{exercise}</Tag>
                      ))
                    ) : (
                      <Text type="secondary">暂无</Text>
                    )}
                  </div>
                </Card>
              </div>
            </>
          ) : (
            <Card className="solar-term-card">
              <Empty description="请选择左侧节气查看详情" />
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default SolarTerm