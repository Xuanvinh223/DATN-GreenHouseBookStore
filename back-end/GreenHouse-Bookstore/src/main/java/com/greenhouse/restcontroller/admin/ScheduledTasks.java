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

    @Autowired
    private ProductDetailService productDetailService;

    @Autowired
    private ProductFlashSaleService productFlashSaleService;

    @Autowired
    private FlashSalesService flashSalesService;

    public ScheduledTasks(ProductDiscountService productDiscountService) {
        this.productDiscountService = productDiscountService;
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

    @Scheduled(cron = "0 15 17 * * ?")
    public void updateExpiredFlashSales() {
        List<Product_Flash_Sale> allProductFlashSales = productFlashSaleService.findAll();

        for (Product_Flash_Sale productFlashSale : allProductFlashSales) {
            Flash_Sales flashSale = productFlashSale.getFlashSaleId();

            if (flashSale != null && flashSale.getEndTime() != null && flashSale.getEndTime().before(new Date())) {
                Product_Detail productDetail = productFlashSale.getProductDetail();

                if (productDetail != null) {
                    Date currentTime = new Date();

                    if (flashSale.getStartTime().before(currentTime) && flashSale.getEndTime().after(currentTime)) {

                    } else {
                        double exitPriceDiscount = productDetail.getPriceDiscount();
                        // Nếu đang trong khoảng thời gian flash sale, cập nhật giá giảm giá mới
                        double discountPercentage = (double) productFlashSale.getDiscountPercentage() / 100;
                        double newPriceDiscount = exitPriceDiscount * (1 - discountPercentage);
                        productDetail.setPriceDiscount(newPriceDiscount);
                        flashSale.setStatus(2);

                        

                    }
                    flashSalesService.update(flashSale);
                    // Cập nhật Product_Detail trong cơ sở dữ liệu
                    productDetailService.update(productDetail);
                }

                productFlashSaleService.update(productFlashSale);
                messagingTemplate.convertAndSend("/topic/products", "update");
            }
        }
    }

    @Scheduled(cron = "0 20 23 * * ?")
    public void updateExpiredFlashSalese() {
        List<Product_Flash_Sale> allProductFlashSales = productFlashSaleService.findAll();

        for (Product_Flash_Sale productFlashSale : allProductFlashSales) {
            Flash_Sales flashSale = productFlashSale.getFlashSaleId();

            if (flashSale != null && flashSale.getEndTime() != null && flashSale.getEndTime().before(new Date())) {
                Product_Detail productDetail = productFlashSale.getProductDetail();

                if (productDetail != null) {
                    Date currentTime = new Date();

                    if (flashSale.getStartTime().before(currentTime) && flashSale.getEndTime().after(currentTime)) {

                    } else {

                        double exitPriceDiscount = productDetail.getPriceDiscount();
                        double discountPercentage = (double) productFlashSale.getDiscountPercentage() / 100;
                        double newPriceDiscount = exitPriceDiscount / (1 - discountPercentage);

                        productDetail.setPriceDiscount(newPriceDiscount);

                        flashSale.setStatus(3);

                    }
                    flashSalesService.update(flashSale);

                    // Cập nhật Product_Detail trong cơ sở dữ liệu
                    productDetailService.update(productDetail);
                }

                productFlashSaleService.update(productFlashSale);
                messagingTemplate.convertAndSend("/topic/products", "update");
            }
        }
    }

}
