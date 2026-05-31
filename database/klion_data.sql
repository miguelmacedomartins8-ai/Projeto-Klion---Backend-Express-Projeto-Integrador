CREATE DATABASE klion_data;

USE klion_data;

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_usuario VARCHAR(160) NOT NULL,
    email_usuario VARCHAR(180) NOT NULL,
    senha_usuario VARCHAR(255) NOT NULL
);

CREATE TABLE info_usuario_calculo (
    id_infoCalculo INT AUTO_INCREMENT PRIMARY KEY,
    renda_anual DECIMAL(9, 2),
    deducoes DECIMAL(9, 2),
    dependentes INTEGER,
    fk_id_usuario INT,
    fk_id_tabela_aliquota INT,
    FOREIGN KEY (fk_id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_id_tabela_aliquota) REFERENCES tabela_aliquota(id_tabela_aliquota)
);

CREATE TABLE resultado_calculo (
    id_resultado_calculo INT AUTO_INCREMENT PRIMARY KEY,
    base_calculo DECIMAL(9, 2),
    imposto_estimado DECIMAL(9, 2),
    aliquota_efetiva VARCHAR(6),
    renda_liquida DECIMAL(9, 2),
    fk_id_usuario INT,
    FOREIGN KEY (fk_id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE tabela_aliquota (
    id_tabela_aliquota INT AUTO_INCREMENT PRIMARY KEY,
    faixa INT NOT NULL,
    limite_reais VARCHAR(20) NOT NULL,
    aliquota VARCHAR(6) NOT NULL
);

INSERT INTO tabela_aliquota (faixa, limite_reais, aliquota) VALUES
(1, '24511.92', '0'),
(2, '33919.80', '7.5'),
(3, '45012.60', '15'),
(4, '55976.16', '22.5'),
(5, '999999999', '27.5');

-- ####################################################################

-- 1. View — Informações do Usuário com Dados da Calculadora
-- Combina dados do usuário com os parâmetros da calculadora. Usada no perfil detalhado.
CREATE OR REPLACE VIEW vw_info_usuario_calculadora AS
SELECT
u.id AS usuario_id,
u.nome,
u.email,
c.id AS calculo_id,
c.renda_anual,
c.deducoes,
c.dependentes,
c.createdAt AS data_calculo
FROM Usuarios u
INNER JOIN info_usuario_calculo c ON c.fk_id = u.id
ORDER BY c.createdAt DESC;


-- 2. View — Resultado da Calculadora (Histórico)
-- Calcula o imposto estimado pela tabela progressiva IRPF 2024. Usada no histórico de simulações.
CREATE OR REPLACE VIEW vw_resultado_calculadora AS
SELECT
c.id AS calculo_id,
u.id AS usuario_id,
u.nome,
c.renda_anual,
c.deducoes,
c.dependentes,
GREATEST(
c.renda_anual - c.deducoes - (c.dependentes * 189.59 * 12),
0
) AS base_calculo,
CASE
WHEN GREATEST(c.renda_anual - c.deducoes - (c.dependentes * 189.59 * 12), 0)
<= 24511.92 THEN 0
WHEN GREATEST(c.renda_anual - c.deducoes - (c.dependentes * 189.59 * 12), 0)
<= 33919.80 THEN
GREATEST(c.renda_anual - c.deducoes - (c.dependentes * 189.59 * 12), 0) * 0
.075 - 1838.39
WHEN GREATEST(c.renda_anual - c.deducoes - (c.dependentes * 189.59 * 12), 0)
<= 45012.60 THEN
GREATEST(c.renda_anual - c.deducoes - (c.dependentes * 189.59 * 12), 0) * 0
.15 - 4382.38
WHEN GREATEST(c.renda_anual - c.deducoes - (c.dependentes * 189.59 * 12), 0)
<= 55976.16 THEN
GREATEST(c.renda_anual - c.deducoes - (c.dependentes * 189.59 * 12), 0) * 0
.225 - 7758.32
ELSE
GREATEST(c.renda_anual - c.deducoes - (c.dependentes * 189.59 * 12), 0) * 0
.275 - 10557.13
END AS imposto_estimado,
c.createdAt AS data_calculo
FROM info_usuario_calculo c
INNER JOIN Usuarios u ON u.id = c.fk_id
ORDER BY c.createdAt DESC;



-- 3. View — Tabela Progressiva do IRPF (referência + cálculo)
-- Faixas da tabela IRPF 2024. Usada para exibir a tabela na UI e pelo backend durante o cálculo.
CREATE OR REPLACE VIEW vw_tabela_irpf AS
SELECT 1 AS faixa, 'Isento' AS descricao,
0.00 AS limite_inferior, 24511.92 AS limite_superior,
0.000 AS aliquota, 0.00 AS deducao_fixa
UNION ALL
SELECT 2, '7,5%', 24511.93, 33919.80, 0.075, 1838.39
UNION ALL
SELECT 3, '15%', 33919.81, 45012.60, 0.150, 4382.38
UNION ALL
SELECT 4, '22,5%', 45012.61, 55976.16, 0.225, 7758.32
UNION ALL
SELECT 5, '27,5%', 55976.17, NULL, 0.275, 10557.13;
-- 4. Select — Nome e E-mail (Perfil)
-- Query direta na tabela Usuarios. Sem view por ser simples.
SELECT
id,
nome,
email
FROM Usuarios
WHERE id = :usuario_id;