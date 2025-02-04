package com.project.academia_hub.repository;

import com.project.academia_hub.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByStudentId(Long studentId);
}

