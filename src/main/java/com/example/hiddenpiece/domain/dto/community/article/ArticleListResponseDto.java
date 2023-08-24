package com.example.hiddenpiece.domain.dto.community.article;
import com.example.hiddenpiece.domain.entity.community.Article;
import com.example.hiddenpiece.domain.entity.community.ArticleType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ArticleListResponseDto {
    private Long id;
    private String username;
    private String title;
    private ArticleType type;
    private int likeCount;

    public ArticleListResponseDto(Article entity) {
        this.id = entity.getId();
        this.username = entity.getUser().getUsername();
        this.title = entity.getTitle();
        this.type = entity.getType();
        this.likeCount = entity.getLikeArticles().size();
    }
}