package com.example.amigoscode.student;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @GetMapping
    public List<Student> getAllStudents() {
        List<Student> students = Arrays.asList(
                new Student(
                        1L,
                        "Bati",
                        "bati@gmail.com",
                        Gender.FEMALE
                ),
                new Student(
                        2L,
                        "Pati",
                        "pati@gmail.com",
                        Gender.FEMALE
                )
        );
        return students;
    }
}
