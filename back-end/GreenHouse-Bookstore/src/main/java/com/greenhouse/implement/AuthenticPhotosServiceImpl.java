package com.greenhouse.implement;

import com.greenhouse.model.Authentic_Photos;
import com.greenhouse.repository.AuthenticPhotosRepository;
import com.greenhouse.service.AuthenticPhotosService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthenticPhotosServiceImpl implements AuthenticPhotosService {

  
    @Autowired
    AuthenticPhotosRepository authenticPhotosRepository;

    public List<Authentic_Photos> findAll() {
        return authenticPhotosRepository.findAll();
    }

    public Authentic_Photos findById(Integer authenticPhotoId) {
        Optional<Authentic_Photos> result = authenticPhotosRepository.findById(authenticPhotoId);
        return result.orElse(null);
    }

    public void add(Authentic_Photos authenticPhotos) {
        authenticPhotosRepository.save(authenticPhotos);
    }

    public void update(Authentic_Photos authenticPhotos) {
        authenticPhotosRepository.save(authenticPhotos);
    }

    public void delete(Integer authenticPhotoId) {
        authenticPhotosRepository.deleteById(authenticPhotoId);
    }
}
