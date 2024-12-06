package com.korea.moviestar.entity;

import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
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
	private int movieId;
	private String movieName;
	@ManyToMany
	@JoinTable(
			name = "movie_theme_table",
			joinColumns = @JoinColumn(name="movie_id"),
			inverseJoinColumns = @JoinColumn(name = "theme_id")
	)
	private Set<ThemeEntity> movieTheme;
	private String movieOpDate;
	private double movieScore;
	private String moviePoster;
	@Column(length = 65535, columnDefinition = "TEXT")
	private String movieOverview;
	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "movie_id")
	private List<ActorEntity> movieActors;
}
