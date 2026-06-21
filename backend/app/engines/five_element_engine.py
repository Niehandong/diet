from typing import List, Dict
from sqlalchemy.orm import Session
from uuid import uuid4

from app.models.five_element import FiveElementFood

ELEMENT_COLOR_MAP = {"木": "青色", "火": "红色", "土": "黄色", "金": "白色", "水": "黑色"}
ELEMENT_ORGAN_MAP = {"木": "肝", "火": "心", "土": "脾", "金": "肺", "水": "肾"}

FIVE_ELEMENT_FOODS_DATA = [
    {"name": "菠菜", "element": "木", "color": "青色", "properties": "性凉，味甘", "benefits": "养肝明目，润燥滑肠"},
    {"name": "芹菜", "element": "木", "color": "青色", "properties": "性凉，味甘苦", "benefits": "平肝清热，祛风利湿"},
    {"name": "韭菜", "element": "木", "color": "青色", "properties": "性温，味辛", "benefits": "温中散寒，补肾壮阳"},
    {"name": "绿豆", "element": "木", "color": "青色", "properties": "性寒，味甘", "benefits": "清热解毒，消暑利水"},
    {"name": "红豆", "element": "火", "color": "红色", "properties": "性平，味甘酸", "benefits": "利水消肿，解毒排脓"},
    {"name": "红枣", "element": "火", "color": "红色", "properties": "性温，味甘", "benefits": "补中益气，养血安神"},
    {"name": "枸杞", "element": "火", "color": "红色", "properties": "性平，味甘", "benefits": "滋补肝肾，益精明目"},
    {"name": "桂圆", "element": "火", "color": "红色", "properties": "性温，味甘", "benefits": "补益心脾，养血安神"},
    {"name": "小米", "element": "土", "color": "黄色", "properties": "性凉，味甘咸", "benefits": "健脾和胃，滋阴养血"},
    {"name": "南瓜", "element": "土", "color": "黄色", "properties": "性温，味甘", "benefits": "补中益气，消炎止痛"},
    {"name": "红薯", "element": "土", "color": "黄色", "properties": "性平，味甘", "benefits": "补中和血，益气生津"},
    {"name": "山药", "element": "土", "color": "黄色", "properties": "性平，味甘", "benefits": "益气养阴，补脾肺肾"},
    {"name": "梨", "element": "金", "color": "白色", "properties": "性寒，味甘微酸", "benefits": "生津润燥，清热化痰"},
    {"name": "银耳", "element": "金", "color": "白色", "properties": "性平，味甘淡", "benefits": "滋阴润肺，养胃生津"},
    {"name": "百合", "element": "金", "color": "白色", "properties": "性微寒，味甘", "benefits": "养阴润肺，清心安神"},
    {"name": "杏仁", "element": "金", "color": "白色", "properties": "性温，味苦", "benefits": "止咳平喘，润肠通便"},
    {"name": "黑豆", "element": "水", "color": "黑色", "properties": "性平，味甘", "benefits": "补肾滋阴，补血明目"},
    {"name": "黑芝麻", "element": "水", "color": "黑色", "properties": "性平，味甘", "benefits": "补肝肾，益精血"},
    {"name": "黑米", "element": "水", "color": "黑色", "properties": "性平，味甘", "benefits": "滋阴补肾，益气活血"},
    {"name": "核桃", "element": "水", "color": "黑色", "properties": "性温，味甘", "benefits": "补肾温肺，润肠通便"},
    {"name": "鲫鱼", "element": "水", "color": "白色", "properties": "性平，味甘", "benefits": "健脾利湿，和中开胃"},
    {"name": "鸭肉", "element": "水", "color": "白色", "properties": "性寒，味甘咸", "benefits": "滋阴养胃，利水消肿"},
    {"name": "牛肉", "element": "土", "color": "黄色", "properties": "性平，味甘", "benefits": "补脾胃，强筋骨"},
    {"name": "羊肉", "element": "火", "color": "红色", "properties": "性温，味甘", "benefits": "温中暖肾，益气补虚"},
    {"name": "生姜", "element": "火", "color": "黄色", "properties": "性温，味辛", "benefits": "发散风寒，温中止呕"},
    {"name": "蜂蜜", "element": "土", "color": "黄色", "properties": "性平，味甘", "benefits": "补中润燥，止痛解毒"},
    {"name": "莲子", "element": "水", "color": "白色", "properties": "性平，味甘涩", "benefits": "补脾止泻，益肾涩精"},
    {"name": "薏米", "element": "土", "color": "白色", "properties": "性凉，味甘淡", "benefits": "利水渗湿，健脾止泻"},
    {"name": "冬瓜", "element": "水", "color": "白色", "properties": "性凉，味甘淡", "benefits": "清热化痰，利尿消肿"},
    {"name": "黄瓜", "element": "木", "color": "青色", "properties": "性凉，味甘", "benefits": "清热利水，解毒消肿"},
    {"name": "苦瓜", "element": "火", "color": "青色", "properties": "性寒，味苦", "benefits": "清热解暑，明目解毒"},
    {"name": "番茄", "element": "火", "color": "红色", "properties": "性微寒，味甘酸", "benefits": "生津止渴，健胃消食"},
    {"name": "白萝卜", "element": "金", "color": "白色", "properties": "性凉，味甘辛", "benefits": "下气宽中，清热生津"},
    {"name": "胡萝卜", "element": "土", "color": "黄色", "properties": "性平，味甘", "benefits": "健脾消食，补肝明目"},
    {"name": "香菇", "element": "土", "color": "黑色", "properties": "性平，味甘", "benefits": "扶正补虚，健脾开胃"},
    {"name": "黑木耳", "element": "水", "color": "黑色", "properties": "性平，味甘", "benefits": "补气血，润肺止咳"},
    {"name": "海带", "element": "水", "color": "黑色", "properties": "性寒，味咸", "benefits": "软坚散结，清热利水"},
    {"name": "紫菜", "element": "水", "color": "紫色", "properties": "性寒，味甘咸", "benefits": "软坚散结，清热化痰"},
    {"name": "山楂", "element": "木", "color": "红色", "properties": "性微温，味酸甘", "benefits": "消食化积，活血化瘀"}
]

CONSTITUTION_ELEMENT_MAP = {
    "BALANCED": {"木": 1, "火": 1, "土": 1, "金": 1, "水": 1},
    "QI_DEFICIENCY": {"木": 0.8, "火": 0.8, "土": 0.6, "金": 0.8, "水": 0.8},
    "YANG_DEFICIENCY": {"木": 0.7, "火": 0.5, "土": 0.8, "金": 0.7, "水": 0.7},
    "YIN_DEFICIENCY": {"木": 0.7, "火": 0.7, "土": 0.7, "金": 0.7, "水": 0.5},
    "PHLEGM_DAMP": {"木": 0.6, "火": 0.7, "土": 1.2, "金": 0.8, "水": 1.1},
    "DAMP_HEAT": {"木": 0.8, "火": 1.2, "土": 1.1, "金": 0.7, "水": 0.9},
    "BLOOD_STASIS": {"木": 0.9, "火": 0.9, "土": 0.9, "金": 0.9, "水": 0.8},
    "QI_STAGNATION": {"木": 0.7, "火": 0.8, "土": 0.9, "金": 0.9, "水": 0.9},
    "SPECIAL_CONSTITUTION": {"木": 0.8, "火": 0.8, "土": 0.8, "金": 0.8, "水": 0.8}
}

def analyze_five_elements(constitution_type: str) -> Dict[str, float]:
    return CONSTITUTION_ELEMENT_MAP.get(constitution_type, CONSTITUTION_ELEMENT_MAP["BALANCED"])

def get_element_recommendations(element_scores: Dict[str, float]) -> List[str]:
    recommendations = []
    sorted_elements = sorted(element_scores.items(), key=lambda x: x[1])
    
    for element, score in sorted_elements[:2]:
        organ = ELEMENT_ORGAN_MAP[element]
        recommendations.append(f"您的{organ}偏弱，建议多吃{ELEMENT_COLOR_MAP[element]}色食物以补{element}")
    
    return recommendations

def get_foods_by_element(db: Session, element: str) -> List[FiveElementFood]:
    return db.query(FiveElementFood).filter(FiveElementFood.element == element).all()

def init_five_element_foods(db: Session):
    if db.query(FiveElementFood).count() > 0:
        return
    
    for food_data in FIVE_ELEMENT_FOODS_DATA:
        food = FiveElementFood(
            id=str(uuid4()),
            name=food_data["name"],
            element=food_data["element"],
            organ=ELEMENT_ORGAN_MAP[food_data["element"]],
            color=food_data["color"],
            properties=food_data["properties"],
            benefits=food_data["benefits"]
        )
        db.add(food)
    
    db.commit()

def get_all_foods(db: Session) -> List[FiveElementFood]:
    init_five_element_foods(db)
    return db.query(FiveElementFood).all()