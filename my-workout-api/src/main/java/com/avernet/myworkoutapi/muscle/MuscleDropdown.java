package com.avernet.myworkoutapi.muscle;

import java.util.List;

public record MuscleDropdown(String label, String value, List<Item> items) {
}

record Item(Long id, String name) {
}
