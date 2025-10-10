package com.harsh.emailsender;

import java.io.File;

public interface EmailService {

    //send email to single person
    void sendEmail(String to, String subject, String message);

    //send email to multiple people
    void sendEmail(String[] to, String subject, String message);

    //void sendEmailWithHtml
    void sendEmailWithHtml(String to, String subject, String htmlContent);

    //void send email with file
    void sendEmailWithFile(String to, String subject, String message, File filePath);



}
