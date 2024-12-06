package com.korea.moviestar.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.korea.moviestar.dto.PopularDTO;
import com.korea.moviestar.dto.UserDTO;
import com.korea.moviestar.entity.ActorEntity;
import com.korea.moviestar.entity.MovieEntity;
import com.korea.moviestar.entity.PopularEntity;
import com.korea.moviestar.entity.ThemeEntity;
import com.korea.moviestar.repo.MovieRepository;
import com.korea.moviestar.repo.PopularRepository;
import com.korea.moviestar.repo.ThemeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovieService {
	@Value("${tmdb.api.key}")
	private String apiKey;
	
	private final RestTemplate restTemplate = new RestTemplate();
	private final String BASE_URL = "https://api.themoviedb.org/3";
	
	private final MovieRepository movies;
	private final ThemeRepository themes;
	private final PopularRepository populars;
	
	public List<ThemeEntity> themeList(){
		
		return themes.findAll();
	}
	
	public List<ThemeEntity> getThemes(){
		Map<String, Object> response = restTemplate.getForObject(BASE_URL + "/genre/movie/list?api_key=" + apiKey , Map.class);
		List<Map<String, Object>> genres = (List<Map<String, Object>>) response.get("genres");
		for(Map<String, Object> genre : genres) {
			int id = (int) genre.get("id");
	        String name = (String) genre.get("name");
	        
	        if(!themes.existsById(id)) {
	        	themes.save(new ThemeEntity(id,name));
	        }
		}
		return themeList();
	}
	
	public MovieEntity getMovie(int movieId){
		Map<String, Object> response = restTemplate.getForObject(BASE_URL + "/movie/"+movieId+"?api_key=" + apiKey +"&language=ko-KR", Map.class);
		
		List<Map<String, Object>> genres = (List<Map<String, Object>>) response.get("genres");
	    Set<ThemeEntity> themeEntities = genres.stream()
	            .map(genre -> ThemeEntity.builder()
	                    .themeId((Integer) genre.get("id"))
	                    .themeName((String) genre.get("name"))
	                    .build())
	            .collect(Collectors.toSet());
	    
	    Map<String, Object> creditResponse = restTemplate.getForObject(BASE_URL + "/movie/"+movieId+"/credits?api_key=" + apiKey +"&language=ko-KR", Map.class);
	    List<Map<String, Object>> actorList = (List<Map<String, Object>>) creditResponse.get("cast");
	    List<ActorEntity> actorEntities = actorList.stream()
	    		.map(actor -> ActorEntity.builder()
	    				.actorName((String)actor.get("name"))
	    				.actorRole((String)actor.get("character"))
	    				.actorImage((String)actor.get("profile_path"))
	    				.build())
	    		.collect(Collectors.toList());
	    
		MovieEntity entity = MovieEntity.builder()
			.movieId(movieId)
			.movieName((String)response.get("title"))
			.movieTheme(themeEntities)
			.movieOpDate((String)response.get("release_date"))
			.movieScore((double)response.get("vote_average"))
			.moviePoster((String)response.get("poster_path"))
			.movieOverview((String)response.get("overview"))
			.movieActors(actorEntities)
			.build();
		return movies.save(entity);
	}
	
	public List<PopularDTO> getPopular(){
		populars.truncatePopular();
		Map<String, Object> response = restTemplate.getForObject(BASE_URL + "/movie/popular?api_key=" + apiKey +"&language=ko-KR", Map.class);
		List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
		for(Map<String, Object> movie : results) {
			int movieId = (int) movie.get("id");
			populars.save(PopularEntity.builder().movie(getMovie(movieId)).build());
		}
		List<PopularEntity> entities = populars.findAll();
		return entities.stream().map(PopularDTO::new).collect(Collectors.toList());
	}
}
