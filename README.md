# ShopAll
Before testing: 
npm install
node server.js

Test Basic URL
http://localhost:3000/index.html

Testing each endpoints using ThunderClient:
View All Products
Method: GET
URL: http://localhost:3000/api/products

View Product by ID
Method: GET
URL: http://localhost:3000/api/products/1

Search Products by Name
Method: GET
URL: http://localhost:3000/api/products/search?q=headphones

Filter Products by Category
Method: GET
URL: http://localhost:3000/api/products/category/2

Add New Product
Method: POST
URL: http://localhost:3000/api/products

Headers:
Content-Type: application/json
Body (JSON):
{
  "name": "Test Product",
  "description": "Testing Add Product",
  "image_url": "images/test.jpg",
  "price": 59.99,
  "category_id": 1,
  "is_featured": 0
}

Update Product by ID
Method: PUT
URL: http://localhost:3000/api/products/1
Headers:
Content-Type: application/json
Body (JSON):
{
  "name": "Updated Product Name",
  "description": "Updated description",
  "image_url": "images/updated.jpg",
  "price": 99.99,
  "category_id": 1,
  "is_featured": 1
}

Bulk Upload Products
URL: http://localhost:3000/api/products/upload
Method: POST
Body: form-data
Type: File
Send the request, and you should get:
{
  "message": "Bulk upload successful",
  "count": 3
}


Add Item to Cart
Method: POST
URL: http://localhost:3000/api/cart/add
Headers:
Content-Type: application/json
Body (JSON):
{
  "userId": 1,
  "productId": 2,
  "quantity": 1
}

View Cart Items by User
Method: GET
URL: http://localhost:3000/api/cart/1

Remove Product from Cart
Method: DELETE
URL: http://localhost:3000/api/cart/1/2
(removes product ID 2 from user ID 1’s cart)

Checkout (Empty Cart)
Method: POST
URL: http://localhost:3000/api/cart/1/checkout
