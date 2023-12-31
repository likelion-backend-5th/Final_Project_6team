package com.example.hiddenpiece.domain.entity.roadmap;

import com.example.hiddenpiece.domain.dto.roadmap.RequestRoadmapDto;
import com.example.hiddenpiece.domain.entity.BaseTimeEntity;
import com.example.hiddenpiece.domain.entity.bookmark.RoadmapBookmark;
import com.example.hiddenpiece.domain.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
@SQLDelete(sql = "UPDATE roadmaps SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@Where(clause = "deleted_at is null")
@Table(name = "roadmaps")
public class Roadmap extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String type;
    private String title;
    private String description;

    private LocalDateTime deletedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "roadmap", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<RoadmapBookmark> roadmapBookmarks = new ArrayList<>();

    @Builder
    public Roadmap(Long id, User user, String type, String title, String description) {
        this.id = id;
        this.user = user;
        this.type = type;
        this.title = title;
        this.description = description;
    }

    public void update(RequestRoadmapDto dto) {
        this.type = dto.getType();
        this.title = dto.getTitle();
        this.description = dto.getDescription();
    }

    public void addRoadmapBookmarks(RoadmapBookmark roadmapBookmark) {
        roadmapBookmark.setRoadmap(this);
        this.roadmapBookmarks.add(roadmapBookmark);
    }
}
