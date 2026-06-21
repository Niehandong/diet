import { useState, useEffect } from 'react'
import { Card, Typography, Button, Progress, Tag, Divider, Steps } from 'antd'
import { HeartOutlined, CheckCircleOutlined, ReloadOutlined, ArrowLeftOutlined, ArrowRightOutlined, TrophyOutlined, CalendarOutlined, HistoryOutlined } from '@ant-design/icons'
import { constitutionAPI } from '../services/api'

const { Title, Text, Paragraph } = Typography

function Constitution() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [assessment, setAssessment] = useState(null)
  const [history, setHistory] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasExisting, setHasExisting] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionsRes = await constitutionAPI.getQuestions()
        setQuestions(questionsRes.data)

        const historyRes = await constitutionAPI.getHistory().catch(() => null)
        if (historyRes) setHistory(historyRes.data)

        const currentRes = await constitutionAPI.getCurrent().catch(() => null)
        if (currentRes) {
          setAssessment(currentRes.data)
          setHasExisting(true)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const constitutionNames = {
    BALANCED: '平和质', QI_DEFICIENCY: '气虚质', YANG_DEFICIENCY: '阳虚质',
    YIN_DEFICIENCY: '阴虚质', PHLEGM_DAMP: '痰湿质', DAMP_HEAT: '湿热质',
    BLOOD_STASIS: '血瘀质', QI_STAGNATION: '气郁质', SPECIAL_CONSTITUTION: '特禀质'
  }

  const constitutionIcons = {
    BALANCED: '😊', QI_DEFICIENCY: '😔', YANG_DEFICIENCY: '🥶',
    YIN_DEFICIENCY: '🔥', PHLEGM_DAMP: '💧', DAMP_HEAT: '♨️',
    BLOOD_STASIS: '🩸', QI_STAGNATION: '😞', SPECIAL_CONSTITUTION: '🤧'
  }

  const constitutionDescriptions = {
    BALANCED: '身体阴阳平衡，健康状态良好，气血调和，精力充沛。',
    QI_DEFICIENCY: '元气不足，易疲劳乏力，气短懒言，免疫力较弱。',
    YANG_DEFICIENCY: '阳气不足，畏寒怕冷，手脚冰凉，喜热饮。',
    YIN_DEFICIENCY: '阴液不足，口干咽燥，潮热盗汗，手足心热。',
    PHLEGM_DAMP: '痰湿内蕴，体型偏胖，腹部肥满，舌苔厚腻。',
    DAMP_HEAT: '湿热内蕴，易生痤疮，口苦口臭，大便黏腻。',
    BLOOD_STASIS: '血液瘀滞，易有瘀斑，面色晦暗，痛经血块。',
    QI_STAGNATION: '气机郁滞，情绪不畅，易焦虑抑郁，胸闷叹气。',
    SPECIAL_CONSTITUTION: '过敏体质，易过敏，对外界环境适应能力差。'
  }

  const constitutionAdvice = {
    BALANCED: '恭喜！您的体质平和，继续保持健康的生活方式即可。建议均衡饮食，规律作息，适度运动。',
    QI_DEFICIENCY: '建议多吃补气食物如黄芪、党参、红枣、山药等。避免过度劳累，适当进行温和运动。',
    YANG_DEFICIENCY: '建议多吃温热食物如羊肉、生姜、桂圆等。注意保暖，避免生冷食物。',
    YIN_DEFICIENCY: '建议多吃滋阴食物如银耳、百合、枸杞、梨等。避免辛辣刺激，保持充足睡眠。',
    PHLEGM_DAMP: '建议多吃健脾利湿食物如薏米、冬瓜、山药等。控制饮食，加强运动。',
    DAMP_HEAT: '建议多吃清热利湿食物如绿豆、苦瓜、冬瓜等。避免油腻辛辣，保持清淡饮食。',
    BLOOD_STASIS: '建议多吃活血化瘀食物如山楂、桃仁、红花等。适当运动，保持心情舒畅。',
    QI_STAGNATION: '建议多吃疏肝理气食物如陈皮、玫瑰花、佛手等。保持心情愉悦，适当户外活动。',
    SPECIAL_CONSTITUTION: '建议避免接触过敏原，饮食清淡，增强体质。必要时咨询专业医生。'
  }

  // 固定的选项数组 - 前端硬编码
  const questionOptions = [
    { letter: "A", text: "从不" },
    { letter: "B", text: "偶尔" },
    { letter: "C", text: "经常" },
    { letter: "D", text: "总是" }
  ]



  // 将问题分成 4 个步骤
  const steps = [
    { title: '基础状态', questions: [0, 1, 2] },
    { title: '身体特征', questions: [3, 4, 5] },
    { title: '情绪与敏感', questions: [6, 7] },
    { title: '整体状态', questions: [8, 9] },
  ]

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
  }

  const currentStepQuestions = steps[currentStep]?.questions || []
  const answeredInStep = currentStepQuestions.filter(idx => {
    const q = questions[idx]
    return q && answers[q.id] !== undefined
  }).length
  const totalInStep = currentStepQuestions.length
  const canProceed = answeredInStep === totalInStep

  const totalAnswered = questions.filter(q => answers[q.id] !== undefined).length
  const totalQuestions = questions.length
  const overallProgress = Math.round((totalAnswered / totalQuestions) * 100)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (totalAnswered !== totalQuestions) return
    setLoading(true)
    try {
      const res = await constitutionAPI.assess(answers)
      setAssessment(res.data)
      setShowResult(true)
      setHistory(prev => [res.data, ...prev])
      setHasExisting(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReAssess = () => {
    setAnswers({})
    setCurrentStep(0)
    setShowResult(false)
    setAssessment(null)
  }

  const handleHistoryClick = (item) => {
    setSelectedHistory(item)
  }

  const handleBackToLatest = () => {
    setSelectedHistory(null)
  }

  // ========== 结果页 ==========
  if (showResult && assessment) {
    const displayAssessment = selectedHistory || assessment
    const topTypes = Object.entries(displayAssessment.type_scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    return (
      <div className="constitution-result-page">
        {/* 结果头部 - 重新设计 */}
        <Card className="constitution-result-hero-card" styles={{ body: { padding: 0 } }}>
          <div className="constitution-result-hero">
            <div className="constitution-result-main">
              {selectedHistory && (
                <button
                  onClick={handleBackToLatest}
                  className="constitution-back-button"
                >
                  <ArrowLeftOutlined />
                  <span>返回最新评估</span>
                </button>
              )}
              <div className="constitution-result-icon">
                {constitutionIcons[displayAssessment.primary_type]}
              </div>
              <div className="constitution-result-copy">
                <Text className="constitution-result-kicker">您的主要体质为</Text>
                <Title level={1} className="constitution-result-title">
                  {constitutionNames[displayAssessment.primary_type]}
                </Title>
                <Text className="constitution-result-description">
                  {constitutionDescriptions[displayAssessment.primary_type]}
                </Text>
                <div className="constitution-result-date">
                  <CalendarOutlined />
                  <Text>
                    {new Date(displayAssessment.assessment_date).toLocaleDateString('zh-CN')}
                  </Text>
                </div>
              </div>
            </div>
            <div className="constitution-result-rank">
              <Text className="constitution-result-rank-title">体质倾向 Top 3</Text>
              {topTypes.map(([type, score], index) => (
                <div key={type} className="constitution-result-rank-item">
                  <span className="constitution-result-rank-index">{index + 1}</span>
                  <span className="constitution-result-rank-name">{constitutionNames[type]}</span>
                  <span className="constitution-result-rank-score">{Math.round(score * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 体质得分 - 重新设计 */}
        <Card 
          title={
            <div className="constitution-card-title">
              <TrophyOutlined />
              <span>体质分析</span>
            </div>
          } 
          className="constitution-result-card"
          styles={{ body: { padding: '1.5rem' } }}
        >
          <div className="constitution-score-list">
            {Object.entries(displayAssessment.type_scores)
              .sort((a, b) => b[1] - a[1])
              .map(([type, score], index) => {
                const isTop = index === 0
                const percentage = Math.round(score * 100)
                return (
                  <div key={type} className="constitution-score-item">
                    <div className="constitution-score-meta">
                      <div className="constitution-score-name-wrap">
                        {isTop && <span className="constitution-score-crown">🏆</span>}
                        <Text className={`constitution-score-name ${isTop ? 'is-top' : ''}`}>
                          {constitutionNames[type]}
                        </Text>
                      </div>
                      <Text className={`constitution-score-value ${isTop ? 'is-top' : ''}`}>
                        {percentage}%
                      </Text>
                    </div>
                    <Progress
                      percent={percentage}
                      showInfo={false}
                      strokeColor={isTop ? '#10b981' : '#d1d5db'}
                      trailColor="#f3f4f6"
                      size={['100%', 8]}
                    />
                  </div>
                )
              })}
          </div>
        </Card>

        {/* 养生建议 - 重新设计 */}
        <Card 
          title={
            <div className="constitution-card-title">
              <CheckCircleOutlined />
              <span>养生建议</span>
            </div>
          } 
          className="constitution-result-card"
          styles={{ body: { padding: '1.5rem' } }}
        >
          <div className="constitution-advice-box">
            <div className="constitution-advice-content">
              <div className="constitution-advice-icon">
                <HeartOutlined />
              </div>
              <Paragraph className="constitution-advice-text">
                {constitutionAdvice[displayAssessment.primary_type]}
              </Paragraph>
            </div>
          </div>
        </Card>

        {/* 历史记录 - 重新设计 */}
        <Card
          title={
            <div className="constitution-card-title">
              <HistoryOutlined />
              <span>评估历史</span>
            </div>
          }
          className="constitution-result-card"
          extra={
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={handleReAssess}
              className="constitution-history-action"
            >
              重新评估
            </Button>
          }
          styles={{ body: { padding: '1.25rem' } }}
        >
          {history.length > 0 ? (
            <div className="constitution-history-list">
              {history.map((item, index) => {
                const itemId = item.id || `${item.primary_type}-${item.assessment_date}-${index}`
                const isSelected = selectedHistory?.id === item.id || 
                  (selectedHistory && !item.id && selectedHistory.assessment_date === item.assessment_date)
                return (
                  <button
                    key={itemId}
                    onClick={() => handleHistoryClick(item)}
                    className={`constitution-history-item ${isSelected ? 'is-selected' : ''}`}
                  >
                    <div className="constitution-history-index">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="constitution-history-main">
                      <div className="constitution-history-topline">
                        <Tag color="green" className="constitution-history-tag">
                          {constitutionNames[item.primary_type]}
                        </Tag>
                        <Text className="constitution-history-date">
                          {new Date(item.assessment_date).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Text>
                      </div>
                      <Text className="constitution-history-summary">
                        {constitutionDescriptions[item.primary_type]}
                      </Text>
                    </div>
                    <div className="constitution-history-score">
                      {item.type_scores?.[item.primary_type] !== undefined && (
                        <span>{Math.round(item.type_scores[item.primary_type] * 100)}%</span>
                      )}
                      <ArrowRightOutlined />
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="constitution-history-empty">
              <HistoryOutlined />
              <Text>暂无评估历史</Text>
            </div>
          )}
        </Card>
      </div>
    )
  }

  // ========== 问卷页 ==========
  const stepDescriptions = [
    '了解您的疲劳、畏寒、口干等基本状态',
    '评估您的体型、皮肤、口苦等身体特征',
    '了解您的情绪状态和过敏情况',
    '评估您的整体精力与面色状态',
  ]

  return (
    <div className="constitution-page">
      <div className="constitution-shell">
        {/* 头部 */}
        <div className="constitution-hero">
          <div className="constitution-hero-icon">
            <HeartOutlined />
          </div>
          <Title level={2} className="constitution-hero-title">体质辨识</Title>
          <Text type="secondary" className="constitution-hero-subtitle">通过 10 道问题评估您的中医体质类型</Text>
          {hasExisting && (
            <div className="constitution-hero-action">
              <Button
                type="primary"
                ghost
                icon={<TrophyOutlined />}
                onClick={() => setShowResult(true)}
                className="constitution-result-button"
              >
                查看上次评估结果
              </Button>
            </div>
          )}
        </div>

      {/* 步骤条 */}
      <Card className="constitution-assessment-card" styles={{ body: { padding: '2rem 2.5rem' } }}>
        <Steps
          current={currentStep}
          items={steps.map((s, i) => ({
            title: s.title,
            description: i === currentStep ? stepDescriptions[i] : undefined,
            icon: i < currentStep ? <CheckCircleOutlined /> : undefined
          }))}
          size="small"
          style={{ marginBottom: '2rem' }}
        />

        {/* 进度 */}
        <div className="constitution-progress-block">
          <div className="constitution-progress-meta">
            <Text className="constitution-progress-text">
              第 {currentStep + 1}/{steps.length} 步
            </Text>
            <Text className="constitution-progress-text">
              已答 {totalAnswered}/{totalQuestions} 题
            </Text>
          </div>
          <Progress
            percent={overallProgress}
            showInfo={false}
            strokeColor={{ '0%': '#10b981', '100%': '#34d399' }}
            trailColor="#f3f4f6"
            size={['100%', 6]}
          />
          </div>

        <Divider style={{ margin: '0 0 2rem' }} />

        {/* 当前步骤的问题 */}
        <div className="constitution-question-list">
          {currentStepQuestions.map((qIdx) => {
            const q = questions[qIdx]
            if (!q) return null
            const isAnswered = answers[q.id] !== undefined
            const selectedValue = answers[q.id]
            return (
              <div key={q.id} className="constitution-question-item">
                {/* 序号 + 问题文字 - 垂直居中对齐 */}
                <div className="constitution-question-header">
                  <div
                    className={`constitution-question-number ${isAnswered ? 'is-answered' : ''}`}
                  >
                    {String(qIdx + 1).padStart(2, '0')}
                  </div>
                  <Text className="constitution-question-title">
                    {q.question}
                  </Text>
                  {isAnswered && <CheckCircleOutlined className="constitution-question-status" />}
                </div>

                {/* 分隔线 */}
                <Divider style={{ margin: '0.5rem 0' }} />

                {/* 选项按钮 - 单列纵向 */}
                <div className="constitution-answer-list">
                  {questionOptions.map((option, optIdx) => {
                    const selected = selectedValue === optIdx
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => handleAnswer(q.id, optIdx)}
                        className={`constitution-answer-option ${selected ? 'is-selected' : ''}`}
                      >
                        <span
                          className="constitution-answer-letter"
                        >
                          {option.letter}
                        </span>
                        <span className="constitution-answer-text">{option.text}</span>
                        {selected && <CheckCircleOutlined className="constitution-answer-check" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <Divider style={{ margin: '2rem 0' }} />

        {/* 底部导航 */}
        <div className="constitution-nav">
          <Button
            size="large"
            disabled={currentStep === 0}
            onClick={handlePrev}
            icon={<ArrowLeftOutlined />}
            className="constitution-nav-button"
          >
            上一步
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              type="primary"
              size="large"
              disabled={!canProceed}
              onClick={handleNext}
              className="constitution-nav-button constitution-nav-primary"
            >
              下一步 <ArrowRightOutlined />
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              disabled={totalAnswered !== totalQuestions}
              loading={loading}
              onClick={handleSubmit}
              className="constitution-nav-button constitution-nav-primary"
            >
              提交评估
            </Button>
          )}
        </div>
      </Card>
      </div>
    </div>
  )
}

export default Constitution
