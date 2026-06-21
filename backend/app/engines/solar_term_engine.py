from typing import List, Optional
from datetime import date, datetime
from sqlalchemy.orm import Session
from uuid import uuid4

from app.models.solar_term import SolarTerm

SOLAR_TERMS_DATA = [
    {"name": "立春", "name_en": "Beginning of Spring", "climate": "气温回升，天气多变", "common_diseases": ["感冒", "呼吸道疾病"], "recommended_foods": ["韭菜", "菠菜", "生姜", "红枣"], "forbidden_foods": ["生冷食物", "油腻食物"], "exercises": ["散步", "太极拳", "八段锦"]},
    {"name": "雨水", "name_en": "Rain Water", "climate": "降雨增多，湿度增大", "common_diseases": ["关节痛", "湿疹"], "recommended_foods": ["薏米", "山药", "冬瓜", "鲫鱼"], "forbidden_foods": ["辛辣食物", "生冷食物"], "exercises": ["慢跑", "瑜伽", "五禽戏"]},
    {"name": "惊蛰", "name_en": "Awakening of Insects", "climate": "春雷初响，万物复苏", "common_diseases": ["肝炎", "过敏"], "recommended_foods": ["芹菜", "荠菜", "枸杞", "蜂蜜"], "forbidden_foods": ["辛辣食物", "油炸食物"], "exercises": ["放风筝", "踏青", "深呼吸"]},
    {"name": "春分", "name_en": "Spring Equinox", "climate": "昼夜平分，气候温和", "common_diseases": ["流感", "花粉症"], "recommended_foods": ["香椿", "豆芽", "百合", "银耳"], "forbidden_foods": ["过酸食物", "过咸食物"], "exercises": ["春游", "划船", "羽毛球"]},
    {"name": "清明", "name_en": "Clear and Bright", "climate": "天气晴朗，草木繁茂", "common_diseases": ["高血压", "中风"], "recommended_foods": ["荠菜", "螺蛳", "枇杷", "草莓"], "forbidden_foods": ["热性食物", "油腻食物"], "exercises": ["扫墓踏青", "植树", "太极拳"]},
    {"name": "谷雨", "name_en": "Grain Rain", "climate": "降雨增多，谷物生长", "common_diseases": ["皮肤病", "关节炎"], "recommended_foods": ["香椿", "菠菜", "山药", "莲子"], "forbidden_foods": ["生冷食物", "刺激性食物"], "exercises": ["采茶", "钓鱼", "散步"]},
    {"name": "立夏", "name_en": "Beginning of Summer", "climate": "气温升高，雷雨增多", "common_diseases": ["中暑", "肠胃炎"], "recommended_foods": ["绿豆", "黄瓜", "苦瓜", "番茄"], "forbidden_foods": ["辛辣食物", "温热食物"], "exercises": ["游泳", "午睡", "八段锦"]},
    {"name": "小满", "name_en": "Grain Buds", "climate": "麦类作物饱满，雨水充沛", "common_diseases": ["皮肤病", "湿疹"], "recommended_foods": ["薏米", "赤小豆", "冬瓜", "鸭肉"], "forbidden_foods": ["油腻食物", "生冷食物"], "exercises": ["慢跑", "瑜伽", "散步"]},
    {"name": "芒种", "name_en": "Grain in Ear", "climate": "麦类成熟，气温升高", "common_diseases": ["中暑", "心血管疾病"], "recommended_foods": ["西瓜", "甜瓜", "绿豆汤", "荷叶"], "forbidden_foods": ["辛辣食物", "燥热食物"], "exercises": ["晨练", "游泳", "太极拳"]},
    {"name": "夏至", "name_en": "Summer Solstice", "climate": "白天最长，炎热开始", "common_diseases": ["中暑", "腹泻"], "recommended_foods": ["苦瓜", "丝瓜", "番茄", "莲子"], "forbidden_foods": ["热性食物", "油腻食物"], "exercises": ["清晨运动", "游泳", "冥想"]},
    {"name": "小暑", "name_en": "Minor Heat", "climate": "天气炎热，湿度增大", "common_diseases": ["中暑", "肠胃病"], "recommended_foods": ["绿豆", "荷叶", "西瓜", "黄瓜"], "forbidden_foods": ["辛辣食物", "生冷食物"], "exercises": ["早晚散步", "游泳", "气功"]},
    {"name": "大暑", "name_en": "Major Heat", "climate": "一年中最热时期", "common_diseases": ["中暑", "心脑血管疾病"], "recommended_foods": ["冬瓜", "苦瓜", "绿豆", "百合"], "forbidden_foods": ["温热食物", "油腻食物"], "exercises": ["室内运动", "游泳", "静心"]},
    {"name": "立秋", "name_en": "Beginning of Autumn", "climate": "气温开始下降，暑气未消", "common_diseases": ["秋燥", "感冒"], "recommended_foods": ["梨", "银耳", "蜂蜜", "芝麻"], "forbidden_foods": ["辛辣食物", "生冷食物"], "exercises": ["登山", "慢跑", "八段锦"]},
    {"name": "处暑", "name_en": "End of Heat", "climate": "炎热结束，气温下降", "common_diseases": ["呼吸道疾病", "秋燥"], "recommended_foods": ["百合", "杏仁", "沙参", "麦冬"], "forbidden_foods": ["燥热食物", "油腻食物"], "exercises": ["散步", "太极拳", "深呼吸"]},
    {"name": "白露", "name_en": "White Dew", "climate": "天气转凉，露水增多", "common_diseases": ["感冒", "支气管炎"], "recommended_foods": ["梨", "百合", "蜂蜜", "山药"], "forbidden_foods": ["生冷食物", "辛辣食物"], "exercises": ["晨练", "钓鱼", "太极"]},
    {"name": "秋分", "name_en": "Autumn Equinox", "climate": "昼夜平分，气候凉爽", "common_diseases": ["高血压", "关节炎"], "recommended_foods": ["芝麻", "核桃", "银耳", "糯米"], "forbidden_foods": ["过寒食物", "过燥食物"], "exercises": ["秋游", "登山", "羽毛球"]},
    {"name": "寒露", "name_en": "Cold Dew", "climate": "气温下降，露水变凉", "common_diseases": ["感冒", "心脑血管疾病"], "recommended_foods": ["红枣", "桂圆", "山药", "牛肉"], "forbidden_foods": ["生冷食物", "寒凉食物"], "exercises": ["慢跑", "散步", "五禽戏"]},
    {"name": "霜降", "name_en": "Frost's Descent", "climate": "开始降霜，天气寒冷", "common_diseases": ["呼吸道疾病", "关节炎"], "recommended_foods": ["柿子", "栗子", "萝卜", "羊肉"], "forbidden_foods": ["生冷食物", "油腻食物"], "exercises": ["晨练", "太极拳", "保暖"]},
    {"name": "立冬", "name_en": "Beginning of Winter", "climate": "冬季开始，气温骤降", "common_diseases": ["感冒", "心血管疾病"], "recommended_foods": ["羊肉", "狗肉", "生姜", "红枣"], "forbidden_foods": ["生冷食物", "寒凉食物"], "exercises": ["晨练", "冬泳", "气功"]},
    {"name": "小雪", "name_en": "Minor Snow", "climate": "开始下雪，天气寒冷", "common_diseases": ["感冒", "呼吸道疾病"], "recommended_foods": ["当归", "生姜", "羊肉", "核桃"], "forbidden_foods": ["生冷食物", "油腻食物"], "exercises": ["室内运动", "太极拳", "保暖"]},
    {"name": "大雪", "name_en": "Major Snow", "climate": "降雪增多，天气严寒", "common_diseases": ["心脑血管疾病", "关节炎"], "recommended_foods": ["狗肉", "羊肉", "桂圆", "红枣"], "forbidden_foods": ["寒凉食物", "生冷食物"], "exercises": ["晨练", "滑雪", "气功"]},
    {"name": "冬至", "name_en": "Winter Solstice", "climate": "白天最短，开始数九", "common_diseases": ["感冒", "中风"], "recommended_foods": ["饺子", "羊肉汤", "当归", "生姜"], "forbidden_foods": ["生冷食物", "寒凉食物"], "exercises": ["室内运动", "太极拳", "泡脚"]},
    {"name": "小寒", "name_en": "Minor Cold", "climate": "天气寒冷，接近最冷", "common_diseases": ["感冒", "心脑血管疾病"], "recommended_foods": ["羊肉", "狗肉", "核桃", "栗子"], "forbidden_foods": ["生冷食物", "寒凉食物"], "exercises": ["晨练", "保暖", "气功"]},
    {"name": "大寒", "name_en": "Major Cold", "climate": "一年中最冷时期", "common_diseases": ["感冒", "关节炎"], "recommended_foods": ["羊肉", "狗肉", "红枣", "桂圆"], "forbidden_foods": ["生冷食物", "寒凉食物"], "exercises": ["室内运动", "太极拳", "养生"]}
]

def get_solar_term_dates(year: int) -> List[dict]:
    terms = []
    base_dates = [
        (2, 4), (2, 19), (3, 6), (3, 21), (4, 5), (4, 20),
        (5, 6), (5, 21), (6, 6), (6, 21), (7, 7), (7, 23),
        (8, 8), (8, 23), (9, 8), (9, 23), (10, 8), (10, 24),
        (11, 8), (11, 22), (12, 7), (12, 22), (1, 6), (1, 20)
    ]
    
    for i, (month, day) in enumerate(base_dates):
        term_data = SOLAR_TERMS_DATA[i]
        d = date(year, month, day)
        next_month, next_day = base_dates[(i+1)%24]
        if next_month == 1:
            end_date = date(year + 1, next_month, next_day)
        else:
            end_date = date(year, next_month, next_day)
        
        terms.append({
            **term_data,
            "start_date": d,
            "end_date": end_date
        })
    
    return terms

def get_current_solar_term(now: Optional[date] = None) -> dict:
    if now is None:
        now = date.today()
    
    year = now.year
    terms = get_solar_term_dates(year)
    
    for term in terms:
        if term["start_date"] <= now <= term["end_date"]:
            return term
    
    terms = get_solar_term_dates(year - 1)
    for term in terms:
        if term["start_date"] <= now <= term["end_date"]:
            return term
    
    return terms[0]

def init_solar_terms(db: Session):
    if db.query(SolarTerm).count() > 0:
        return
    
    terms = get_solar_term_dates(datetime.now().year)
    
    for term in terms:
        db_term = SolarTerm(
            id=str(uuid4()),
            name=term["name"],
            name_en=term["name_en"],
            start_date=term["start_date"],
            end_date=term["end_date"],
            climate=term["climate"],
            common_diseases=term["common_diseases"],
            recommended_foods=term["recommended_foods"],
            forbidden_foods=term["forbidden_foods"],
            exercises=term["exercises"]
        )
        db.add(db_term)
    
    db.commit()