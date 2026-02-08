from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    PageListView, PageDetailView, 
    ProductListView, ProductDetailView,
    CategoryListView, CouponListView,
    StoryListView, StoryDetailView,
    HeroView
)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('pages/', PageListView.as_view(), name='page-list'),
    path('pages/<str:pk>/', PageDetailView.as_view(), name='page-detail'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<str:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('coupons/', CouponListView.as_view(), name='coupon-list'),
    path('stories/', StoryListView.as_view(), name='story-list'),
    path('stories/<str:pk>/', StoryDetailView.as_view(), name='story-detail'),
    path('hero/', HeroView.as_view(), name='hero'),
]

