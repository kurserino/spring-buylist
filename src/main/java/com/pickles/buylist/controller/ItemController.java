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

	@GetMapping(value = "/healthcheck", produces = "application/json; charset=utf-8")
	public String getHealthCheck()
	{
		return "{ \"isWorking\" : true }";
	}

	@GetMapping("/items")
	public List<Item> getItems()
	{
		Iterable<Item> result = itemRepository.findAll();
		List<Item> itemsList = new ArrayList<Item>();
		result.forEach(itemsList::add);
		return itemsList;
	}

	@GetMapping("/item/{id}")
	public Optional<Item> getItem(@PathVariable String id)
	{
		Optional<Item> emp = itemRepository.findById(id);
		return emp;
	}

	@PutMapping("/item/{id}")
	public Optional<Item> updateItem(@RequestBody Item newItem, @PathVariable String id)
	{
		Optional<Item> optionalEmp = itemRepository.findById(id);
		if (optionalEmp.isPresent()) {
			Item emp = optionalEmp.get();
			emp.setName(newItem.getName());
			emp.setDone(newItem.getDone());
			emp.setCreatedAt(newItem.getCreatedAt());
			itemRepository.save(emp);
		}
		return optionalEmp;
	}

	@DeleteMapping(value = "/item/{id}", produces = "application/json; charset=utf-8")
	public String deleteItem(@PathVariable String id) {
		Boolean result = itemRepository.existsById(id);
		itemRepository.deleteById(id);
		return "{ \"success\" : "+ (result ? "true" : "false") +" }";
	}

	@PostMapping("/item")
	public Item addItem(@RequestBody Item newItem)
	{
		String id = String.valueOf(new Random().nextInt());
		Item emp = new Item(id, newItem.getName(), newItem.getDone(), newItem.getCreatedAt());
		itemRepository.save(emp);
		return emp;
	}
}
