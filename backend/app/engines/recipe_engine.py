from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from uuid import uuid4

from app.models.recipe import Recipe
from app.schemas.recipe import RecipeRecommendationRequest

RECIPES_DATA = [
    {"name": "红枣小米粥", "description": "健脾养胃，补气养血", "ingredients": [{"name": "小米", "quantity": "100g"}, {"name": "红枣", "quantity": "5颗"}], "steps": ["小米淘洗干净", "红枣去核", "加水煮30分钟至软烂"], "suitable_constitutions": ["QI_DEFICIENCY", "BALANCED", "YANG_DEFICIENCY"], "suitable_terms": ["立春", "雨水", "惊蛰", "春分"], "five_elements": ["土", "火"], "difficulty": 1, "taste_tags": ["清淡", "香甜"], "calories": 150, "image_url": "/images/黄芪红枣茶.png"},
    {"name": "枸杞百合粥", "description": "滋阴润肺，清心安神", "ingredients": [{"name": "大米", "quantity": "100g"}, {"name": "枸杞", "quantity": "10g"}, {"name": "百合", "quantity": "20g"}], "steps": ["大米淘洗干净", "百合泡发", "加水煮20分钟", "加入枸杞再煮10分钟"], "suitable_constitutions": ["YIN_DEFICIENCY", "BALANCED", "QI_STAGNATION"], "suitable_terms": ["立秋", "处暑", "白露", "秋分"], "five_elements": ["火", "金"], "difficulty": 1, "taste_tags": ["清淡", "香甜"], "calories": 180, "image_url": "/images/绿豆百合粥.png"},
    {"name": "山药排骨汤", "description": "健脾益胃，补肾养血", "ingredients": [{"name": "排骨", "quantity": "500g"}, {"name": "山药", "quantity": "200g"}, {"name": "姜片", "quantity": "3片"}], "steps": ["排骨焯水", "山药切块", "加水炖煮1小时", "加盐调味"], "suitable_constitutions": ["QI_DEFICIENCY", "YANG_DEFICIENCY", "BALANCED"], "suitable_terms": ["立冬", "小雪", "大雪", "冬至"], "five_elements": ["土", "水"], "difficulty": 2, "taste_tags": ["鲜美", "清淡"], "calories": 350, "image_url": "/images/山药枸杞粥.png"},
    {"name": "冬瓜海带汤", "description": "清热利湿，软坚散结", "ingredients": [{"name": "冬瓜", "quantity": "300g"}, {"name": "海带", "quantity": "50g"}, {"name": "虾皮", "quantity": "10g"}], "steps": ["冬瓜切块", "海带泡发切块", "加水煮沸", "加入虾皮调味"], "suitable_constitutions": ["PHLEGM_DAMP", "DAMP_HEAT", "BALANCED"], "suitable_terms": ["立夏", "小满", "芒种", "夏至"], "five_elements": ["水", "金"], "difficulty": 1, "taste_tags": ["清淡", "鲜美"], "calories": 80, "image_url": "/images/薏米红豆汤.png"},
    {"name": "菠菜猪肝汤", "description": "养肝明目，补血养血", "ingredients": [{"name": "猪肝", "quantity": "100g"}, {"name": "菠菜", "quantity": "200g"}, {"name": "姜片", "quantity": "2片"}], "steps": ["猪肝切片焯水", "菠菜洗净切段", "加水煮沸", "加入猪肝和菠菜煮熟"], "suitable_constitutions": ["BLOOD_STASIS", "QI_DEFICIENCY", "BALANCED"], "suitable_terms": ["惊蛰", "春分", "清明", "谷雨"], "five_elements": ["木", "火"], "difficulty": 2, "taste_tags": ["鲜美", "清淡"], "calories": 120, "image_url": "/images/当归羊肉汤.png"},
    {"name": "南瓜小米粥", "description": "补中益气，健脾养胃", "ingredients": [{"name": "小米", "quantity": "80g"}, {"name": "南瓜", "quantity": "150g"}], "steps": ["小米淘洗干净", "南瓜切块", "加水煮30分钟"], "suitable_constitutions": ["QI_DEFICIENCY", "BALANCED", "YANG_DEFICIENCY"], "suitable_terms": ["立秋", "处暑", "白露"], "five_elements": ["土"], "difficulty": 1, "taste_tags": ["香甜", "软糯"], "calories": 160, "image_url": "/images/山药枸杞粥.png"},
    {"name": "黑豆核桃粥", "description": "补肾益精，健脑安神", "ingredients": [{"name": "大米", "quantity": "50g"}, {"name": "黑豆", "quantity": "30g"}, {"name": "核桃", "quantity": "20g"}], "steps": ["黑豆提前泡发", "大米淘洗", "加水煮20分钟", "加入核桃再煮10分钟"], "suitable_constitutions": ["YIN_DEFICIENCY", "BALANCED", "QI_DEFICIENCY"], "suitable_terms": ["立冬", "小雪", "大雪"], "five_elements": ["水"], "difficulty": 2, "taste_tags": ["香醇", "软糯"], "calories": 200, "image_url": "/images/核桃黑芝麻糊.png"},
    {"name": "银耳莲子羹", "description": "滋阴润肺，养心安神", "ingredients": [{"name": "银耳", "quantity": "15g"}, {"name": "莲子", "quantity": "20g"}, {"name": "冰糖", "quantity": "适量"}], "steps": ["银耳泡发撕成小朵", "莲子泡发", "加水炖煮1小时", "加冰糖调味"], "suitable_constitutions": ["YIN_DEFICIENCY", "QI_STAGNATION", "BALANCED"], "suitable_terms": ["处暑", "白露", "秋分"], "five_elements": ["金", "水"], "difficulty": 2, "taste_tags": ["清甜", "软糯"], "calories": 120, "image_url": "/images/银耳百合羹.png"},
    {"name": "清蒸鲈鱼", "description": "健脾利水，益气补虚", "ingredients": [{"name": "鲈鱼", "quantity": "1条"}, {"name": "姜片", "quantity": "3片"}, {"name": "葱段", "quantity": "适量"}], "steps": ["鲈鱼处理干净", "姜片葱段铺在鱼身上", "蒸10分钟", "淋上蒸鱼豉油"], "suitable_constitutions": ["QI_DEFICIENCY", "BALANCED", "YIN_DEFICIENCY"], "suitable_terms": ["立夏", "小满", "芒种"], "five_elements": ["水"], "difficulty": 2, "taste_tags": ["鲜美", "清淡"], "calories": 200, "image_url": "/images/薏米红豆汤.png"},
    {"name": "红烧排骨", "description": "补肾养血，滋阴润燥", "ingredients": [{"name": "排骨", "quantity": "500g"}, {"name": "姜片", "quantity": "3片"}, {"name": "葱段", "quantity": "适量"}], "steps": ["排骨焯水", "热油炒糖色", "加入排骨翻炒", "加水炖煮30分钟"], "suitable_constitutions": ["QI_DEFICIENCY", "BALANCED", "YANG_DEFICIENCY"], "suitable_terms": ["立冬", "冬至", "小寒"], "five_elements": ["火", "水"], "difficulty": 3, "taste_tags": ["香甜", "浓郁"], "calories": 400, "image_url": "/images/当归羊肉汤.png"},
    {"name": "凉拌黄瓜", "description": "清热解暑，利水消肿", "ingredients": [{"name": "黄瓜", "quantity": "2根"}, {"name": "蒜末", "quantity": "适量"}, {"name": "香油", "quantity": "适量"}], "steps": ["黄瓜洗净拍碎", "加入蒜末和调料拌匀"], "suitable_constitutions": ["DAMP_HEAT", "PHLEGM_DAMP", "BALANCED"], "suitable_terms": ["立夏", "小满", "芒种", "夏至"], "five_elements": ["木"], "difficulty": 1, "taste_tags": ["清爽", "酸辣"], "calories": 45, "image_url": "/images/绿豆百合粥.png"},
    {"name": "番茄炒蛋", "description": "生津止渴，健胃消食", "ingredients": [{"name": "番茄", "quantity": "2个"}, {"name": "鸡蛋", "quantity": "2个"}], "steps": ["鸡蛋打散炒熟盛出", "番茄炒软出汁", "加入鸡蛋翻炒"], "suitable_constitutions": ["BALANCED", "YIN_DEFICIENCY", "QI_DEFICIENCY"], "suitable_terms": ["立夏", "小满", "芒种"], "five_elements": ["火"], "difficulty": 1, "taste_tags": ["酸甜", "鲜美"], "calories": 180, "image_url": "/images/山药枸杞粥.png"},
    {"name": "冬瓜薏米汤", "description": "清热利湿，健脾消肿", "ingredients": [{"name": "冬瓜", "quantity": "200g"}, {"name": "薏米", "quantity": "50g"}], "steps": ["薏米提前泡发", "冬瓜切块", "加水煮20分钟"], "suitable_constitutions": ["PHLEGM_DAMP", "DAMP_HEAT", "BALANCED"], "suitable_terms": ["雨水", "小满", "芒种"], "five_elements": ["土", "水"], "difficulty": 1, "taste_tags": ["清淡", "鲜美"], "calories": 90, "image_url": "/images/薏米红豆汤.png"},
    {"name": "桂圆红枣茶", "description": "补中益气，养血安神", "ingredients": [{"name": "桂圆", "quantity": "10颗"}, {"name": "红枣", "quantity": "5颗"}, {"name": "枸杞", "quantity": "10g"}], "steps": ["桂圆红枣枸杞洗净", "加水煮沸后转小火煮15分钟"], "suitable_constitutions": ["QI_DEFICIENCY", "YANG_DEFICIENCY", "BALANCED"], "suitable_terms": ["立冬", "小雪", "大雪"], "five_elements": ["火"], "difficulty": 1, "taste_tags": ["香甜", "温暖"], "calories": 120, "image_url": "/images/红枣桂圆茶.png"},
    {"name": "莲子百合粥", "description": "养心安神，健脾止泻", "ingredients": [{"name": "大米", "quantity": "100g"}, {"name": "莲子", "quantity": "20g"}, {"name": "百合", "quantity": "15g"}], "steps": ["莲子百合泡发", "大米淘洗", "加水煮30分钟"], "suitable_constitutions": ["QI_STAGNATION", "YIN_DEFICIENCY", "BALANCED"], "suitable_terms": ["处暑", "白露", "秋分"], "five_elements": ["金", "水"], "difficulty": 1, "taste_tags": ["清淡", "香甜"], "calories": 170, "image_url": "/images/莲子芡实粥.png"},
    {"name": "黑芝麻糊", "description": "补肝肾，益精血", "ingredients": [{"name": "黑芝麻", "quantity": "30g"}, {"name": "大米", "quantity": "50g"}, {"name": "冰糖", "quantity": "适量"}], "steps": ["黑芝麻炒香", "与大米一起打成粉", "加水煮沸"], "suitable_constitutions": ["YIN_DEFICIENCY", "BALANCED", "QI_DEFICIENCY"], "suitable_terms": ["立冬", "冬至", "小寒"], "five_elements": ["水"], "difficulty": 2, "taste_tags": ["香甜", "浓郁"], "calories": 250, "image_url": "/images/核桃黑芝麻糊.png"},
    {"name": "杏仁露", "description": "止咳平喘，润肠通便", "ingredients": [{"name": "杏仁", "quantity": "30g"}, {"name": "牛奶", "quantity": "200ml"}, {"name": "冰糖", "quantity": "适量"}], "steps": ["杏仁泡发去皮", "与牛奶一起打成汁", "煮沸调味"], "suitable_constitutions": ["YIN_DEFICIENCY", "QI_DEFICIENCY", "BALANCED"], "suitable_terms": ["立秋", "处暑", "白露"], "five_elements": ["金"], "difficulty": 2, "taste_tags": ["香甜", "顺滑"], "calories": 200, "image_url": "/images/银耳百合羹.png"},
    {"name": "生姜红糖水", "description": "温中散寒，活血止痛", "ingredients": [{"name": "生姜", "quantity": "3片"}, {"name": "红糖", "quantity": "适量"}], "steps": ["生姜切片", "加水煮沸", "加入红糖融化"], "suitable_constitutions": ["YANG_DEFICIENCY", "QI_STAGNATION", "BALANCED"], "suitable_terms": ["小寒", "大寒", "立春"], "five_elements": ["火"], "difficulty": 1, "taste_tags": ["温暖", "香甜"], "calories": 80, "image_url": "/images/红枣桂圆茶.png"},
    {"name": "山楂茶", "description": "消食化积，活血化瘀", "ingredients": [{"name": "山楂", "quantity": "10g"}, {"name": "冰糖", "quantity": "适量"}], "steps": ["山楂洗净去核", "加水煮沸", "加入冰糖调味"], "suitable_constitutions": ["BLOOD_STASIS", "PHLEGM_DAMP", "BALANCED"], "suitable_terms": ["霜降", "立冬", "小雪"], "five_elements": ["木"], "difficulty": 1, "taste_tags": ["酸甜", "清爽"], "calories": 60, "image_url": "/images/玫瑰花茶.png"},
    {"name": "枸杞菊花茶", "description": "养肝明目，清热降火", "ingredients": [{"name": "枸杞", "quantity": "10g"}, {"name": "菊花", "quantity": "5g"}], "steps": ["枸杞菊花洗净", "用沸水冲泡"], "suitable_constitutions": ["YIN_DEFICIENCY", "DAMP_HEAT", "BALANCED"], "suitable_terms": ["清明", "谷雨", "立夏"], "five_elements": ["木", "火"], "difficulty": 1, "taste_tags": ["清香", "微甘"], "calories": 30, "image_url": "/images/菊花决明子茶.png"}
]

def init_recipes(db: Session):
    has_image_url = db.query(Recipe).filter(Recipe.image_url.isnot(None)).first()
    if not has_image_url:
        db.query(Recipe).delete()
        for recipe_data in RECIPES_DATA:
            recipe = Recipe(
                id=str(uuid4()),
                name=recipe_data["name"],
                description=recipe_data["description"],
                ingredients=recipe_data["ingredients"],
                steps=recipe_data["steps"],
                suitable_constitutions=recipe_data["suitable_constitutions"],
                suitable_terms=recipe_data["suitable_terms"],
                five_elements=recipe_data["five_elements"],
                difficulty=recipe_data["difficulty"],
                taste_tags=recipe_data["taste_tags"],
                calories=recipe_data["calories"],
                image_url=recipe_data["image_url"]
            )
            db.add(recipe)
        
        db.commit()

def get_all_recipes(db: Session) -> List[Recipe]:
    init_recipes(db)
    return db.query(Recipe).all()

def get_recipe_by_id(db: Session, recipe_id: str) -> Optional[Recipe]:
    init_recipes(db)
    return db.query(Recipe).filter(Recipe.id == recipe_id).first()

def recommend_recipes(
    db: Session,
    constitution_type: Optional[str] = None,
    solar_term: Optional[str] = None,
    taste_preferences: Optional[List[str]] = None,
    max_difficulty: int = 5
) -> List[Recipe]:
    init_recipes(db)
    
    query = db.query(Recipe)
    
    if constitution_type:
        query = query.filter(Recipe.suitable_constitutions.any(constitution_type))
    
    if solar_term:
        query = query.filter(Recipe.suitable_terms.any(solar_term))
    
    if taste_preferences and len(taste_preferences) > 0:
        for taste in taste_preferences:
            query = query.filter(Recipe.taste_tags.any(taste))
    
    query = query.filter(Recipe.difficulty <= max_difficulty)
    
    return query.limit(10).all()

def get_recipes_by_constitution(db: Session, constitution_type: str) -> List[Recipe]:
    init_recipes(db)
    return db.query(Recipe).filter(
        Recipe.suitable_constitutions.any(constitution_type)
    ).all()

def get_recipes_by_solar_term(db: Session, solar_term: str) -> List[Recipe]:
    init_recipes(db)
    return db.query(Recipe).filter(
        Recipe.suitable_terms.any(solar_term)
    ).all()

def search_recipes(db: Session, keyword: str) -> List[Recipe]:
    init_recipes(db)
    return db.query(Recipe).filter(
        Recipe.name.ilike(f"%{keyword}%")
    ).all()
