package com.kirill.retrorestservice;

import lombok.extern.log4j.Log4j2;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
@Log4j2
public class RetroRestServiceApplication {


	public static void main(String[] args) {
		SpringApplication.run(RetroRestServiceApplication.class, args);
		log.info("Retro service app has been started on http://localhost:8080/");
	}

}
