package com.avernet.myworkoutapi.config;

import java.util.List;

public interface GenericMapper<D, E> {
    D toDto(E entity);

    List<D> toDtoList(List<E> muscleGroupEntityList);

    E toEntity(D muscleGroup);

    List<E> toEntityList(List<D> muscleGroupEntityList);
}
