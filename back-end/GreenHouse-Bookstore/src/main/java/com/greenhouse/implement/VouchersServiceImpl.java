package com.greenhouse.implement;

import com.greenhouse.model.Vouchers;
import com.greenhouse.repository.VouchersRepository;
import com.greenhouse.service.VouchersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VouchersServiceImpl implements VouchersService {

    @Autowired
    private VouchersRepository vouchersRepository;

    @Override
    public List<Vouchers> findAll() {
        return vouchersRepository.findAll();
    }

    @Override
    public Vouchers findById(Integer voucherId) {
        Optional<Vouchers> result = vouchersRepository.findById(voucherId);
        return result.orElse(null);
    }

    @Override
    public void add(Vouchers voucher) {
        vouchersRepository.save(voucher);
    }

    @Override
    public void update(Vouchers voucher) {
        vouchersRepository.save(voucher);
    }

    @Override
    public void delete(Integer voucherId) {
        vouchersRepository.deleteById(voucherId);
    }
}
