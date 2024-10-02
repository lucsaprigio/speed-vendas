package com.speed.speed_vendas.modules.mobile.useCases;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.speed.speed_vendas.modules.mobile.entities.MobileEntity;
import com.speed.speed_vendas.modules.mobile.repositories.MobileRepository;

@Service
public class ListUsersUseCase {

    @Autowired
    private MobileRepository mobileRepository;

    public List<MobileEntity> execute() {
        return this.mobileRepository.findAll();
    }
}
