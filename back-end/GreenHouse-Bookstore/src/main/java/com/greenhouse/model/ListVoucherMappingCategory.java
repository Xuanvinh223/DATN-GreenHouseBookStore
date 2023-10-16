package com.greenhouse.model;

import lombok.Data;

import java.util.List;

@Data
public class ListVoucherMappingCategory {

    private int voucherId;

    private List<String> categoryIdVoucher;
}
