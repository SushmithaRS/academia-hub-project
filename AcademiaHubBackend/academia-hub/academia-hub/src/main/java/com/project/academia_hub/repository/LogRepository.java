package com.project.academia_hub.repository;

import com.project.academia_hub.model.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LogRepository extends JpaRepository<Log, Long> {
    @Query("SELECT action, COUNT(*) FROM Log GROUP BY action")
    List<Object[]> countLogsByAction();
}
