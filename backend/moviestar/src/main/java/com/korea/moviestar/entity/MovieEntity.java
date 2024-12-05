package com.korea.moviestar.entity;

import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "movie")
public class MovieEntity {
	@Id
	int movieId;
	String movieName;
	Set<Integer> movieTheme;
	String movieOpDate;
	double movieScore;
	String moviePoster;
	String movieOverview;
	Set<Integer> movieActors;
}
