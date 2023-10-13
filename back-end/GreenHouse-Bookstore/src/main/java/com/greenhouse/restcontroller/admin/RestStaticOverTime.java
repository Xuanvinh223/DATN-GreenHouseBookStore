package com.greenhouse.restcontroller.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.model.InvoiceDetails;
import com.greenhouse.model.Invoices;
import com.greenhouse.model.Products;
import com.greenhouse.repository.InvoiceDetailsRepository;
import com.greenhouse.repository.InvoicesRepository;

@RestController
@CrossOrigin("*")
public class RestStaticOverTime {

    @Autowired
    InvoiceDetailsRepository ind;
    @Autowired
    InvoicesRepository iv;

    @GetMapping(value = "/rest/static_overtime")
    public ResponseEntity<Map<String, Object>> getInvoices() {
        Map<String, Object> resp = new HashMap<>();
        List<InvoiceDetails> invoiceDetails = ind.findAll();
        List<Invoices> invoice = iv.findAll();

        resp.put("invoice", invoice);
        resp.put("invoiceDetail", invoiceDetails);
        return ResponseEntity.ok(resp);
    }


}
