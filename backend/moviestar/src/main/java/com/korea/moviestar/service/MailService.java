package com.korea.moviestar.service;

import java.time.LocalDateTime;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.korea.moviestar.entity.MailVerificationEntity;
import com.korea.moviestar.repo.MailVerificationRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MailService {
	private final JavaMailSender emailSender;
	private final MailVerificationRepository repository;

    public void sendEmail(String toEmail,
                          String title,
                          String text) {
        SimpleMailMessage emailForm = createEmailForm(toEmail, title, text);
        try {
            emailSender.send(emailForm);
        } catch (RuntimeException e) {
            log.debug("MailService.sendEmail exception occur toEmail: {}, " +
                    "title: {}, text: {}", toEmail, title, text);
            throw new RuntimeException("이메일 발송에 실패하였습니다.");
        }
    }

    // 발신할 이메일 데이터 세팅
    private SimpleMailMessage createEmailForm(String toEmail,
                                             String title,
                                             String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(title);
        message.setText(text);

        return message;
    }
    
    public void sendVerificationCode(String email) {
        String code = Integer.toString((int)(Math.random() * 900000) + 100000);
        
        MailVerificationEntity entity = MailVerificationEntity.builder()
        		.code(code)
        		.email(email)
        		.expiresAt(LocalDateTime.now().plusMinutes(10))
        		.build();
        repository.save(entity);
        
        String message = "이메일 인증을 위해 아래 코드를 입력하세요:\n\n" + code;
        sendEmail(email, "이메일 인증 코드", message);
    }
    
    public boolean verifyCode(String email, String inputCode) {
        MailVerificationEntity entity = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("인증 요청이 없습니다."));

        if (entity.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("인증 코드가 만료되었습니다.");
        }

        if (!entity.getCode().equals(inputCode)) {
            throw new RuntimeException("인증 코드가 일치하지 않습니다.");
        }

        repository.delete(entity);
        return true;
    }
    
    
}
