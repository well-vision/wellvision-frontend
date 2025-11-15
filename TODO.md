# Well Vision - Products and Orders Integration TODO

## Frontend Changes
- [ ] Update OrderDashboard.js: Add "Browse Products" button in Add Order modal
- [ ] Update OrderDashboard.js: Implement navigation to Products page with selection mode
- [ ] Update Products.js: Add selection mode detection (URL params or state)
- [ ] Update Products.js: Add product selection functionality
- [ ] Update Products.js: Add return navigation to orders with selected products

## Backend Changes
- [x] Update orderModel.js: Add productId to order items schema
- [x] Update orderController.js: Add stock availability checking
- [x] Update orderController.js: Implement atomic stock reduction using MongoDB transactions
- [x] Update orderController.js: Add error handling for insufficient stock

## Testing
- [ ] Test navigation flow between Orders and Products pages
- [ ] Test product selection and return to order creation
- [ ] Test stock reduction on successful order creation
- [ ] Test insufficient stock error handling
- [ ] Verify transaction atomicity prevents race conditions
