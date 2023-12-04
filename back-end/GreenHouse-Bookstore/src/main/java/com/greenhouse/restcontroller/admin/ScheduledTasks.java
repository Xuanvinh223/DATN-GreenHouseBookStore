package com.greenhouse.restcontroller.admin;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.greenhouse.model.Discounts;
import com.greenhouse.model.Flash_Sales;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Discount;
import com.greenhouse.model.Product_Flash_Sale;
import com.greenhouse.service.FlashSalesService;
import com.greenhouse.service.ProductDetailService;
import com.greenhouse.service.ProductDiscountService;
import com.greenhouse.service.ProductFlashSaleService;

@Component
public class ScheduledTasks {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final ProductDiscountService productDiscountService;
    private final ProductDetailService productDetailService;
    private final ProductFlashSaleService productFlashSaleService;
    private final FlashSalesService flashSalesService;

    @Autowired
    public ScheduledTasks(
            ProductDiscountService productDiscountService,
            ProductDetailService productDetailService,
            ProductFlashSaleService productFlashSaleService,
            FlashSalesService flashSalesService) {
        this.productDiscountService = productDiscountService;
        this.productDetailService = productDetailService;
        this.productFlashSaleService = productFlashSaleService;
        this.flashSalesService = flashSalesService;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void updateExpiredDiscounts() {
        List<Product_Discount> allProductDiscounts = productDiscountService.findAll();

        for (Product_Discount productDiscount : allProductDiscounts) {
            Discounts discount = productDiscount.getDiscount();

            if (discount != null && discount.getEndDate() != null && discount.getEndDate().before(new Date())) {
                Product_Detail productDetail = productDiscount.getProductDetail();

                if (productDetail != null) {
                    productDetail.setPriceDiscount(productDetail.getPrice());
                    productDetailService.update(productDetail);
                }

                productDiscount.setDiscount(null);
                productDiscountService.update(productDiscount);

                messagingTemplate.convertAndSend("/topic/products", "update");
            }
        }
    }

    @Scheduled(cron = "0 0 0,2,4,6,8,10,12,14,16,18,20,22 * * ?")
    public void updateExpiredFlashSales() {
        updateExpiredFlashSalesCommonLogic(2);
    }

    @Scheduled(cron = "0 0 2,4,6,8,10,12,14,16,18,20,22,0 * * ?")
    public void updateExpiredFlashSales1() {
        updateExpiredFlashSalesCommonLogic(3);
    }   

    private void updateExpiredFlashSalesCommonLogic(int status) {
        List<Product_Flash_Sale> allProductFlashSales = productFlashSaleService.findAll();

        for (Product_Flash_Sale productFlashSale : allProductFlashSales) {
            Flash_Sales flashSale = productFlashSale.getFlashSaleId();

            if (flashSale != null && flashSale.getEndTime() != null && flashSale.getEndTime().before(new Date())) {
                Product_Detail productDetail = productFlashSale.getProductDetail();

                if (productDetail != null) {
                    Date currentTime = new Date();

                    if (flashSale.getStartTime().before(currentTime) && flashSale.getEndTime().after(currentTime)) {
                        // Your common logic for flash sale
                    } else {
                        double exitPriceDiscount = productDetail.getPriceDiscount();
                        double discountPercentage = (double) productFlashSale.getDiscountPercentage() / 100;
                        double newPriceDiscount = status == 2 ? exitPriceDiscount * (1 - discountPercentage)
                                : exitPriceDiscount / (1 - discountPercentage);

                        productDetail.setPriceDiscount(newPriceDiscount);
                        flashSale.setStatus(status);
                    }

                    flashSalesService.update(flashSale);
                    productDetailService.update(productDetail);
                }

                productFlashSaleService.update(productFlashSale);
                messagingTemplate.convertAndSend("/topic/products", "update");
            }
        }
    }
}
