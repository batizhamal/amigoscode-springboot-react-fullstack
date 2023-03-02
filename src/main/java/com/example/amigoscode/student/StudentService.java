package com.example.amigoscode.student;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public void addStudent(Student student) {
        if (studentRepository.selectExistsEmail(student.getEmail())) {
            throw new IllegalStateException("The email is already taken");
        }
        studentRepository.save(student);
    }

    public void deleteStudet(Long id) {
        if (studentRepository.findById(id).isEmpty()) {
            throw new IllegalStateException("The student with id " + id + " does not exist.");
        }
        studentRepository.deleteById(id);
    }
}
