package com.korea.moviestar.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
	private int reviewId;
	private int movieId;
	private int userId;
	private int reviewRating;
	private String reviewContent;
	private Date reviewDate;
}
