package com.korea.moviestar.dto;


import com.korea.moviestar.entity.ThemeEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThemeDTO {
	private int id;
	private String name;
	
	public static ThemeEntity toEntity(ThemeDTO dto) {
		return ThemeEntity.builder().themeId(dto.getId()).themeName(dto.getName()).build();
	}
}
