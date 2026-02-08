from mongoengine import Document, EmbeddedDocument, fields
import datetime

class Block(EmbeddedDocument):
    id = fields.StringField(required=True)
    type = fields.StringField(required=True) # text, image, video, button, product_list, etc.
    content = fields.DictField()
    styles = fields.DictField()
    animations = fields.DictField()
    visibility = fields.DictField(default={"mobile": True, "tablet": True, "desktop": True})

    meta = {'strict': False}

class Section(EmbeddedDocument):
    id = fields.StringField(required=True)
    layout = fields.StringField(default="boxed") # full, boxed, split
    styles = fields.DictField()
    blocks = fields.ListField(fields.EmbeddedDocumentField(Block))
    order = fields.IntField(default=0)

    meta = {'strict': False}

class Page(Document):
    name = fields.StringField(required=True)
    slug = fields.StringField(required=True, unique=True)
    meta_title = fields.StringField()
    meta_description = fields.StringField()
    layout = fields.StringField(default="default") # default, landing, minimal
    is_active = fields.BooleanField(default=True)
    status = fields.StringField(default="draft") # draft, published
    sections = fields.ListField(fields.EmbeddedDocumentField(Section))
    version = fields.IntField(default=1)
    created_at = fields.DateTimeField(default=datetime.datetime.utcnow)
    updated_at = fields.DateTimeField(default=datetime.datetime.utcnow)
    createdAt = fields.DateTimeField()
    updatedAt = fields.DateTimeField()
    __v = fields.IntField()

    meta = {
        'collection': 'pages',
        'strict': False,
        'auto_create_index': False
    }

class Category(Document):
    name = fields.StringField(required=True)
    slug = fields.StringField(required=True, unique=True)
    description = fields.StringField()
    media_url = fields.StringField() # image or video
    media_type = fields.StringField(default="image") # image, video
    is_active = fields.BooleanField(default=True)
    createdAt = fields.DateTimeField()
    updatedAt = fields.DateTimeField()
    __v = fields.IntField()

    meta = {
        'collection': 'categories',
        'strict': False,
        'auto_create_index': False
    }

class Product(Document):
    name = fields.StringField(required=True)
    description = fields.StringField()
    price = fields.DecimalField(required=True)
    discount_price = fields.DecimalField()
    stock = fields.IntField(default=0)
    images = fields.ListField(fields.StringField())
    category_ids = fields.ListField(fields.StringField())
    attributes = fields.DictField() # variants, allergens, ingredients, etc.
    is_active = fields.BooleanField(default=True)
    created_at = fields.DateTimeField(default=datetime.datetime.utcnow)
    createdAt = fields.DateTimeField()
    updatedAt = fields.DateTimeField()
    __v = fields.IntField()

    meta = {
        'collection': 'products',
        'strict': False,
        'auto_create_index': False
    }

class Coupon(Document):
    code = fields.StringField(required=True, unique=True)
    discount_type = fields.StringField(default="percentage") # percentage, flat
    discount_value = fields.DecimalField(required=True)
    min_cart_value = fields.DecimalField(default=0)
    expiry_date = fields.DateTimeField()
    usage_limit = fields.IntField()
    usage_count = fields.IntField(default=0)
    is_active = fields.BooleanField(default=True)
    applied_to = fields.DictField() # { type: "all" | "products" | "categories", ids: [] }
    createdAt = fields.DateTimeField()
    updatedAt = fields.DateTimeField()
    __v = fields.IntField()

    meta = {
        'collection': 'coupons',
        'strict': False,
        'auto_create_index': False
    }

class Theme(Document):
    name = fields.StringField(default="Global Theme")
    colors = fields.DictField(default={
        "primary": "#000000",
        "secondary": "#ffffff",
        "accent": "#ff0000"
    })
    typography = fields.DictField(default={
        "fontFamily": "Inter, sans-serif"
    })
    is_active = fields.BooleanField(default=True)

class Story(Document):
    title = fields.StringField(required=True)
    subtitle = fields.StringField()
    thumbnailImage = fields.StringField()
    heroImage = fields.StringField()
    shortExcerpt = fields.StringField()
    fullStoryContent = fields.ListField(fields.DictField())
    is_active = fields.BooleanField(default=True)
    createdAt = fields.DateTimeField()
    updatedAt = fields.DateTimeField()
    __v = fields.IntField()

    meta = {
        'collection': 'stories',
        'strict': False,
        'auto_create_index': False
    }

class Hero(Document):
    title = fields.StringField(default="Fresh from Our Village")
    subtitle = fields.StringField(default="Authentic flavors, delivered to your doorstep")
    description = fields.StringField(default="Experience the taste of tradition with our handpicked selection of village-fresh products")
    backgroundImage = fields.StringField(default="/assets/hero.png")
    ctaText = fields.StringField(default="Explore Our Products")
    ctaLink = fields.StringField(default="/products")
    secondaryCtaText = fields.StringField(default="Our Story")
    secondaryCtaLink = fields.StringField(default="/story")
    is_active = fields.BooleanField(default=True)
    createdAt = fields.DateTimeField(default=datetime.datetime.utcnow)
    updatedAt = fields.DateTimeField(default=datetime.datetime.utcnow)
    __v = fields.IntField()

    meta = {
        'collection': 'heroes',
        'strict': False,
        'auto_create_index': False
    }
