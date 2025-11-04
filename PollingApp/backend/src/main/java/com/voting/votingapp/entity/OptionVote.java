package com.voting.votingapp.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Embeddable //to make this class as a part of another entity
public class OptionVote {
    private String voteOption;
    private Long voteCount = 0L;
}
