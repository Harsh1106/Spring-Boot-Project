package com.voting.votingapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.ArrayList;

@Entity
@Data
@NoArgsConstructor
public class Poll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String question;

    @ElementCollection//it will create a separate table to store the options using id and options
    //on using this we don't need to create a separate entity for options
    private List<OptionVote> options = new ArrayList<>();


}
