package com.greenhouse.service;

import com.greenhouse.model.Book_Authors;

import java.util.List;

public interface BookAuthorsService {

    List<Book_Authors> findAll();

    Book_Authors findById(Integer id);

    Book_Authors add(Book_Authors entity);

    Book_Authors update(Book_Authors entity);

    void delete(Integer id);
}
