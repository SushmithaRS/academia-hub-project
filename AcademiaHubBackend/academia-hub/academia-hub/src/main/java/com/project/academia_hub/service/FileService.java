package com.project.academia_hub.service;

import com.project.academia_hub.model.Document;
import com.project.academia_hub.repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class FileService {

    private final String uploadDir = "uploads/";
    private final DocumentRepository documentRepository;

    public FileService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public void saveFiles(MultipartFile[] files, Long studentId) throws IOException {
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                // Generate file path
                Path filePath = Paths.get(uploadDir + studentId + "/" + file.getOriginalFilename());

                // Create directories if they don't exist
                Files.createDirectories(filePath.getParent());

                // Save file to disk
                Files.write(filePath, file.getBytes());

                // Save document metadata to the database
                Document document = new Document();
                document.setStudentId(studentId);
                document.setFileName(file.getOriginalFilename());
                document.setFilePath(filePath.toString());
                document.setUploadTime(LocalDateTime.now());
                documentRepository.save(document);
            }
        }
    }

    public Iterable<Document> getDocumentsByStudentId(Long studentId) {
        return documentRepository.findAll()
                .stream()
                .filter(doc -> doc.getStudentId().equals(studentId))
                .toList();
    }

    // New delete method
    public void deleteDocument(Long documentId) throws IOException {
        Optional<Document> documentOptional = documentRepository.findById(documentId);

        if (documentOptional.isPresent()) {
            Document document = documentOptional.get();
            Path filePath = Paths.get(document.getFilePath());

            // Delete file from storage
            Files.deleteIfExists(filePath);

            // Remove document record from database
            documentRepository.deleteById(documentId);
        } else {
            throw new IOException("Document not found.");
        }
    }

    // Fetch a document by its ID
    public Document getDocumentById(Long documentId) {
        return documentRepository.findById(documentId).orElse(null);
    }
}
