package com.example.hiddenpiece.domain.repository.roadmap;

import com.example.hiddenpiece.domain.entity.roadmap.Roadmap;
import com.example.hiddenpiece.domain.entity.roadmap.RoadmapBookmark;
import com.example.hiddenpiece.domain.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoadmapBookmarkRepository extends JpaRepository<RoadmapBookmark, Long> {
    RoadmapBookmark findByUserAndRoadmap(User user, Roadmap roadmap);

    boolean existsByUserAndRoadmap(User user, Roadmap roadmap);
}
