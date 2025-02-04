package com.project.academia_hub.service;

import com.project.academia_hub.model.User;
import com.project.academia_hub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {
    private final UserRepository userRepository;

    public StudentService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllStudents() {
        return userRepository.findByRole("STUDENT");
    }

    public User getStudentById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!"STUDENT".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("User is not a student");
        }
        return user;
    }

    public User createStudent(User student) {
        student.setRole("STUDENT");
        student.setPassword("123456");
        return userRepository.save(student);
    }

    public User updateStudent(Long id, User updatedStudent) {
        User existingStudent = getStudentById(id);
        existingStudent.setUsername(updatedStudent.getUsername());
        existingStudent.setEmail(updatedStudent.getEmail());
        existingStudent.setPhoneNumber(updatedStudent.getPhoneNumber());
        return userRepository.save(existingStudent);
    }

    public void deleteStudent(Long id) {
        User student = getStudentById(id);
        userRepository.delete(student);
    }

    public List<User> searchAndFilterStudents(String name, String email) {
        List<User> students = userRepository.findByRole("STUDENT");
        if (name != null && !name.isEmpty()) {
            students = students.stream()
                    .filter(student -> student.getUsername().toLowerCase().contains(name.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (email != null && !email.isEmpty()) {
            students = students.stream()
                    .filter(student -> student.getEmail().toLowerCase().contains(email.toLowerCase()))
                    .collect(Collectors.toList());
        }
        return students;
    }

    // New method to get a student by username
    public User getStudentByUsername(String username) {
        // Use the Optional properly
        Optional<User> userOptional = userRepository.findByUsername(username);

        // Check if the user is present and their role is STUDENT
        if (userOptional.isPresent() && "STUDENT".equalsIgnoreCase(userOptional.get().getRole())) {
            return userOptional.get();
        } else {
            throw new RuntimeException("Student not found or not a student");
        }
    }


}
