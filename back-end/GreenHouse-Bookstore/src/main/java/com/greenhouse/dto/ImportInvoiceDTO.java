package com.greenhouse.dto;

import java.util.List;

import com.greenhouse.model.Import_Invoice;
import com.greenhouse.model.Import_Invoice_Detail;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Discount;

import lombok.Data;

@Data
public class ImportInvoiceDTO {
    private Import_Invoice importInvoice;
    private List<Import_Invoice_Detail> importInvoiceDetails;
 
    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}

