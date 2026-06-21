import { useState, useEffect } from 'react'
import { Card, Typography, Input, Select, Tag, Empty, Row, Col, Button, Divider, Spin, message } from 'antd'
import { SearchOutlined, FilterOutlined, ClockCircleOutlined, FireOutlined, BookOutlined, ArrowLeftOutlined, CheckCircleOutlined, HeartOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons'
import { recipeAPI } from '../services/api'

const { Title, Text, Paragraph } = Typography

const CONSTITUTION_NAMES = {
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

// 示例食谱数据
const SAMPLE_RECIPES = [
  {
    id: 1,
    name: '山药枸杞粥',
    description: '健脾养胃，滋阴补肾，适合气虚体质人群',
    difficulty: 1,
    calories: 180,
    taste_tags: ['清淡', '香甜'],
    ingredients: [
      { name: '山药', quantity: '100g' },
      { name: '枸杞', quantity: '15g' },
      { name: '大米', quantity: '80g' },
      { name: '冰糖', quantity: '适量' }
    ],
    steps: [
      '山药去皮切块，枸杞洗净备用',
      '大米淘洗干净，加入适量清水',
      '大火烧开后转小火煮30分钟',
      '加入山药块继续煮15分钟',
      '最后加入枸杞和冰糖煮5分钟即可'
    ],
    suitable_constitutions: ['QI_DEFICIENCY', 'YIN_DEFICIENCY', 'BALANCED']
  },
  {
    id: 2,
    name: '红枣桂圆茶',
    description: '补气养血，暖宫驱寒，适合阳虚体质',
    difficulty: 1,
    calories: 120,
    taste_tags: ['香甜', '温暖'],
    ingredients: [
      { name: '红枣', quantity: '6颗' },
      { name: '桂圆', quantity: '10颗' },
      { name: '红糖', quantity: '适量' },
      { name: '清水', quantity: '500ml' }
    ],
    steps: [
      '红枣去核切片，桂圆剥壳',
      '将红枣和桂圆放入锅中',
      '加入清水，大火煮开',
      '转小火煮15分钟',
      '加入红糖调味即可饮用'
    ],
    suitable_constitutions: ['YANG_DEFICIENCY', 'BALANCED']
  },
  {
    id: 3,
    name: '薏米红豆汤',
    description: '健脾利湿，清热排毒，适合痰湿体质',
    difficulty: 2,
    calories: 150,
    taste_tags: ['清淡', '软糯'],
    ingredients: [
      { name: '薏米', quantity: '50g' },
      { name: '红豆', quantity: '50g' },
      { name: '冰糖', quantity: '适量' }
    ],
    steps: [
      '薏米和红豆提前浸泡4小时',
      '将浸泡好的食材放入锅中',
      '加入适量清水，大火煮开',
      '转小火煮至软糯（约1小时）',
      '加入冰糖调味即可'
    ],
    suitable_constitutions: ['PHLEGM_DAMP', 'DAMP_HEAT']
  },
  {
    id: 4,
    name: '银耳百合羹',
    description: '滋阴润肺，养颜美容，适合阴虚体质',
    difficulty: 2,
    calories: 130,
    taste_tags: ['清甜', '清爽'],
    ingredients: [
      { name: '银耳', quantity: '20g' },
      { name: '百合', quantity: '30g' },
      { name: '莲子', quantity: '20g' },
      { name: '冰糖', quantity: '适量' }
    ],
    steps: [
      '银耳提前泡发撕成小朵',
      '百合、莲子洗净备用',
      '锅中加水，放入银耳煮30分钟',
      '加入百合和莲子继续煮20分钟',
      '加入冰糖调味即可'
    ],
    suitable_constitutions: ['YIN_DEFICIENCY', 'BALANCED']
  },
  {
    id: 5,
    name: '菊花决明子茶',
    description: '清肝明目，清热泻火，适合湿热体质',
    difficulty: 1,
    calories: 30,
    taste_tags: ['清淡', '清香'],
    ingredients: [
      { name: '菊花', quantity: '10g' },
      { name: '决明子', quantity: '10g' },
      { name: '枸杞', quantity: '5g' },
      { name: '热水', quantity: '300ml' }
    ],
    steps: [
      '将菊花、决明子、枸杞洗净',
      '放入杯中，用热水冲泡',
      '焖5分钟即可饮用',
      '可反复冲泡至味淡'
    ],
    suitable_constitutions: ['DAMP_HEAT', 'YIN_DEFICIENCY']
  },
  {
    id: 6,
    name: '当归羊肉汤',
    description: '温补气血，活血化瘀，适合血瘀体质',
    difficulty: 3,
    calories: 280,
    taste_tags: ['浓郁', '温暖'],
    ingredients: [
      { name: '羊肉', quantity: '300g' },
      { name: '当归', quantity: '10g' },
      { name: '生姜', quantity: '3片' },
      { name: '枸杞', quantity: '10g' },
      { name: '料酒', quantity: '适量' }
    ],
    steps: [
      '羊肉切块，冷水下锅焯水去腥',
      '当归、枸杞洗净，生姜切片',
      '锅中加水，放入羊肉和姜片',
      '加入料酒，大火煮开后转小火',
      '炖1小时后加入当归和枸杞，再炖30分钟'
    ],
    suitable_constitutions: ['BLOOD_STASIS', 'YANG_DEFICIENCY']
  },
  {
    id: 7,
    name: '玫瑰花茶',
    description: '疏肝解郁，理气活血，适合气郁体质',
    difficulty: 1,
    calories: 25,
    taste_tags: ['清香', '香甜'],
    ingredients: [
      { name: '干玫瑰花', quantity: '5朵' },
      { name: '蜂蜜', quantity: '适量' },
      { name: '热水', quantity: '250ml' }
    ],
    steps: [
      '取干玫瑰花放入杯中',
      '用80°C热水冲泡',
      '焖3分钟后加入蜂蜜调味',
      '趁热饮用效果更佳'
    ],
    suitable_constitutions: ['QI_STAGNATION', 'BALANCED']
  },
  {
    id: 8,
    name: '绿豆百合粥',
    description: '清热解毒，利尿消肿，适合湿热体质',
    difficulty: 2,
    calories: 160,
    taste_tags: ['清淡', '清爽'],
    ingredients: [
      { name: '绿豆', quantity: '50g' },
      { name: '百合', quantity: '30g' },
      { name: '大米', quantity: '50g' },
      { name: '冰糖', quantity: '适量' }
    ],
    steps: [
      '绿豆提前浸泡2小时',
      '大米淘洗干净，百合洗净',
      '锅中加水，放入绿豆和大米',
      '大火煮开后转小火煮40分钟',
      '加入百合煮10分钟，加冰糖调味'
    ],
    suitable_constitutions: ['DAMP_HEAT', 'YIN_DEFICIENCY']
  },
  {
    id: 9,
    name: '核桃黑芝麻糊',
    description: '补肾益精，乌发养颜，适合肾虚人群',
    difficulty: 2,
    calories: 200,
    taste_tags: ['香醇', '香甜'],
    ingredients: [
      { name: '核桃', quantity: '30g' },
      { name: '黑芝麻', quantity: '30g' },
      { name: '糯米', quantity: '20g' },
      { name: '冰糖', quantity: '适量' }
    ],
    steps: [
      '核桃掰碎，黑芝麻炒香',
      '糯米提前浸泡1小时',
      '将核桃、黑芝麻、糯米放入豆浆机',
      '加入适量清水，选择米糊模式',
      '完成后加冰糖调味'
    ],
    suitable_constitutions: ['QI_DEFICIENCY', 'BALANCED']
  },
  {
    id: 10,
    name: '陈皮普洱茶',
    description: '理气化痰，消食解腻，适合痰湿体质',
    difficulty: 1,
    calories: 35,
    taste_tags: ['醇厚', '温暖'],
    ingredients: [
      { name: '陈皮', quantity: '5g' },
      { name: '普洱茶', quantity: '5g' },
      { name: '热水', quantity: '300ml' }
    ],
    steps: [
      '陈皮洗净切丝',
      '将陈皮和普洱茶放入茶壶',
      '用95°C热水洗茶一次',
      '再次注水，浸泡1分钟',
      '倒入杯中饮用，可反复冲泡'
    ],
    suitable_constitutions: ['PHLEGM_DAMP', 'BALANCED']
  },
  {
    id: 11,
    name: '莲子芡实粥',
    description: '健脾固肾，宁心安神，适合脾肾两虚',
    difficulty: 2,
    calories: 170,
    taste_tags: ['清淡', '软糯'],
    ingredients: [
      { name: '莲子', quantity: '30g' },
      { name: '芡实', quantity: '30g' },
      { name: '大米', quantity: '60g' },
      { name: '冰糖', quantity: '适量' }
    ],
    steps: [
      '莲子、芡实提前浸泡2小时',
      '大米淘洗干净',
      '将所有食材放入锅中',
      '加水大火煮开后转小火煮40分钟',
      '加入冰糖调味即可'
    ],
    suitable_constitutions: ['QI_DEFICIENCY', 'BALANCED']
  },
  {
    id: 12,
    name: '黄芪红枣茶',
    description: '补气固表，增强免疫，适合气虚体质',
    difficulty: 1,
    calories: 90,
    taste_tags: ['香甜', '温暖'],
    ingredients: [
      { name: '黄芪', quantity: '10g' },
      { name: '红枣', quantity: '5颗' },
      { name: '枸杞', quantity: '5g' },
      { name: '热水', quantity: '400ml' }
    ],
    steps: [
      '黄芪、红枣、枸杞洗净',
      '红枣去核切片',
      '将所有材料放入杯中',
      '用热水冲泡，焖10分钟',
      '代茶饮用，每日1-2杯'
    ],
    suitable_constitutions: ['QI_DEFICIENCY', 'BALANCED']
  }
]

function Recipes() {
  const [recipes, setRecipes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showFilter, setShowFilter] = useState(false)
  const [filterDifficulty, setFilterDifficulty] = useState(5)
  const [filterTaste, setFilterTaste] = useState('')
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true)
      try {
        const res = await recipeAPI.recommend({})
        const apiData = res.data || []
        // 如果API数据为空，使用示例数据
        setRecipes(apiData.length > 0 ? apiData : SAMPLE_RECIPES)
        setFilteredRecipes(apiData.length > 0 ? apiData : SAMPLE_RECIPES)
      } catch (err) {
        console.error(err)
        // 出错时也使用示例数据
        setRecipes(SAMPLE_RECIPES)
        setFilteredRecipes(SAMPLE_RECIPES)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [])

  useEffect(() => {
    let result = recipes
    if (searchTerm) {
      result = result.filter(r =>
        r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (filterDifficulty < 5) {
      result = result.filter(r => r.difficulty <= filterDifficulty)
    }
    if (filterTaste) {
      result = result.filter(r => r.taste_tags?.includes(filterTaste))
    }
    setFilteredRecipes(result)
  }, [searchTerm, filterDifficulty, filterTaste, recipes])

  const toggleFavorite = (recipeId, e) => {
    e?.stopPropagation()
    setFavorites(prev => {
      const isFav = prev.includes(recipeId)
      if (isFav) {
        message.success('已取消收藏')
      } else {
        message.success('已添加到收藏')
      }
      return isFav 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterDifficulty(5)
    setFilterTaste('')
    message.success('已清除所有筛选条件')
  }

  const tasteTags = ['清淡', '香甜', '鲜美', '浓郁', '清爽', '酸辣', '软糯', '香醇', '清甜', '温暖']

  if (selectedRecipe) {
    const isFavorite = favorites.includes(selectedRecipe.id)
    return (
      <div className="recipes-detail-page">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => setSelectedRecipe(null)}
          className="recipes-back-button"
        >
          返回食谱列表
        </Button>

        <Card className="recipes-detail-card shadow-md overflow-hidden" styles={{ body: { padding: 0 } }}>
          <div
            className="recipes-detail-header"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <div className="recipes-detail-icon">
              <BookOutlined />
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Title level={2} className="mb-1">{selectedRecipe.name}</Title>
                <Paragraph type="secondary" className="mb-0">{selectedRecipe.description}</Paragraph>
              </div>
              <Button
                type={isFavorite ? 'primary' : 'default'}
                shape="circle"
                icon={<HeartOutlined style={{ color: isFavorite ? '#fff' : '#f5222d' }} />}
                onClick={(e) => toggleFavorite(selectedRecipe.id, e)}
                className={`recipes-favorite-btn ${isFavorite ? 'is-favorited' : ''}`}
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Tag color="gold" icon={<ClockCircleOutlined />}>难度 {selectedRecipe.difficulty}</Tag>
              {selectedRecipe.calories && <Tag color="orange" icon={<FireOutlined />}>{selectedRecipe.calories} kcal</Tag>}
              {selectedRecipe.taste_tags && selectedRecipe.taste_tags.map((tag) => (
                <Tag key={tag} color="green">{tag}</Tag>
              ))}
            </div>

            <Divider />

            <div className="mb-6">
              <Title level={4} className="mb-3 recipes-section-title">
                <span className="recipes-section-icon">🥗</span>
                食材清单
              </Title>
              <ul className="recipes-ingredient-list">
                {selectedRecipe.ingredients?.map((ingredient, index) => (
                  <li key={index} className="recipes-ingredient-item">
                    <CheckCircleOutlined className="recipes-ingredient-check" />
                    <Text className="recipes-ingredient-name">{ingredient.name}</Text>
                    <Text type="secondary" className="recipes-ingredient-quantity">{ingredient.quantity}</Text>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Title level={4} className="mb-3 recipes-section-title">
                <span className="recipes-section-icon">👨‍🍳</span>
                做法步骤
              </Title>
              <ol className="recipes-step-list">
                {selectedRecipe.steps?.map((step, index) => (
                  <li key={index} className="recipes-step-item">
                    <span className="recipes-step-number">{index + 1}</span>
                    <Text className="recipes-step-text">{step}</Text>
                  </li>
                ))}
              </ol>
            </div>

            {selectedRecipe.suitable_constitutions && selectedRecipe.suitable_constitutions.length > 0 && (
              <>
                <Divider />
                <div className="recipes-constitution-box">
                  <Title level={5} className="mb-3 recipes-section-title">
                    <span className="recipes-section-icon">👥</span>
                    适合人群
                  </Title>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.suitable_constitutions.map((c) => (
                      <Tag key={c} color="cyan" className="recipes-constitution-tag">
                        {CONSTITUTION_NAMES[c] || c}
                      </Tag>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="recipes-page">
      {/* 页面头部 */}
      <div className="recipes-hero">
        <div className="recipes-hero-content">
          <div className="recipes-hero-icon">
            <BookOutlined />
          </div>
          <div className="recipes-hero-text">
            <Title level={2} className="recipes-hero-title">食谱推荐</Title>
            <Text className="recipes-hero-subtitle">精选养生食谱，助力健康生活</Text>
          </div>
        </div>
      </div>

      <div className="recipes-container">
        {/* 搜索和筛选 */}
        <Card className="recipes-search-card shadow-md" styles={{ body: { padding: '1.25rem' } }}>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="搜索食谱名称或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
              className="flex-1"
              allowClear
            />
            <Button
              size="large"
              icon={<FilterOutlined />}
              onClick={() => setShowFilter(!showFilter)}
              className={`recipes-filter-btn ${showFilter ? 'is-active' : ''}`}
            >
              筛选
            </Button>
          </div>

          <div className={`recipes-filter-panel ${showFilter ? 'is-open' : ''}`}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={8}>
                <div className="mb-2"><Text strong>难度等级</Text></div>
                <Select
                  value={filterDifficulty}
                  onChange={setFilterDifficulty}
                  className="w-full"
                  size="large"
                  options={[
                    { value: 1, label: '⭐ 简单' },
                    { value: 2, label: '⭐⭐ 较简单' },
                    { value: 3, label: '⭐⭐⭐ 中等' },
                    { value: 4, label: '⭐⭐⭐⭐ 较难' },
                    { value: 5, label: '全部难度' }
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="mb-2"><Text strong>口味偏好</Text></div>
                <Select
                  value={filterTaste}
                  onChange={setFilterTaste}
                  className="w-full"
                  size="large"
                  allowClear
                  placeholder="全部口味"
                  options={tasteTags.map(t => ({ value: t, label: t }))}
                />
              </Col>
              <Col xs={24} md={8}>
                <Button
                  type="link"
                  onClick={clearFilters}
                  className="recipes-clear-btn"
                  disabled={!searchTerm && filterDifficulty === 5 && !filterTaste}
                >
                  清除筛选条件
                </Button>
              </Col>
            </Row>
          </div>
        </Card>

        {/* 加载状态 */}
        {loading ? (
          <div className="recipes-loading">
            <Spin size="large" />
            <Text className="mt-4">正在加载食谱...</Text>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <Card className="shadow-md recipes-empty-card">
            <Empty 
              description={
                <div className="recipes-empty-text">
                  <Text>暂无符合条件的食谱</Text>
                  <br />
                  <Button type="link" onClick={clearFilters}>清除筛选条件</Button>
                </div>
              }
            />
          </Card>
        ) : (
          <>
            <div className="recipes-count">
              <Text type="secondary">共找到 <Text strong>{filteredRecipes.length}</Text> 个食谱</Text>
            </div>
            <Row gutter={[20, 20]}>
              {filteredRecipes.map((recipe) => {
                const isFavorite = favorites.includes(recipe.id)
                return (
                  <Col xs={24} sm={12} lg={8} key={recipe.id}>
                    <Card
                      hoverable
                      className={`recipes-card h-full ${isFavorite ? 'is-favorite' : ''}`}
                      styles={{ body: { padding: 0 } }}
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <div className="recipes-card-image">
                        <div
                          className="recipes-card-bg"
                          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                        >
                          <BookOutlined className="recipes-card-icon" />
                        </div>
                        <Button
                          shape="circle"
                          icon={<HeartOutlined style={{ color: isFavorite ? '#fff' : '#f5222d' }} />}
                          onClick={(e) => toggleFavorite(recipe.id, e)}
                          className={`recipes-card-favorite ${isFavorite ? 'is-favorited' : ''}`}
                        />
                      </div>
                      <div className="recipes-card-content">
                        <Title level={4} className="recipes-card-title">{recipe.name}</Title>
                        <Paragraph type="secondary" ellipsis={{ rows: 2 }} className="recipes-card-desc">
                          {recipe.description}
                        </Paragraph>
                        <div className="recipes-card-tags">
                          <Tag color="gold" icon={<ClockCircleOutlined />} className="recipes-card-tag">
                            难度 {recipe.difficulty}
                          </Tag>
                          {recipe.calories && (
                            <Tag color="orange" icon={<FireOutlined />} className="recipes-card-tag">
                              {recipe.calories} kcal
                            </Tag>
                          )}
                          {recipe.taste_tags?.[0] && (
                            <Tag color="green" className="recipes-card-tag">
                              {recipe.taste_tags[0]}
                            </Tag>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          </>
        )}
      </div>
    </div>
  )
}

export default Recipes