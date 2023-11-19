package com.greenhouse.util;

import java.io.IOException;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.greenhouse.model.Discounts;
import com.greenhouse.service.DiscountsService;

@Service
public class FileUploadService {

    @Autowired
    private DiscountsService discountsService;

    public void processExcelFile(MultipartFile file) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0); // Assuming data is in the first sheet

            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    // Skip header row
                    continue;
                }

                Discounts discount = new Discounts();
                discount.setDiscountId((int) row.getCell(0).getNumericCellValue());
                discount.setValue((int) row.getCell(1).getNumericCellValue());
                // Đọc và thiết lập các giá trị khác từ cột tương ứng
                // ...

                // Lưu ưu đãi vào cơ sở dữ liệu
                discountsService.add(discount);
            }
        }
    }
}
