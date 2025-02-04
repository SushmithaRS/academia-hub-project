package com.project.academia_hub.controller;

import com.project.academia_hub.model.Document;
import com.project.academia_hub.service.FileService;
import com.project.academia_hub.service.LogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/documents")
public class DocumentController {

    private final FileService fileService;
    private final LogService logService; // Inject LogService

    public DocumentController(FileService fileService, LogService logService) {
        this.fileService = fileService;
        this.logService = logService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFiles(
            @Valid @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "studentId", required = false) Long studentId
    ) {
        try {
            if (studentId == null) {
                logService.logAction("SYSTEM", "File Upload Failed", "Student ID is required.", LocalDateTime.now());
                return ResponseEntity.badRequest().body("Student ID is required.");
            }

            List<String> fileNames = Arrays.stream(files).map(MultipartFile::getOriginalFilename).collect(Collectors.toList());
            fileService.saveFiles(files, studentId);

            logService.logAction("STUDENT_" + studentId, "File Upload", "Uploaded files: " + fileNames, LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.CREATED).body("Document uploaded successfully.");
        } catch (IOException e) {
            logService.logAction("STUDENT_" + studentId, "File Upload Error", "Failed to upload files: " + e.getMessage(), LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload files: " + e.getMessage());
        }
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<Iterable<Document>> getDocumentsByStudentId(@PathVariable Long studentId) {
        try {
            Iterable<Document> documents = fileService.getDocumentsByStudentId(studentId);

            logService.logAction("STUDENT_" + studentId, "Fetch Documents", "Fetched " + ((List<?>) documents).size() + " documents", LocalDateTime.now());
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            logService.logAction("STUDENT_" + studentId, "Fetch Documents Error", "Failed to fetch documents: " + e.getMessage(), LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @DeleteMapping("/{documentId}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long documentId) {
        try {
            Document document = fileService.getDocumentById(documentId);
            if (document == null) {
                logService.logAction("SYSTEM", "Delete Document Failed", "Document ID " + documentId + " not found.", LocalDateTime.now());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found.");
            }

            fileService.deleteDocument(documentId);

            logService.logAction("STUDENT_" + document.getStudentId(), "Delete Document", "Deleted document: " + document.getFileName(), LocalDateTime.now());
            return ResponseEntity.ok("Document deleted successfully.");
        } catch (Exception e) {
            logService.logAction("SYSTEM", "Delete Document Error", "Failed to delete document ID " + documentId + ": " + e.getMessage(), LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete document: " + e.getMessage());
        }
    }
}
