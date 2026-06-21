import { useState, useEffect } from 'react'
import { Card, Typography, Button, Form, Input, InputNumber, Row, Col, Statistic, Tag, Empty, message } from 'antd'
import { RiseOutlined, MoonOutlined, ThunderboltOutlined, HeartOutlined, PlusOutlined, CalendarOutlined } from '@ant-design/icons'
import { healthAPI } from '../services/api'

const { Title, Text } = Typography

function Health() {
  const [records, setRecords] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsRes, statsRes] = await Promise.all([
          healthAPI.getRecords().catch(() => ({ data: [] })),
          healthAPI.getStatistics().catch(() => ({ data: null }))
        ])
        setRecords(recordsRes.data || [])
        setStatistics(statsRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const data = {
        weight: values.weight ?? null,
        blood_pressure_systolic: values.blood_pressure_systolic ?? null,
        blood_pressure_diastolic: values.blood_pressure_diastolic ?? null,
        sleep_hours: values.sleep_hours ?? null,
        energy_level: values.energy_level ?? null,
        mood_level: values.mood_level ?? null,
        exercise_minutes: values.exercise_minutes ?? null,
        notes: values.notes ?? ''
      }
      await healthAPI.createRecord(data)
      message.success('记录已保存')
      setShowForm(false)
      form.resetFields()

      const [recordsRes, statsRes] = await Promise.all([
        healthAPI.getRecords().catch(() => ({ data: [] })),
        healthAPI.getStatistics().catch(() => ({ data: null }))
      ])
      setRecords(recordsRes.data || [])
      setStatistics(statsRes.data)
    } catch (err) {
      message.error(err.response?.data?.detail || '保存失败')
    } finally {
      setLoading(false)
    }
  }

  const chartData = records
    .slice(0, 7)
    .reverse()

  const maxWeight = Math.max(1, ...chartData.map(r => r.weight || 0))
  const maxSleep = Math.max(8, ...chartData.map(r => r.sleep_hours || 0))
  const maxEnergy = 5

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card className="shadow-md border-0">
            <Statistic
              title="平均体重"
              value={statistics?.average_weight}
              suffix="kg"
              prefix={<RiseOutlined className="text-blue-500 mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="shadow-md border-0">
            <Statistic
              title="平均睡眠"
              value={statistics?.average_sleep}
              suffix="h"
              prefix={<MoonOutlined className="text-purple-500 mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="shadow-md border-0">
            <Statistic
              title="平均精力"
              value={statistics?.average_energy}
              suffix="/5"
              prefix={<ThunderboltOutlined className="text-yellow-500 mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="shadow-md border-0">
            <Statistic
              title="记录总数"
              value={statistics?.total_records}
              prefix={<HeartOutlined className="text-green-500 mr-2" />}
            />
          </Card>
        </Col>
      </Row>

      {/* 添加记录按钮 */}
      <Button
        type="primary"
        size="large"
        block
        icon={<PlusOutlined />}
        onClick={() => setShowForm(!showForm)}
        className="h-12 bg-gradient-to-r from-green-500 to-emerald-600 border-0"
      >
        记录今日健康数据
      </Button>

      {/* 录入表单 */}
      {showForm && (
        <Card title="健康数据记录" className="shadow-md">
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="体重 (kg)" name="weight">
                  <InputNumber min={0} max={300} step={0.1} className="w-full" placeholder="如：65.5" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="收缩压" name="blood_pressure_systolic">
                  <InputNumber min={0} max={300} className="w-full" placeholder="如：120" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="舒张压" name="blood_pressure_diastolic">
                  <InputNumber min={0} max={200} className="w-full" placeholder="如：80" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="睡眠时长 (小时)" name="sleep_hours">
                  <InputNumber min={0} max={24} step={0.5} className="w-full" placeholder="如：7.5" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="精力水平 (1-5)" name="energy_level">
                  <InputNumber min={1} max={5} className="w-full" placeholder="1-5" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="情绪状态 (1-5)" name="mood_level">
                  <InputNumber min={1} max={5} className="w-full" placeholder="1-5" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="运动时长 (分钟)" name="exercise_minutes">
                  <InputNumber min={0} max={1440} className="w-full" placeholder="如：30" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="备注" name="notes">
                  <Input.TextArea rows={2} placeholder="记录今天的感受..." />
                </Form.Item>
              </Col>
            </Row>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowForm(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={loading} className="bg-green-500 hover:!bg-green-600 border-green-500">
                保存记录
              </Button>
            </div>
          </Form>
        </Card>
      )}

      {/* 健康趋势图 */}
      {chartData.length > 0 && (
        <Card title="最近健康数据趋势" className="shadow-md">
          <div className="space-y-6">
            {/* 体重 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Text strong className="text-sm text-gray-600">体重 (kg)</Text>
                <Text type="secondary" className="text-xs">最高 {maxWeight}kg</Text>
              </div>
              <div className="flex items-end gap-2 h-32">
                {chartData.map((r, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-blue-100 rounded-t relative group"
                      style={{ height: `${((r.weight || 0) / maxWeight) * 100}%`, minHeight: '4px' }}
                    >
                      {r.weight && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {r.weight}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(r.record_date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 睡眠 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Text strong className="text-sm text-gray-600">睡眠 (小时)</Text>
                <Text type="secondary" className="text-xs">参考 8h</Text>
              </div>
              <div className="flex items-end gap-2 h-32">
                {chartData.map((r, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-purple-100 rounded-t relative group"
                      style={{ height: `${((r.sleep_hours || 0) / maxSleep) * 100}%`, minHeight: '4px' }}
                    >
                      {r.sleep_hours && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {r.sleep_hours}h
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(r.record_date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 精力 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Text strong className="text-sm text-gray-600">精力 (1-5)</Text>
                <Text type="secondary" className="text-xs">满分 5</Text>
              </div>
              <div className="flex items-end gap-2 h-32">
                {chartData.map((r, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-yellow-100 rounded-t relative group"
                      style={{ height: `${((r.energy_level || 0) / maxEnergy) * 100}%`, minHeight: '4px' }}
                    >
                      {r.energy_level && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {r.energy_level}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(r.record_date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 历史记录 */}
      <Card title={<><CalendarOutlined className="mr-2" />记录历史</>} className="shadow-md">
        {records.length === 0 ? (
          <Empty description="暂无记录" />
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <CalendarOutlined className="text-gray-400" />
                  <Text>{new Date(record.record_date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {record.weight && <Tag color="blue">{record.weight}kg</Tag>}
                  {record.sleep_hours && <Tag color="purple">{record.sleep_hours}h</Tag>}
                  {record.energy_level && <Tag color="gold">精力 {record.energy_level}</Tag>}
                  {record.mood_level && <Tag color="green">心情 {record.mood_level}</Tag>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default Health