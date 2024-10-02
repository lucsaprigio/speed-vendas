package com.speed.speed_vendas.modules.mobile.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speed.speed_vendas.modules.mobile.dto.MobileDTO;
import com.speed.speed_vendas.modules.mobile.dto.UserDTO;
import com.speed.speed_vendas.modules.mobile.entities.MobileEntity;
import com.speed.speed_vendas.modules.mobile.useCases.RegisterUseUseCase;
import com.speed.speed_vendas.utils.FileUtils;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.speed.speed_vendas.modules.mobile.useCases.ActiveUserUseCase;
import com.speed.speed_vendas.modules.mobile.useCases.FindUserUseCase;
import com.speed.speed_vendas.modules.mobile.useCases.ListUsersUseCase;

@RestController
@RequestMapping("/api/mobile")
public class MobileController {

    @Autowired
    private RegisterUseUseCase registerUserUseCase;

    @Autowired
    private FindUserUseCase findUserUseCase;

    @Autowired
    private ActiveUserUseCase activeUserUseCase;

    @Autowired
    private ListUsersUseCase listUsersUseCase;

    @PostMapping("/")
    public ResponseEntity<Object> createData(@RequestBody MobileDTO mobileDTO) {
        try {
            MobileEntity mobileInfo = new MobileEntity();

            String md5String = mobileDTO.getMd5().substring(0, Math.min(mobileDTO.getMd5().length(), 40));

            mobileInfo.setCnpj(mobileDTO.getCnpj());
            mobileInfo.setMd5(md5String);

            String content = "|1|" + mobileDTO.getMd5() + "|" + mobileDTO.getCnpj() + "|";

            byte[] file = FileUtils.generateArchive(md5String, content);

            mobileInfo.setArquivo(file);
            mobileInfo.setAtivo("N");

            MobileEntity result = registerUserUseCase.execute(mobileInfo);

            return ResponseEntity.ok().body(result);

        } catch (Exception e) {
            System.out.print(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/fetch/{deviceId}")
    public ResponseEntity<Object> findUsersByMd5(@PathVariable("deviceId") String md5) {
        try {
            String fileReaded = FileUtils.readArchive(md5);

            return ResponseEntity.ok().body(fileReaded);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/user")
    public ResponseEntity<Object> findUser(@RequestBody MobileDTO mobileDTO) {
        try {
            MobileEntity result = findUserUseCase.execute(mobileDTO);

            return ResponseEntity.ok().body(result);
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/active-user")
    public ResponseEntity<Object> activeUser(@RequestBody UserDTO userDTO) {
        try {
            MobileEntity updatedUser = activeUserUseCase.execute(userDTO);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<MobileEntity>> listAllUsers() {
        try {
            List<MobileEntity> result = listUsersUseCase.execute();

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

}
