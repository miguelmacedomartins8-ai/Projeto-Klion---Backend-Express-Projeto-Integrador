CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_usuario VARCHAR(160) NOT NULL,
    email_usuario VARCHAR(180) NOT NULL,
    senha_usuario VARCHAR(255) NOT NULL
);

CREATE TABLE info_usuario_calculo (
    id_infoCalculo  INT AUTO_INCREMENT PRIMARY KEY,
    renda_anual DECIMAL(9, 2),
    deducoes DECIMAL(9, 2),
    dependentes INTEGER,
    fk_id_usuario INT,
    FOREIGN KEY (fk_id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE resultado_calculo (
    base_calculo DECIMAL(9, 2),
    imposto_estimado DECIMAL(9, 2),
    aliquota_efetiva VARCHAR(6),
    renda_liquida DECIMAL(9, 2),
    fk_id_usuario INT,
    FOREIGN KEY (fk_id_usuario) REFERENCES usuario(id_usuario)
)

CREATE TABLE tabela_aliquota (
    id_tabela_aliquota INT AUTO_INCREMENT PRIMARY KEY,
    faixa INT NOT NULL,
    limite_reais VARCHAR(20),
    aliquota VARCHAR(6)
);

-- ####################################################################