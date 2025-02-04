package com.project.academia_hub.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;


@Entity
@Data
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Student ID is required")
    @Column(nullable = false)
    private Long studentId;

    @NotBlank(message = "File name cannot be empty")
    @Size(min = 3, max = 100, message = "File name must be between 3 and 100 characters")
    @Column(nullable = false)
    private String fileName;

    @NotBlank(message = "File path is required")
    @Column(nullable = false)
    private String filePath;

    @PastOrPresent(message = "Upload time cannot be in the future")
    @Column(nullable = false)
    private LocalDateTime uploadTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadTime() {
        return uploadTime;
    }

    public void setUploadTime(LocalDateTime uploadTime) {
        this.uploadTime = uploadTime;
    }
}
