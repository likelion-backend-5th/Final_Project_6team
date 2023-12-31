package com.example.hiddenpiece.service.follow;

import com.example.hiddenpiece.domain.entity.follow.Follow;
import com.example.hiddenpiece.domain.entity.user.User;
import com.example.hiddenpiece.domain.repository.follow.FollowRepository;
import com.example.hiddenpiece.domain.repository.user.UserRepository;
import com.example.hiddenpiece.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.example.hiddenpiece.exception.CustomExceptionCode.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class FollowService {
    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    @Transactional
    public void follow(Long toUserId, String fromUserUsername) {
        User toUser = userRepository.findById(toUserId)
                .orElseThrow(() -> new CustomException(NOT_FOUND_USER));

        User fromUser = userRepository.findByUsername(fromUserUsername)
                .orElseThrow(() -> new CustomException(NOT_FOUND_USER));

        if (followRepository.existsByToUserAndFromUser(toUser, fromUser)) {
            throw new CustomException(FOLLOW_FAILED);
        }

        if (toUser == fromUser) {
            throw new CustomException(CANNOT_FOLLOW_YOURSELF);
        }

        followRepository.save(Follow.builder()
                .fromUser(fromUser)
                .toUser(toUser).build());
    }

    @Transactional
    public void unFollow(Long toUserId, String fromUserUsername) {
        User toUser = userRepository.findById(toUserId)
                .orElseThrow(() -> new CustomException(NOT_FOUND_USER));

        User fromUser = userRepository.findByUsername(fromUserUsername)
                .orElseThrow(() -> new CustomException(NOT_FOUND_USER));

        if (!followRepository.existsByToUserAndFromUser(toUser, fromUser)) {
            throw new CustomException(UNFOLLOW_FAILED);
        }

        followRepository.deleteByToUserAndFromUser(toUser, fromUser);
    }

    // 팔로잉 카운트 세는 로직
    public int getCountOfFollowing(User fromUser) {
        return followRepository.countByFromUser(fromUser);
    }

    // 팔로워 카운트 세는 로직
    public int getCountOfFollower(User toUser) {
        return followRepository.countByToUser(toUser);
    }

    // 팔로워 카운트 오버라이드
    public int getCountOfFollower(Long toUserName) {
        User toUser = userRepository.findById(toUserName)
                .orElseThrow(() -> new CustomException(NOT_FOUND_USER));
        return followRepository.countByToUser(toUser);
    }

    public boolean isFollow(Long writerName, String username) {
        User writer = userRepository.findById(writerName)
                .orElseThrow(() -> new CustomException(NOT_FOUND_USER));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(NOT_FOUND_USER));
        return followRepository.existsByToUserAndFromUser(writer, user);
    }
}
