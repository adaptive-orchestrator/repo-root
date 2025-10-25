start auth-svc
auth/signup

start catalogue  --- cái này chưa có update
create

start /inventory
create

start order
create

Order-svc 
  └─ emit order.created 
       └─> Inventory-svc lắng nghe (ORDER_CREATED)
            └─ reserve stock
            └─ emit inventory.reserved
                 └─> Billing-svc lắng nghe (INVENTORY_RESERVED)
                      └─ tạo invoice
                      └─ emit invoice.created

─> Billing-svc lắng nghe (INVENTORY_RESERVED)
                      └─ tạo invoice
                      └─ emit invoice.created ✅
                           └─> Payment-svc lắng nghe (INVOICE_CREATED) ✅
                                └─ register invoice
                                └─ create pending payment
                                └─ emit payment.initiated
                                └─ [TODO: generate VNPay URL]
                                
                                [Customer pays via VNPay or Test API]
                                
                                └─ POST /payments/:id/test/success (giả lập trả tiền) 
                                http://localhost:3013/payments/3/test/success
                                     └─ emit payment.success
                                          └─> Billing-svc lắng nghe
                                               └─ update invoice status = 'paid'

1. Customer tạo order
   └─> Order-svc emit ORDER_CREATED

2. Inventory-svc nhận ORDER_CREATED
   └─> RESERVE stock (quantityReserved++)
   └─> Emit INVENTORY_RESERVED (cho mỗi item)

3. Billing-svc nhận INVENTORY_RESERVED
   └─> Tạo invoice (status: draft)
   └─> Emit INVOICE_CREATED

4. Payment-svc nhận INVOICE_CREATED
   └─> Tạo payment record (status: initiated)
   └─> Emit PAYMENT_INITIATED

5. Customer trả tiền (qua test endpoint)
   └─> Payment-svc emit PAYMENT_SUCCESS

6. Billing-svc nhận PAYMENT_SUCCESS ✅ NEW!
   └─> Update invoice status → "paid" ✅
   └─> Emit ORDER_COMPLETED ✅

7. Inventory-svc nhận ORDER_COMPLETED ✅ NEW!
   └─> Convert reservation → actual deduction ✅
   └─> quantityAvailable -= quantity ✅
   └─> quantityReserved -= quantity ✅