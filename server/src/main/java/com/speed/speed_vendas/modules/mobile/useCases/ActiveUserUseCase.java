package com.speed.speed_vendas.modules.mobile.useCases;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.speed.speed_vendas.modules.mobile.dto.UserDTO;
import com.speed.speed_vendas.modules.mobile.entities.MobileEntity;
import com.speed.speed_vendas.modules.mobile.repositories.MobileRepository;

@Service
public class ActiveUserUseCase {

    @Autowired
    private MobileRepository mobileRepository;

    public MobileEntity execute(UserDTO userDTO) {

        // Criar uma variável dos dados da entidade
        Optional<MobileEntity> userExists = this.mobileRepository.findByMd5AndCnpj(userDTO.getMd5(), userDTO.getCnpj());

        // A variável acima faz a busca do usuário, trazendo todas as informações
        if (userExists.isPresent()) {
            MobileEntity user = userExists.get(); // Pegar os dados do usuário

            user.setAtivo(userDTO.getAtivo()); // Altero somente o Ativo que vai vir S do Request

            return mobileRepository.save((user)); // Por fim salvar dentro do banco de dados.
        } else {
            throw new RuntimeException("Usuário não encontrado");
        }
    }

}
