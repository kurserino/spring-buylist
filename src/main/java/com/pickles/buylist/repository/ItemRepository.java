package com.pickles.buylist.repository;

import org.springframework.data.repository.CrudRepository;

import com.pickles.buylist.model.Item;

public interface ItemRepository extends CrudRepository<Item, String> {
}
