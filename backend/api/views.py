from rest_framework import status, views, permissions
from rest_framework.response import Response
import mongoengine
from .models import Page, Product, Category, Coupon, Theme, Story, Hero
from .serializers import (
    PageSerializer, ProductSerializer, CategorySerializer, 
    CouponSerializer, ThemeSerializer, StorySerializer, HeroSerializer
)
from bson import ObjectId

class MongoBaseView(views.APIView):
    model = None
    serializer_class = None

    def get_permissions(self):
        # Temporarily allowing all access to fix the 401 error in dev
        # TODO: Restore IsAuthenticated before production
        return [permissions.AllowAny()]

    def get_object(self, pk):
        try:
            return self.model.objects.get(id=pk)
        except (self.model.DoesNotExist, Exception):
            return None

class PageListView(MongoBaseView):
    model = Page
    serializer_class = PageSerializer

    def get(self, request):
        pages = Page.objects.all()
        serializer = PageSerializer(pages, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PageSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except mongoengine.errors.NotUniqueError:
                return Response({"error": "A page with this name or slug already exists."}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PageDetailView(MongoBaseView):
    model = Page
    serializer_class = PageSerializer

    def get(self, request, pk):
        page = self.get_object(pk)
        if not page:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PageSerializer(page)
        return Response(serializer.data)

    def put(self, request, pk):
        page = self.get_object(pk)
        if not page:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PageSerializer(page, data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data)
            except mongoengine.errors.NotUniqueError:
                return Response({"error": "Another page already uses this slug."}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        page = self.get_object(pk)
        if not page:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        page.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProductListView(MongoBaseView):
    model = Product
    serializer_class = ProductSerializer

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryListView(MongoBaseView):
    model = Category
    serializer_class = CategorySerializer

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CouponListView(MongoBaseView):
    model = Coupon
    serializer_class = CouponSerializer

    def get(self, request):
        coupons = Coupon.objects.all()
        serializer = CouponSerializer(coupons, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CouponSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ProductDetailView(MongoBaseView):
    model = Product
    serializer_class = ProductSerializer

    def get(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def put(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class StoryListView(MongoBaseView):
    model = Story
    serializer_class = StorySerializer

    def get(self, request):
        stories = Story.objects.all()
        serializer = StorySerializer(stories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = StorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StoryDetailView(MongoBaseView):
    model = Story
    serializer_class = StorySerializer

    def get(self, request, pk):
        story = self.get_object(pk)
        if not story:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = StorySerializer(story)
        return Response(serializer.data)

    def put(self, request, pk):
        story = self.get_object(pk)
        if not story:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = StorySerializer(story, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        story = self.get_object(pk)
        if not story:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        story.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class HeroView(MongoBaseView):
    model = Hero
    serializer_class = HeroSerializer

    def get(self, request):
        # Get the active hero or create a default one if none exists
        hero = Hero.objects(is_active=True).first()
        if not hero:
            hero = Hero()
            hero.save()
        serializer = HeroSerializer(hero)
        return Response(serializer.data)

    def put(self, request):
        # Update the active hero
        hero = Hero.objects(is_active=True).first()
        if not hero:
            hero = Hero()
        serializer = HeroSerializer(hero, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
