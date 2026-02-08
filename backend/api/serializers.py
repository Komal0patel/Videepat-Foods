from rest_framework import serializers
from .models import Page, Section, Block, Product, Category, Coupon, Theme, Story, Hero
from bson import ObjectId
from decimal import Decimal

class MongoSerializer(serializers.Serializer):
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        return self._convert_types(ret)

    def _convert_types(self, data):
        if isinstance(data, list):
            return [self._convert_types(item) for item in data]
        elif isinstance(data, dict):
            return {k: self._convert_types(v) for k, v in data.items()}
        elif isinstance(data, ObjectId):
            return str(data)
        elif isinstance(data, Decimal):
            return float(data)
        return data

class BlockSerializer(MongoSerializer):
    id = serializers.CharField()
    type = serializers.CharField()
    content = serializers.DictField(required=False, default={})
    styles = serializers.DictField(required=False, default={})
    animations = serializers.DictField(required=False, default={})
    visibility = serializers.DictField(required=False, default={"mobile": True, "tablet": True, "desktop": True})

class SectionSerializer(MongoSerializer):
    id = serializers.CharField()
    layout = serializers.CharField()
    styles = serializers.DictField(required=False, default={})
    blocks = BlockSerializer(many=True, required=False, default=[])
    order = serializers.IntegerField(required=False, default=0)

class PageSerializer(MongoSerializer):
    id = serializers.CharField(read_only=True)
    _id = serializers.CharField(source='id', read_only=True)
    name = serializers.CharField()
    slug = serializers.CharField()
    meta_title = serializers.CharField(required=False, allow_blank=True)
    meta_description = serializers.CharField(required=False, allow_blank=True)
    layout = serializers.CharField(default="default")
    is_active = serializers.BooleanField(default=True)
    status = serializers.CharField(default="draft")
    sections = SectionSerializer(many=True, required=False, default=[])
    version = serializers.IntegerField(default=1)
    
    def create(self, validated_data):
        sections_data = validated_data.pop('sections', [])
        page = Page(**validated_data)
        
        sections = []
        for section_data in sections_data:
            blocks_data = section_data.pop('blocks', [])
            section = Section(**section_data)
            section.blocks = [Block(**b) for b in blocks_data]
            sections.append(section)
        
        page.sections = sections
        page.save()
        return page

    def update(self, instance, validated_data):
        sections_data = validated_data.pop('sections', [])
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        sections = []
        for section_data in sections_data:
            blocks_data = section_data.pop('blocks', [])
            section = Section(**section_data)
            section.blocks = [Block(**b) for b in blocks_data]
            sections.append(section)
            
        instance.sections = sections
        instance.save()
        return instance

class CategorySerializer(MongoSerializer):
    id = serializers.CharField(read_only=True)
    _id = serializers.CharField(source='id', read_only=True)
    name = serializers.CharField()
    slug = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)
    media_url = serializers.CharField(required=False, allow_blank=True)
    media_type = serializers.CharField(default="image")
    is_active = serializers.BooleanField(default=True)

    def create(self, validated_data):
        return Category.objects.create(**validated_data)

class ProductSerializer(MongoSerializer):
    id = serializers.CharField(read_only=True)
    _id = serializers.CharField(source='id', read_only=True)
    name = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    discount_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    stock = serializers.IntegerField()
    images = serializers.ListField(child=serializers.CharField())
    category_ids = serializers.ListField(child=serializers.CharField())
    attributes = serializers.DictField()
    is_active = serializers.BooleanField(default=True)

    def create(self, validated_data):
        return Product.objects.create(**validated_data)

class CouponSerializer(MongoSerializer):
    id = serializers.CharField(read_only=True)
    _id = serializers.CharField(source='id', read_only=True)
    code = serializers.CharField()
    discount_type = serializers.CharField()
    discount_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    min_cart_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = serializers.DateTimeField(required=False, allow_null=True)
    usage_limit = serializers.IntegerField(required=False, allow_null=True)
    usage_count = serializers.IntegerField(default=0)
    is_active = serializers.BooleanField(default=True)
    applied_to = serializers.DictField()

    def create(self, validated_data):
        return Coupon.objects.create(**validated_data)

class ThemeSerializer(MongoSerializer):
    id = serializers.CharField(read_only=True)
    _id = serializers.CharField(source='id', read_only=True)
    name = serializers.CharField()
    colors = serializers.DictField()
    typography = serializers.DictField()
    is_active = serializers.BooleanField(default=True)

    def create(self, validated_data):
        return Theme.objects.create(**validated_data)

class StorySerializer(MongoSerializer):
    id = serializers.CharField(read_only=True)
    _id = serializers.CharField(source='id', read_only=True)
    title = serializers.CharField()
    subtitle = serializers.CharField(required=False, allow_blank=True)
    thumbnailImage = serializers.CharField(required=False, allow_blank=True)
    heroImage = serializers.CharField(required=False, allow_blank=True)
    shortExcerpt = serializers.CharField(required=False, allow_blank=True)
    fullStoryContent = serializers.ListField(child=serializers.DictField())
    is_active = serializers.BooleanField(default=True)

class HeroSerializer(MongoSerializer):
    id = serializers.CharField(read_only=True)
    _id = serializers.CharField(source='id', read_only=True)
    title = serializers.CharField()
    subtitle = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    backgroundImage = serializers.CharField(required=False, allow_blank=True)
    ctaText = serializers.CharField(required=False, allow_blank=True)
    ctaLink = serializers.CharField(required=False, allow_blank=True)
    secondaryCtaText = serializers.CharField(required=False, allow_blank=True)
    secondaryCtaLink = serializers.CharField(required=False, allow_blank=True)
    is_active = serializers.BooleanField(default=True)

    def create(self, validated_data):
        return Hero.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
