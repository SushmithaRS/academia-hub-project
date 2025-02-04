package com.project.academia_hub.controller;

import com.project.academia_hub.model.Document;
import com.project.academia_hub.model.User;
import com.project.academia_hub.service.FileService;
import com.project.academia_hub.service.LogService;
import com.project.academia_hub.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {
    private final StudentService studentService;
    private final FileService fileService;
    private final LogService logService; // Inject LogService

    public StudentController(StudentService studentService, FileService fileService, LogService logService) {
        this.studentService = studentService;
        this.fileService = fileService;
        this.logService = logService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> students = studentService.getAllStudents();
        logService.logAction("ADMIN", "Fetch All Students", "Fetched " + students.size() + " students", LocalDateTime.now());
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getStudentById(@PathVariable Long id) {
        User student = studentService.getStudentById(id);
        if (student == null) {
            logService.logAction("ADMIN", "Student Lookup Failed", "Student with ID " + id + " not found", LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        logService.logAction("ADMIN", "Fetch Student", "Fetched details for student ID " + id, LocalDateTime.now());
        return ResponseEntity.ok(student);
    }

    @PostMapping
    public ResponseEntity<User> createStudent(@RequestBody User student) {
        User createdStudent = studentService.createStudent(student);
        logService.logAction(student.getUsername(), "Student Registration", "Student registered successfully", LocalDateTime.now());
        return ResponseEntity.ok(createdStudent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateStudent(@PathVariable("id") Long id, @RequestBody User student) {
        User updatedStudent = studentService.updateStudent(id, student);
        logService.logAction(student.getUsername(), "Student Update", "Updated student details", LocalDateTime.now());
        return ResponseEntity.ok(updatedStudent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable("id") Long id) {
        studentService.deleteStudent(id);
        logService.logAction("ADMIN", "Delete Student", "Deleted student with ID " + id, LocalDateTime.now());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchAndFilterStudents(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "email", required = false) String email) {
        List<User> filteredStudents = studentService.searchAndFilterStudents(name, email);
        logService.logAction("ADMIN", "Search Students", "Searched students by name: " + name + ", email: " + email, LocalDateTime.now());
        return ResponseEntity.ok(filteredStudents);
    }

    @GetMapping("/with-documents/{username}")
    public ResponseEntity<Object> getStudentWithDocuments(@PathVariable String username) {
        try {
            User student = studentService.getStudentByUsername(username);

            if (student == null || !"STUDENT".equalsIgnoreCase(student.getRole())) {
                logService.logAction(username, "Student Lookup Failed", "Student not found", LocalDateTime.now());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
            }

            List<Document> documents = (List<Document>) fileService.getDocumentsByStudentId(student.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("student", student);
            response.put("documents", documents);

            logService.logAction(username, "Fetch Student Documents", "Fetched documents for student", LocalDateTime.now());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logService.logAction(username, "Error Fetching Student", "Error occurred while retrieving student details", LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving student details");
        }
    }
}
