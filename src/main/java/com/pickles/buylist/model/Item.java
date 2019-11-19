package com.pickles.buylist.model;

import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@AllArgsConstructor
@Getter @Setter
@Table
public class Item {
	@PrimaryKey
	private @NonNull String id;
	private @NonNull String name;
	private @NonNull String done;
	private @NonNull String createdAt;
}
