package com.speed.speed_vendas.modules.mobile.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.speed.speed_vendas.modules.mobile.dto.MobileDTO;
import com.speed.speed_vendas.modules.mobile.entities.MobileEntity;
import com.speed.speed_vendas.modules.mobile.useCases.RegisterUseUseCase;
import com.speed.speed_vendas.utils.FileUtils;

@RequestMapping("/api/mobile")
public class MobileController {

    @Autowired
    private RegisterUseUseCase registerUserUseCase;

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
}
