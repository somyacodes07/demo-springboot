package com.example.student_management;

import com.example.student_management.entity.Student;
import com.example.student_management.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class StudentControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private StudentRepository studentRepository;

    private RestClient restClient;

    @BeforeEach
    void setUp() {
        studentRepository.deleteAll();
        restClient = RestClient.builder()
                .baseUrl("http://localhost:" + port + "/api/students")
                .build();
    }

    @Test
    void testCreateAndGetStudent() {
        Student newStudent = new Student("Alice Johnson", "alice@example.com", "Computer Science", 92);

        ResponseEntity<Student> createResponse = restClient.post()
                .body(newStudent)
                .retrieve()
                .toEntity(Student.class);

        assertEquals(HttpStatus.CREATED, createResponse.getStatusCode());
        assertNotNull(createResponse.getBody());
        assertNotNull(createResponse.getBody().getId());
        assertEquals("Alice Johnson", createResponse.getBody().getName());

        Long studentId = createResponse.getBody().getId();

        // Get by ID
        ResponseEntity<Student> getResponse = restClient.get()
                .uri("/" + studentId)
                .retrieve()
                .toEntity(Student.class);

        assertEquals(HttpStatus.OK, getResponse.getStatusCode());
        assertEquals("alice@example.com", getResponse.getBody().getEmail());
    }

    @Test
    void testUpdateStudent() {
        Student student = studentRepository.save(new Student("Bob Smith", "bob@example.com", "Mathematics", 75));

        Student updateDetails = new Student("Bob Smith Jr.", "bob.jr@example.com", "Data Science", 88);

        ResponseEntity<Student> updateResponse = restClient.put()
                .uri("/" + student.getId())
                .body(updateDetails)
                .retrieve()
                .toEntity(Student.class);

        assertEquals(HttpStatus.OK, updateResponse.getStatusCode());
        assertEquals("Bob Smith Jr.", updateResponse.getBody().getName());
        assertEquals(88, updateResponse.getBody().getMarks());
        assertEquals("Data Science", updateResponse.getBody().getCourse());
    }

    @Test
    void testDeleteStudent() {
        Student student = studentRepository.save(new Student("Charlie Brown", "charlie@example.com", "Physics", 80));

        ResponseEntity<Map> deleteResponse = restClient.delete()
                .uri("/" + student.getId())
                .retrieve()
                .toEntity(Map.class);

        assertEquals(HttpStatus.OK, deleteResponse.getStatusCode());
        assertFalse(studentRepository.findById(student.getId()).isPresent());
    }

    @Test
    void testSearchByCourse() {
        studentRepository.save(new Student("David", "david@example.com", "Biology", 82));
        studentRepository.save(new Student("Emma", "emma@example.com", "Biology", 91));
        studentRepository.save(new Student("Frank", "frank@example.com", "Chemistry", 74));

        Student[] biologyStudents = restClient.get()
                .uri(uriBuilder -> uriBuilder.queryParam("course", "Biology").build())
                .retrieve()
                .body(Student[].class);

        assertNotNull(biologyStudents);
        assertEquals(2, biologyStudents.length);
    }
}
