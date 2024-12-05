package com.korea.moviestar.dto;

import java.util.Date;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieDTO {
	int movieId;
	String movieName;
	Set<Integer> movieTheme;
	String movieOpDate;
	double movieScore;
	String moviePoster;
	String movieOverview;
	Set<Integer> movieActors;
}
