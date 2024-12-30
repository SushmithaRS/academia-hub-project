package com.project.academia_hub.service;

import com.project.academia_hub.model.User;
import com.project.academia_hub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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
            if (!"STUDENT".equals(user.getRole())) {
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
            existingStudent.setEmail(updatedStudent.getPhoneNumber());
            return userRepository.save(existingStudent);
        }

        public void deleteStudent(Long id) {
            User student = getStudentById(id);
            userRepository.delete(student);
        }
    }


