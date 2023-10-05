package com.greenhouse.dto;

import java.util.List;

import com.greenhouse.model.ImportInvoice;
import com.greenhouse.model.ImportInvoiceDetail;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Discount;

import lombok.Data;

@Data
public class ImportInvoiceDTO {
    private ImportInvoice importInvoice;
    private List<ImportInvoiceDetail> importInvoiceDetails;
 
    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}

