package com.avernet.myworkoutapi.gemini;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GeminiService {

    private final Client client;

    public String generatePrompt(String prompt) {
        GenerateContentResponse response =
            client.models.generateContent("gemini-2.5-flash", prompt, null);

        return response.text();
    }
}
