package com.example.student_management.entity;

import jakarta.persistence.*;
import jakarat.validation.constraints.NotBlank;
import jakarat.validation.constraints.Email;
import jakarat.validation.constraints.Max;
import jakarat.validation.constraints.Min;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is mandatory")
    @Column(name = "name")
    private String name;
}
