package com.avernet.myworkoutapi.history.stats;

import java.time.LocalDateTime;

public record HistoryPoint(Float weight, LocalDateTime date) {
}
