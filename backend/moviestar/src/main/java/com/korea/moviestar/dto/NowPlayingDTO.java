package com.korea.moviestar.dto;

import com.korea.moviestar.entity.NowPlayingEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NowPlayingDTO {
	private int id;
	private int movieId;
	private String movieName;
	private String moviePoster;
	
	public NowPlayingDTO(NowPlayingEntity entity) {
		this.id = entity.getId();
		this.movieId = entity.getMovie().getMovieId();
		this.movieName = entity.getMovie().getMovieName();
		this.moviePoster = entity.getMovie().getMoviePoster();
	}
}
