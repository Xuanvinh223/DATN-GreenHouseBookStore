package com.greenhouse.controller.AdminController;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class AdminController {
    @RequestMapping({ "/admin", "/admin/index" })
    public String adminPage(Model m) {
        return "redirect:/admin/index.html";
    }
}
