package com.pickles.buylist.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.pickles.buylist.model.Item;
import com.pickles.buylist.repository.ItemRepository;


@RestController
public class ItemController
{
	@Autowired
	ItemRepository itemRepository;

	// Get all items
	@GetMapping("/items")
	public List<Item> getItems()
	{
		Iterable<Item> result = itemRepository.findAll();
		List<Item> itemsList = new ArrayList<Item>();
		result.forEach(itemsList::add);
		return itemsList;
	}

	// Get item passing id
	@GetMapping("/item/{id}")
	public Optional<Item> getItem(@PathVariable String id)
	{
		Optional<Item> emp = itemRepository.findById(id);
		return emp;
	}

	// Delete item passing id
	@DeleteMapping(value = "/item/{id}", produces = "application/json; charset=utf-8")
	public String deleteItem(@PathVariable String id) {
		Boolean result = itemRepository.existsById(id);
		itemRepository.deleteById(id);
		return "{ \"success\" : "+ (result ? "true" : "false") +" }";
	}

	// Post item (update existing id)
	@PostMapping("/item")
	public Item addItem(Item newItem)
	{
		Item emp = new Item(newItem.getId(), newItem.getName(), newItem.getDone(), newItem.getCreatedAt());
		itemRepository.save(emp);
		return emp;
	}
}
