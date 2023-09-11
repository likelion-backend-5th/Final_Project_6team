package com.example.hiddenpiece.domain.dto.community.article;
import com.example.hiddenpiece.domain.dto.community.comment.CommentResponseDto;
import com.example.hiddenpiece.domain.dto.community.image.ArticleImageResponseDto;
import com.example.hiddenpiece.domain.entity.community.ArticleType;
import com.example.hiddenpiece.domain.entity.community.Category;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ArticleResponseDto {
    private Long articleId;
    private String username;
    private String title;
    private String content;
    private Category category;
    private ArticleType type;
    private int likeCount;
    private List<ArticleImageResponseDto> images;
    private List<CommentResponseDto> comments;
    private LocalDateTime createdAt;
    private LocalDateTime lastModifiedAt;
    private int viewCount;

    @JsonProperty("isWriter")
    private boolean isWriter;

    @JsonProperty("isLike")
    private boolean isLike;

    @JsonProperty("isFollow")
    private boolean isFollow;

    @JsonProperty("isBookmark")
    private boolean isBookmark;
}
