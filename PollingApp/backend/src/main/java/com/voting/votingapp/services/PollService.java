package com.voting.votingapp.services;

import com.voting.votingapp.entity.OptionVote;
import com.voting.votingapp.entity.Poll;
import com.voting.votingapp.repositories.PollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PollService {
    @Autowired
    private PollRepository pollRepository;

    public Poll createPoll(Poll poll) {
        return pollRepository.save(poll);
    }

    public List<Poll> getAllPolls() {
        return pollRepository.findAll();
    }

    public Optional<Poll> getPollById(Long id) {
        return pollRepository.findById(id);
    }

    public void vote(Long pollId, int optionIndex) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found")); // get poll from db using pollId
        List<OptionVote> options = poll.getOptions(); // get all options
        if(optionIndex < 0 || optionIndex >= options.size()){
            // if index for vote is not valid, throw error
            throw new IllegalArgumentException("Invalid option index");
        }
        OptionVote selectedOption = options.get(optionIndex); // get selected option
        selectedOption.setVoteCount(selectedOption.getVoteCount() + 1); // increment vote count for selected option
        pollRepository.save(poll); // save incremented option to db
    }
}
