package com.korea.moviestar.dto;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.korea.moviestar.entity.MovieEntity;
import com.korea.moviestar.entity.ThemeEntity;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
	String movieVideo;
	String movieOverview;
	List<ActorDTO> movieActors;
	
	public MovieDTO(MovieEntity entity) {
		this.movieId = entity.getMovieId();
		this.movieName = entity.getMovieName();
		this.movieTheme = entity.getMovieThemes().stream().map(theme -> theme.getTheme().getThemeId()).collect(Collectors.toSet());
		this.movieOpDate = entity.getMovieOpDate();
		this.movieScore = entity.getMovieScore();
		this.moviePoster = entity.getMoviePoster();
		this.movieOverview = entity.getMovieOverview();
		this.movieVideo = entity.getMovieVideo();
		this.movieActors = entity.getMovieActors().stream().map(ActorDTO::new).collect(Collectors.toList());
	}
}
