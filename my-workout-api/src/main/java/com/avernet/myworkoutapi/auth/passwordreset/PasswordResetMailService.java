package com.avernet.myworkoutapi.auth.passwordreset;

import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetMailService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetMailService.class);

    @Resource
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    @Value("${allowed.origin}")
    private String allowedOrigin;

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        String link = allowedOrigin + "/auth/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("Réinitialisation de votre mot de passe My Workout");
        message.setText("""
            Vous avez demandé la réinitialisation de votre mot de passe.

            Cliquez sur le lien suivant pour choisir un nouveau mot de passe (valable 15 minutes) :
            %s

            Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
            """.formatted(link));

        try {
            mailSender.send(message);
        } catch (MailException e) {
            logger.error("Échec de l'envoi de l'email de réinitialisation de mot de passe", e);
        }
    }
}
